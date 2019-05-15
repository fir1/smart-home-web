const express = require('express');
const adminControl=require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

/**
 * All the routes for the authenticated users can be found in the below.
 * Any request that front end sends to the server will be served based on the below routes and controllers
 */

router.get('/overview',isAuth,adminControl.getOverview); //the get request will be step by step /overview will be request then check isAuth if it is authenticated then getOveview route

router.get('/lights',isAuth,adminControl.getLight);

router.get('/plug',isAuth,adminControl.getPlug);

router.get('/door',isAuth,adminControl.getDoor);

router.get('/airconditioner',isAuth,adminControl.getAirConditioner);

router.get('/controlPanel',isAuth,adminControl.getControlPanel);

router.post('/add-device',isAuth,adminControl.postAddDevice);

router.post('/set-time/:deviceId',isAuth,adminControl.postSetTime);

router.post('/state-change/:deviceId',isAuth,adminControl.postStateChange);

router.post('/state-change-all',isAuth,adminControl.postStateChangeAll);

router.post('/update-profile',isAuth,adminControl.postUpdateUsername);

router.post('/update-graph',isAuth,adminControl.postUpdateGraph);

router.post('/update-password',isAuth,adminControl.postUpdatePassword);

router.delete('/device/:deviceId', isAuth, adminControl.deleteDevice); //:deviceId will be dynamic because delete request will have a value for deviceId


module.exports = router;
