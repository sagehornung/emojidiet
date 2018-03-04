'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');

const register = require('./functions/register');
const login = require('./functions/login');
const profile = require('./functions/profile');
const password = require('./functions/password');
const config = require('./config/config.json');
const cors = require('cors');
const Meal = require('./models/meal');
let request = require('request');
let mongoose = require('mongoose');
let moment = require('moment');
const user = require('./models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");



module.exports = router => {

  router.get('/', cors(), (req, res) => res.end('Welcome to the emoji diet app !'));

  router.get('/quote', cors(),  (req, res) => {
    request('http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en', function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      if(error) {
        res.status(500).json({message: "Unable to get a quote"});
      }
      res.status(200).send(body);
    });
  });

  router.post('/authenticate', cors(), (req, res) => {

    const credentials = auth(req);

    console.log(credentials);

    if (!credentials) {

      res.status(400).json({ message: 'Invalid Request !' });

    } else {

      login.loginUser(credentials.name, credentials.pass)

        .then(result => {
          console.log('USER LOGIN RESULT', result);
          const token = jwt.sign(result, config.secret, { expiresIn: 1440 });

          res.status(result.status).json({ message: result.message, token: token, userId: result.id });

        })

        .catch(err => res.status(err.status).json({ message: err.message }));
    }
  });

  router.post('/users', cors(), (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    // console.log('REQ', req);
    console.log('Server Side Stuff', name, email, password);

    if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

      res.status(400).json({message: 'Invalid Request !'});

    } else {

      register.registerUser(name, email, password)

        .then(result => {

          res.setHeader('Location', '/users/'+ email);
          res.status(result.status).json({ message: result.message })
        })

        .catch(err => res.status(err.status).json({ message: err.message }));
    }
  });

  router.get('/users/:id', cors(), (req,res) => {

    if (checkToken(req)) {

      profile.getProfile(req.params.id)

        .then(result => res.json(result))

        .catch(err => res.status(err.status).json({ message: err.message }));

    } else {

      res.status(401).json({ message: 'Invalid Token !' });
    }
  });

  router.put('/users/:id', cors(), (req,res) => {

    if (checkToken(req)) {

      const oldPassword = req.body.password;
      const newPassword = req.body.newPassword;

      if (!oldPassword || !newPassword || !oldPassword.trim() || !newPassword.trim()) {

        res.status(400).json({ message: 'Invalid Request !' });

      } else {

        password.changePassword(req.params.id, oldPassword, newPassword)

          .then(result => res.status(result.status).json({ message: result.message }))

          .catch(err => res.status(err.status).json({ message: err.message }));

      }
    } else {

      res.status(401).json({ message: 'Invalid Token !' });
    }
  });

  router.post('/users/password/new', cors(), (req,res) => {

    console.log('BODY', req.body);

    const email = req.body.email;
    const token = req.body.pwOld;
    const password = req.body.password;

    console.log('PW new ', email, token, password);

    user.find({email: email})

      .then(users => {

        let user = users[0];

        const diff = new Date() - new Date(user.temp_password_time);
        const seconds = Math.floor(diff / 1000);
        console.log(`Seconds : ${seconds}`);

        if (seconds < 3600) {
          return user;
        } else {
          // reject({status: 401, message: 'Time Out ! Try again'});
          res.status(401).json({message: 'Time Out ! Try again'});
        }

      }).then(user => {

        console.log('COMPARE', token, user.temp_password);

      if (bcrypt.compareSync(token, user.temp_password)) {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user.hashed_password = hash;
        user.temp_password = undefined;
        user.temp_password_time = undefined;

        user.save();
        res.status(201).json({message: 'PW Updated'});

      } else {

        res.status(401).json({message: 'Invalid Token !'});
      }
    });

  });
  //Forgot pw
  router.post('/users/password', cors(), (req,res) => {


    const email = req.body.email;
    const token = req.body.token;
    const newPassword = req.body.password;
    const hash = '';

    if (!token || !newPassword || !token.trim() || !newPassword.trim()) {

      // password.resetPasswordInit(email)
      //   .then(result => res.status(result.status).json({ message: result.message }))
      //   .catch(err => res.status(err.status).json({ message: err.message }));
      // const random = randomstring.generate(8);

        console.log('This is a test 2');
        const random = randomstring.generate(8);

        user.find({ email: email })

          .then(users => {
            console.log('Found a user', users);
            if (users.length === 0) {
              res.status(404).json({message: 'User Not Found !' });
              // reject({ status: 404, message: 'User Not Found !' });

            } else {

              let user = users[0];

              const salt = bcrypt.genSaltSync(10);
              const hash = bcrypt.hashSync(random, salt);

              user.temp_password = hash;
              user.temp_password_time = new Date();

              return user.save();
            }
          })

          .then(user => {

            // const transporter = nodemailer.createTransport(`smtps://${config.email}:${config.password}@smtp.gmail.com`);
            // const transporter = nodemailer.createTransport({
            let transporter = nodemailer.createTransport({
              host: 'smtp.gmail.com',
              port: 465,
              secure: true,
              auth: {
                user: config.email,
                pass: config.password
              }
            });

            //   service: 'gmail',
            //   auth: {
            //     user: config.email,
            //     pass: config.password
            //   }
            // });

            const mailOptions = {

              from: `"${config.name}" <${config.email}>`,
              to: email,
              subject: 'Reset Password Request ',
              html: `Hello ${user.name},

          Here is your temporary password 
          
          ${random}
    			
    			Click this <a href="localhost:4200/login">link</a>. and click on Make new Password to create a new password
    			The token is valid for only 1 hour.

    			Thanks,
    			Emoji Diet Team.`

            };
            console.log('mail Ops', mailOptions);
            transporter.sendMail(mailOptions, (error, info) => {
              console.log('MAIL ERR', error);
              if (error) {
                res.status(500).json({message: 'Something went wrong' });
                return;
              }
              res.status(200).json({ message: 'Check mail for instructions'  });

            });

          });

    } else {

      password.resetPasswordFinish(email, token, newPassword)

        .then(result => res.status(result.status).json({ message: result.message }))

        .catch(err => res.status(err.status).json({ message: err.message }));
    }
  });

  function checkToken(req) {

    const token = req.headers['x-access-token'];
    console.log('TOKEN', token);
    if (token) {

      try {

        let decoded = jwt.verify(token, config.secret);
        console.log('DECODED', decoded, decoded.message === req.params.id, req.params.id);
        return decoded.message === req.params.id;

      } catch(err) {

        return false;
      }

    } else {

      return false;
    }
  }

  function authorize(req, id) {
    const token = req.headers['x-access-token'];
    console.log('TOKEN', token, id);
    if (token) {
      try {
        var decoded = jwt.verify(token, config.secret);
        console.log('Decoded', decoded);
        return decoded.id === id;
      } catch(err) {
        return false;
      }
    } else {
      return false;
    }
  }

  router.get('/meal/user/:id', cors(), (req,res) => {
    console.log('Found meals GET');
    let userId = req.params.id;
    //Want to auth
    if (authorize(req, userId)) {
      console.log('UserID', userId);
      const query = {userId: userId}
      const projection = {}

      const options = { sort: {created: -1}, limit: 50 }
      Meal.find(query, projection, options).exec(function(err, result) {
        res.status(200).json({data: result});
      });
      //Meal.find({userId: userId}).then( result => {
        //console.log('All meals', result);
        // res.status(200).json({data: result});
      // });
    } else {
      res.status(401).json({ message: 'Invalid Token !' });
    }
    // res.status(200).json({ data: 'Meal Get !' });
  });

  router.post('/meal', cors(), (req,res) => {

    const meal = req.body.meal;
    const user = req.body.username;
    const userId = req.body.userId;
    console.log('Meal', meal, 'Username', user);
    // const token = req.headers['x-access-token'];
    // var decoded = jwt.verify(token, config.secret);

      // if(decoded.message === user) {
      if (authorize(req, userId)) {

        // profile.getProfile(req.params.id)
        //   .then(result => res.json(result))
        //   .catch(err => res.status(err.status).json({ message: err.message }));
        let newMeal = new Meal({
          userId: userId,
          username: req.params.id,
          emotion: meal.emotion,
          pleasure: meal.pleasure,
          freebie: meal.freebie,
          points: meal.freebie > 0 ? 1 : Math.max(Number(meal.emotion), Number(meal.pleasure))
        });
        newMeal.save({meal: meal}).then(meal => {
          meal.save();
          res.status(201).json({ message: 'Meal Saved !' });
        });

      } else {

        res.status(401).json({ message: 'Invalid Token !' });
      }
    });

  router.put('/meal', cors(), (req,res) => {

    const meal = req.body.meal;
    const user = req.body.username;
    const userId = req.body.userId;
    console.log('Meal', meal, 'Username', user);

    if (authorize(req, userId)) {

      let newMeal = new Meal({
        userId: userId,
        username: req.params.id,
        emotion: meal.emotion,
        pleasure: meal.pleasure,
        freebie: meal.freebie,
        points: meal.freebie > 0 ? 1 : Math.max(Number(meal.emotion), Number(meal.pleasure))
      });
      Meal.findByIdAndUpdate(meal.id,
        { $set:
            { emotion: newMeal.emotion,
              pleasure: newMeal.pleasure,
              freebie: newMeal.freebie,
              points: newMeal.points
            }
          },
        { new: true },
        function (err, meal) {
          // if (err) {
          //   res.status(500);
          // }
          res.status(201).json({ message: 'Meal Updated !' });
        });
    } else {

      res.status(401).json({ message: 'Invalid Token !' });
    }
  });

  router.delete('/meal/:id/user/:uid', cors(), (req,res) => {
    let userId = req.params.uid;
    let mealId = req.params.id;
    if (authorize(req, userId)) {
      Meal.remove({_id: mealId}, function (err) {
        if (err) {
          //return handleError(err);
        }
        res.status(202).json({ message: 'Meal Deleted !' });
      });
    } else {
      res.status(401).json({ message: 'Invalid Token !' });
    }
  });



  router.get('/scores/:id', cors(), (req, res) => {

    const user = req.body.username;
    let userId = req.params.id;

    console.log('USER', user);
    if (authorize(req, userId)) {

      var today = new Date(),
        oneDay = ( 1000 * 60 * 60 * 24 ),
        beginningOfDay = moment().startOf('day').toDate(),
        thirtyDays = new Date( today.valueOf() - ( 30 * oneDay ) ),
        fourteenDays = new Date( today.valueOf() - ( 14 * oneDay ) ),
        sevenDays = new Date( today.valueOf() - ( 7 * oneDay ) );

      let scores = [];
      let dayScore = Meal.aggregate([
        { $match:
            {"userId": mongoose.Types.ObjectId(userId), "created": {"$gte": beginningOfDay}}
        },
        { $group : { _id : null, day_score : { $avg : '$points' } } }
      ]);
      let weekScore = Meal.aggregate([
        { $match:
            {"userId": mongoose.Types.ObjectId(userId), "created": {"$gte": sevenDays}}
        },
        { $group : { _id : null, current_week_score : { $avg : '$points' } } }
      ]);
      let lastWeekScore = Meal.aggregate([
        { $match:
            {"userId": mongoose.Types.ObjectId(userId), "created": {"$gte": fourteenDays, "$lt": sevenDays}}
        },
        { $group : { _id : null, last_week_score : { $avg : '$points' } } }
      ]);
      let monthScore = Meal.aggregate([
        { $match:
            {"userId": mongoose.Types.ObjectId(userId), "created": {"$gte": thirtyDays}}
        },
        { $group : { _id : null, month_score : { $avg : '$points' } } }
      ]);
      let totalScore = Meal.aggregate([
        { $match: {"userId": mongoose.Types.ObjectId(userId)}},
        { $group : { _id : null, total_score : { $avg : '$points' } } }
      ]);
      scores.push(dayScore);
      scores.push(weekScore);
      scores.push(lastWeekScore);
      scores.push(monthScore);
      scores.push(totalScore);
      Promise.all(scores).then(function(data) {
        console.log('DATA SCORES', data);
        const scores = {
          day:          data[0].day_score,
          current_week: data[1].current_week_score,
          last_week:    data[2].last_week_score,
          month:        data[3].month_score,
          total:        data[4].total_score,
        };
        res.status(201).json(data);
      });

    } else {
      res.status(401).json({ message: 'Invalid Token !' });
    }




  });

};
