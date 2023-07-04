import os
import jwt
from datetime import date, timedelta, datetime
from flask import Flask, request, render_template, redirect, session, g, flash, jsonify, send_from_directory
from .prompts import get_nutritional_info
from .dbOperations import add_meals, get_daily_total, list_of_days_meals, delete_meals, add_user, DBSession, User, Meal, get_user, get_meals_and_totals_last_Ndays
from flask_cors import CORS
from functools import wraps


app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

CORS(app, supports_credentials=True)

#APIS

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        auth_header = request.headers.get('Authorization')
        if auth_header:
            token = auth_header.split(" ")[1]  # Extract token from "Bearer <token>"
        if not token:
            return jsonify({'message': 'Token is missing'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = get_user(data['email'])
        except Exception as e:
            print(str(e))
            return jsonify({'message': 'Token is invalid'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

@app.route("/api/login", methods=["POST"])
def api_login():
    data = request.get_json()
    try:
        email = data["email"]
        password = data["password"]
        user = get_user(email)
        if not user:
            return jsonify({'message': 'User not found'}), 401

        if user and user.check_password(password):
            token = jwt.encode({'email': user.email, 'exp': datetime.utcnow() + timedelta(days=7)}, app.config['SECRET_KEY'], algorithm="HS256")
            return jsonify({'token': token})

        return jsonify({"error": "Invalid E-Mail or password"}), 401
    except Exception as error:
        print(error)
        return jsonify({"error": "An error occurred during login"}), 500

@app.route("/api/register", methods=["POST"])
def api_register():
    try:
        data = request.get_json()
        email = data["email"]
        password = data["password"]
        name = data["name"]
        user = get_user(email)
        if user:
            # If user already exists, return an error response
            return jsonify({"error": "E-Mail already in use"}), 400
        else:
            # Create a new user
            ret_email = add_user(email, password, name)

            # Return a success response
            return jsonify({"message": "Registered successfully", "user": {"email": ret_email}}), 201
    except Exception as error:
        print(error)
        return jsonify({"error": "An error occurred during registration"}), 500

@app.route("/api/v1/meals/nutritional-info", methods=["POST"])
@token_required
def get_meal_info(_):
    try:
        food_description = request.json["description"]
        nutritional_info = get_nutritional_info(food_description)
        if nutritional_info['calories'] == 'error':
            return jsonify({"error": "Your query was not understood. Please try again."}), 400

        return jsonify(nutritional_info), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": "An error occurred while processing your request"}), 500

@app.route("/api/v1/meals/save", methods=["POST"])
@token_required
def log_meal(current_user):
    try:
        meal_data = request.json
        meal = {
            'meal': meal_data['mealInfo']['food_description'],
            'calories': meal_data['mealInfo']['calories'],
            'carbohydrates': meal_data['mealInfo']['carbohydrates'],
            'protein': meal_data['mealInfo']['protein'],
            'fat': meal_data['mealInfo']['fat'],
            'sodium': meal_data['mealInfo']['sodium'],
            'explanation': meal_data['mealInfo']['explanation'],
            'date': datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            'user_email': current_user.email
        }
        add_meals(meal)
        return jsonify({"message": "Meal logged successfully"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": "An error occurred while processing your request"}), 500

@app.route("/api/v1/meals/today", methods=["GET"])
@token_required
def get_meals(current_user):
    try:
        user_email = current_user.email
        todaysMeals = list_of_days_meals(user_email, date.today())
        dailyTotal = get_daily_total(user_email, date.today())
        return jsonify({
            "meals": todaysMeals,
            "dailyTotal": dailyTotal
        }), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": "An error occurred while processing your request"}), 500

@app.route("/api/v1/meals/history", methods=["GET"])
@token_required
def get_meals_last_Ndays(current_user):
    try:
        user_email = current_user.email
        meals_and_totals = get_meals_and_totals_last_Ndays(user_email, 30)
        return jsonify(meals_and_totals), 200
    except Exception as e:
        print(str(e))
        return jsonify({"error": "An error occurred while processing your request"}), 500

if __name__ == "__main__":
    app.run(debug=True)