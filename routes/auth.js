const express = require('express');
const { check , body} = require('express-validator/check')
const User = require('../models/user');


const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.post('/login',
    [
        body('email')
            .isEmail()
            .withMessage('enter valid email')
            .normalizeEmail(),
        body('password', 'enter valid password')
            // .isLength({ min: 5})
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin);

router.post('/signup', 
  [ 
    check('email')
    .isEmail()
    .withMessage('enter valid email')
    .custom((value ,{req}) => {
        // if(value === 'test1@test.com'){
        //     throw new Error('forbiden email')
        // }
        // return true
      return User
        .findOne({ email: value })
        .then(userDoc => {
            if (userDoc) {
                return Promise.reject('E-Mail exists already, please pick a different one.')
            }
        })
    })
    .normalizeEmail(),
    body('password', 'enter password with only numbers and text and utleast 5 characters')
        .isLength({min: 5})
        .isAlphanumeric()
        .trim(),
    body('confirmPassword')
        .trim()
        .custom((value, {req}) => {
            if(value !== req.body.password){
                throw new Error('passwords have to match')
            }
            return true
         })  
  ],
  authController.postSignup);

router.post('/logout', authController.postLogout);

module.exports = router;