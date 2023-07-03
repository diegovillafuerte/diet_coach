import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Input from '../components/common/input';
import { useAuth } from '../utils/authentication'; // Assuming AuthContext is defined in the same directory
import { Container, Row, Col, Button, FormControl, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/elements/header.js';
import MealHistory from '../components/elements/MealHistory.jsx';
import '../components/style/styles.css'; // or wherever your CSS file is located
import { Spinner } from 'react-bootstrap';



const ProgressTracker = () => {
  const [mealDescription, setMealDescription] = useState('');
  const [mealInfo, setMealInfo] = useState(null);
  const [todayMeals, setTodayMeals] = useState([]);
  const [mealHistory, setMealHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Extract logout function from useAuth
  const { logout } = useAuth();

  const handleMealSearch = async () => {
  try {
    setIsLoading(true);
    // Get the user's token from local storage
    const token = localStorage.getItem('token');

    // Call the API with the meal description and token to get nutritional information
    const response = await axios.post('http://127.0.0.1:5000/api/v1/meals/nutritional-info', { description: mealDescription }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const full_response = response.data;
    full_response['food_description'] = mealDescription;
    setMealInfo(full_response);
    setMealDescription('');
    setIsLoading(false);
  } catch (error) {
    console.error(error);
    setIsLoading(false);
  }
};

  const handleMealLog = async () => {
    try {
      const token = localStorage.getItem('token');
      // Call the API to log the meal
      await axios.post('http://127.0.0.1:5000/api/v1/meals/save', { mealInfo }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMealInfo(null);
      // Re-fetch meals
      fetchTodayMeals();
      fetchMealHistory();
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodayMeals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:5000/api/v1/meals/today', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodayMeals(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMealHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log("A la funcion si entro")
      const response = await axios.get('http://127.0.0.1:5000/api/v1/meals/history', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMealHistory(response.data);
      console.log("aqui andooo")
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTodayMeals();
    fetchMealHistory();
  }, []);

  return (
    <>
    <Header />
    <div className="p-3 bg-secondary text-white my-3">
    <div className="d-flex flex-column align-items-center justify-content-center">
        <div style={{ textAlign: 'justify' }}>
          <h5>Start logging your meals</h5>
        </div>
        <Row className="my-3">
          <Col xs={12} lg={8} className="mx-lg-3">
          <FormControl 
            className="mb-2 mb-lg-0" 
            type="text" 
            value={mealDescription} 
            onChange={e => setMealDescription(e.target.value)} 
            onKeyPress={event => {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent form submission
                    handleMealSearch(); // Call the function when Enter is pressed
                }
            }}
            placeholder="Meal Description"/>
<div className="d-flex justify-content-center mt-2">
    <button onClick={handleMealSearch} type="button" className="align-items-center btn btn-warning me-2">
        {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
    </button>
</div>        
          </Col>
        </Row>
      </div>
    </div>


      {mealInfo && (
        <div className="py-3">
          {/* Show the nutritional information and Log/Delete buttons */}
          {/* Each meal info as separate row for better readability on mobile screens */}
          <Row><Col xs={12}><p>Meal Name: {mealInfo.food_description}</p></Col></Row>
          <Row><Col xs={12}><p>Calories: {mealInfo.calories}</p></Col></Row>
          <Row><Col xs={12}><p>Carbohydrates: {mealInfo.carbohydrates}</p></Col></Row>
          <Row><Col xs={12}><p>Protein: {mealInfo.protein}</p></Col></Row>
          <Row><Col xs={12}><p>Fat: {mealInfo.fat}</p></Col></Row>
          <Row><Col xs={12}><p>Sodium: {mealInfo.sodium}</p></Col></Row>
          <Row>
            <Col xs={6}><Button variant="success" onClick={handleMealLog}>Log Meal</Button></Col>
            <Col xs={6}><Button variant="danger" onClick={() => setMealInfo(null)}>Delete</Button></Col>
          </Row>
        </div>
      )}

      <div className="py-3"> 
        <h5>Today's Meals</h5>
        <Table striped bordered hover responsive="md">
          <thead>
            <tr>
              <th>Meal</th>
              <th>KCals</th>
              <th>Carbs</th>
              <th>Fat</th>
              <th>Prot</th>
              <th>Sod.</th>
            </tr>
          </thead>
          <tbody>
          {todayMeals && todayMeals.meals && todayMeals.meals.map((meal, i) => (
            <tr key={i}>
                <td>{meal.meal}</td>
                <td>{meal.calories}</td>
                <td>{meal.carbohydrates}</td>
                <td>{meal.fat}</td>
                <td>{meal.protein}</td>
                <td>{meal.sodium}</td>
            </tr>
          ))}
          {todayMeals && todayMeals.dailyTotal && (
            <tr>
                <td><strong>Total</strong></td>
                <td><strong>{todayMeals.dailyTotal.calories}</strong></td>
                <td><strong>{todayMeals.dailyTotal.carbohydrates}</strong></td>
                <td><strong>{todayMeals.dailyTotal.fat}</strong></td>
                <td><strong>{todayMeals.dailyTotal.protein}</strong></td>
                <td><strong>{todayMeals.dailyTotal.sodium}</strong></td>
            </tr>
          )}
          </tbody>
        </Table>
      </div>


      <div>
      <MealHistory mealHistory={mealHistory} />
    </div>


      <Row>
            <Col xs={12} className="d-flex justify-content-center align-items-center" style={{height: "100vh"}}>
                <Button variant="danger" onClick={logout}>Log Out</Button>
            </Col>
        </Row>
    </>
  );
};

export default ProgressTracker;