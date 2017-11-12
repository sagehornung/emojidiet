// 'use strict';
//
// const Meal = require('../models/meal');
//
// exports.saveMeal = saveMeal;
//
// function saveMeal(username, meal) {
//
//   new Promise((resolve, reject) => {
//     let newMeal = new Meal({
//       username: username,
//       emotion: meal.emotion,
//       pleasure: meal.pleasure
//     });
//     newMeal.save({meal: meal}).then(meal => {
//       meal.save();
//     })
//       .then(meal => resolve(meal))
//       .catch(err => reject({status: 500, message: 'Internal Server Error !'}))
//   });
// }
