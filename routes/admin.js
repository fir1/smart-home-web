const path = require('path');
const express = require('express');
const adminControl=require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/overview',isAuth,adminControl.getOverview); //the get request will be step by step /overview will be request then check isAuth if it is then getOveview route

router.post('/add-device',isAuth,adminControl.postAddDevice);

router.post('/set-time/:deviceId',isAuth,adminControl.postSetTime);

router.post('/state-change/:deviceId',isAuth,adminControl.postStateChange);

router.post('/state-change-all',isAuth,adminControl.postStateChangeAll);

router.post('/update-profile',isAuth,adminControl.postUpdateProfile);

router.post('/update-password',isAuth,adminControl.postUpdatePassword);

router.get('/lights',isAuth,adminControl.getLight);

router.get('/plug',isAuth,adminControl.getPlug);

router.get('/door',isAuth,adminControl.getDoor);

router.get('/airconditioner',isAuth,adminControl.getAirConditioner);

router.get('/controlPanel',isAuth,adminControl.getControlPanel);

router.delete('/device/:deviceId', isAuth, adminControl.deleteDevice); //:deviceId will be dynamic because delete request will have a value for deviceId


module.exports = router;
