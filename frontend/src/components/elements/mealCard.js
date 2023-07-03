import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils } from '@fortawesome/free-solid-svg-icons';
import '../style/mealCard.css';  // Assuming you will place the CSS in this file

const MealCard = ({ meal }) => {
  return (
    <div className="card meal-card mb-4">
      <div className="card-body">
        <h5 className="card-title">
          <FontAwesomeIcon icon={faUtensils} className="mr-4" />
          <strong>{meal.name}</strong>
        </h5>
        <div className="row">
          <div className="col-3">
            <p className="info-number">{meal.calories}</p>
            <p className="info-text">Calories</p>
          </div>
          <div className="col-3">
            <p className="info-number">{meal.carbohydrates}</p>
            <p className="info-text">Carbohydrates</p>
          </div>
          <div className="col-3">
            <p className="info-number">{meal.fat}</p>
            <p className="info-text">Fat</p>
          </div>
          <div className="col-3">
            <p className="info-number">{meal.protein}</p>
            <p className="info-text">Protein</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
