
'use strict';

const user = require('../models/user');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const randomstring = require("randomstring");
const config = require('../config/config.json');
const async = require('async');


exports.changePassword = (email, password, newPassword) =>

  new Promise((resolve, reject) => {

    user.find({ email: email })

      .then(users => {

        let user = users[0];
        const hashed_password = user.hashed_password;

        if (bcrypt.compareSync(password, hashed_password)) {

          const salt = bcrypt.genSaltSync(10);
          const hash = bcrypt.hashSync(newPassword, salt);

          user.hashed_password = hash;

          return user.save();

        } else {

          return reject({ status: 401, message: 'Invalid Old Password !' });
        }
      })

      .then(user => {
        return resolve({ status: 200, message: 'Password Updated Sucessfully !' })
      })

      .catch(err => {
        return reject({ status: 500, message: 'Internal Server Error !' })
      });

  });

exports.forgot = function(req, res) {

  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          return done('Something went wrong');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
    function(token, user, done) {

      const mailOptions = {

        from: `"${config.name}" <${config.email}>`,
        to: email,
        subject: 'Reset Password Request ',
        html: `Hello ${user.name},

    			     Your reset password token is <b>${random}</b>.
    			If you are viewing this mail from a Android Device click this <a href="http://learn2crack/${random}">link</a>.
    			The token is valid for only 2 minutes.

    			Thanks,
    			Emoji Diet.`

      };
      done(null, 'done');
    }
  ], function(err) {
    if (err) return res.json({message: err});
    return res.json({message: 'Success'});
  });
}

exports.resetPasswordInit = (email) => {
  console.log('This is a test');
  new Promise((resolve, reject) => {
    console.log('This is a test 2');
    const random = randomstring.generate(8);

    user.find({ email: email })

      .then(users => {
        console.log('Found a user', users);
        if (users.length == 0) {

          reject({ status: 404, message: 'User Not Found !' });

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
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: config.email,
            pass: config.password
          }
        });

        const mailOptions = {

          from: `"${config.name}" <${config.email}>`,
          to: email,
          subject: 'Reset Password Request ',
          html: `Hello ${user.name},

    			     Your reset password token is <b>${random}</b>.
    			If you are viewing this mail from a Android Device click this <a href="http://emjoidiet/${random}">link</a>.
    			The token is valid for only 2 minutes.

    			Thanks,
    			Emoji Diet Team.`

        };

        return transporter.sendMail(mailOptions);

      })

      .then(info => {

        console.log('INFO', info);
        resolve({ status: 200, message: 'Check mail for instructions' })
      })

      .catch(err => {

        console.log(err);
        reject({ status: 500, message: 'Internal Server Error !' });

      });
  });
};

exports.resetPasswordFinish = (email, token, password) =>

  new Promise((resolve, reject) => {

    user.find({ email: email })

      .then(users => {

        let user = users[0];

        const diff = new Date() - new Date(user.temp_password_time);
        const seconds = Math.floor(diff / 1000);
        console.log(`Seconds : ${seconds}`);

        if (seconds < 120) { return user; } else { reject({ status: 401, message: 'Time Out ! Try again' }); } }) .then(user => {

      if (bcrypt.compareSync(token, user.temp_password)) {

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        user.hashed_password = hash;
        user.temp_password = undefined;
        user.temp_password_time = undefined;

        return user.save();

      } else {

        reject({ status: 401, message: 'Invalid Token !' });
      }
    })

      .then(user => resolve({ status: 200, message: 'Password Changed Successfully !' }))

      .catch(err => reject({ status: 500, message: 'Internal Server Error !' }));

  });
