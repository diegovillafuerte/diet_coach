import React from 'react';
import { Table } from 'react-bootstrap';

class MealHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openedMeal: null, // Keeps track of which meal list is open
    };
  }

  toggleMeal = (index) => {
    this.setState((prevState) => ({
      openedMeal: prevState.openedMeal === index ? null : index
    }));
  }

  render() {
    const { mealHistory } = this.props;
    const { openedMeal } = this.state;

    if (!mealHistory) {
      return <div>Loading...</div>;
    }

    return (
      Object.keys(mealHistory).map((date, index) => {
        const meals = mealHistory[date].meals;
        const totals = mealHistory[date].totals;
        const isOpen = openedMeal === index;
        return (
          <div className="py-3" key={index}>
            <h5 onClick={() => this.toggleMeal(index)}>{date}</h5>
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
                {isOpen && meals.map((meal, i) => (
                  <tr key={i}>
                    <td>{meal.meal}</td>
                    <td>{meal.calories}</td>
                    <td>{meal.carbohydrates}</td>
                    <td>{meal.fat}</td>
                    <td>{meal.protein}</td>
                    <td>{meal.sodium}</td>
                  </tr>
                ))}
                <tr>
                  <td><strong>Total</strong></td>
                  <td><strong>{totals.calories}</strong></td>
                  <td><strong>{totals.carbohydrates}</strong></td>
                  <td><strong>{totals.fat}</strong></td>
                  <td><strong>{totals.protein}</strong></td>
                  <td><strong>{totals.sodium}</strong></td>
                </tr>
              </tbody>
            </Table>
          </div>
        );
      })
    );
  }
}

export default MealHistory;
