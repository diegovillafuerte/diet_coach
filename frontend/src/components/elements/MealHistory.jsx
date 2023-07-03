import React from 'react';

class MealHistory extends React.Component {
  render() {
    const { mealHistory } = this.props;

    if (!mealHistory) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        {Object.keys(mealHistory).map((date, index) => {
          const meals = mealHistory[date].meals;
          if (meals.length > 0) {
            const totals = mealHistory[date].totals;
            return (
              <div key={index}>
                <h2>{date}</h2>
                <p>Calories: {totals.calories}</p>
                <p>Carbohydrates: {totals.carbohydrates}</p>
                <p>Fat: {totals.fat}</p>
                <p>Protein: {totals.protein}</p>
                <p>Sodium: {totals.sodium}</p>
              </div>
            )
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}

export default MealHistory;
