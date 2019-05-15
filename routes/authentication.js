const express = require('express');

const authController = require('../controllers/authentication');

const router = express.Router();

/**
 * All the routes for the authentication, such as, login, registering, passwordReset can be found in the below.
 * Any request that front end sends to the server will be served based on the below routes and controllers
 */

router.get('/', authController.getLogin);

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/passwordReset',authController.getResetPassword);

router.get('/newPassword/:token',authController.getNewPassword); //:token will be used dynamiclly and the value of it is coming from the getNewPassword route

router.get('/confirmEmail/:token',authController.getEmailConfirmation); //:token will be used dynamiclly and the value of it is coming from the getNewPassword route

router.post('/login', authController.postLogin);

router.post('/signup', authController.postSignup);

router.post('/passwordReset',authController.postResetPassword);

router.post('/logout', authController.postLogout);

router.post('/newPassword',authController.postNewPassword);

router.post('/confirmEmail',authController.postEmailConfirmation);


module.exports = router;