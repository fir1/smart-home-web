const Device = require('../models/device');
const User = require('../models/user');
var moment = require('moment');

const nodemailer = require('nodemailer');
const sendGrid = require ('nodemailer-sendgrid-transport') //sendgrid is the 3rd party package,  in order to send emails to users


const transporter = nodemailer.createTransport(sendGrid({      //nodemailer will use the service of sendgrid to send emails
  auth:{
    api_key: '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'
  }
 })); 


exports.getOverview = (req, res, next) => {

  let thermo = [30, 20, -5, 90];
  const userId = req.user;

  var query = {
    userId
  };
  Device.find(query)
    .then(devices => {
      res.render('overview', {
        dev: devices,
        path: '/overview',
        activeButton: "checked",
        thermo: thermo,
        moment: moment,
        username: req.username //the req.username is the username of the person which is authenticated to use the system
      });
    })
};


exports.getLight = (req, res, next) => {

  const userId = req.user;
  const typeDevice = "light";

  var query = {
    userId,
    typeDevice
  };
  Device.find(query)
    .then(devices => {
      res.render('lights', {
        dev: devices,
        path: '/lights',
        activeButton: "checked",
        moment: moment,
        username: req.username
      });
    })
};


exports.getPlug = (req, res, next) => {

  const userId = req.user;
  const typeDevice = "plug";

  var query = {
    userId,
    typeDevice
  };
  Device.find(query)
    .then(devices => {
      res.render('plug', {
        dev: devices,
        path: '/plug',
        activeButton: "checked",
        moment: moment,
        username: req.username
      });
    })
};


exports.getDoor = (req, res, next) => {

  const userId = req.user;
  const typeDevice = "door";
  var query = {
    userId,
    typeDevice
  };

  Device.find(query)
    .then(devices => {
      res.render('door', {
        dev: devices,
        path: '/door',
        activeButton: "checked",
        moment: moment,
        username: req.username
      });
    })
};


exports.getAirConditioner = (req, res, next) => {

  const userId = req.user;
  const typeDevice = "ac";
  var query = {
    userId,
    typeDevice
  };

  Device.find(query)
    .then(devices => {
      res.render('airconditioner', {
        dev: devices,
        path: '/airconditioner',
        activeButton: "checked",
        moment: moment,
        username: req.username
      });
    })
};


exports.getControlPanel = (req, res, next) => {

  res.render('controlPanel', {
    path: '/controlPanel',
    username: req.username
  });
};


exports.postAddDevice = (req, res, next) => {
  const userId = req.user; //the user will be request from app.js
  const serialNumber = req.serialNumber;
  const name = req.body.deviceName; //req.body used in order to pull data from the front end HTML
  const typeDevice = req.body.typeDevice;

  var device = new Device({
    userId: userId,
    serialNumber: serialNumber,
    name: name,
    state: 'Off',
    startTime: '',
    finishTime: '',
    typeDevice: typeDevice
  });
  device.save()
    .then(result => {
      res.status(200).json({
        message: 'Successfully added device in Server'
      }); //in here don't redirect but send status code of 200 to the browser and respond with some json
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postSetTime = (req, res, next) => {

  const deviceId = req.params.deviceId; // will pull deviceId from the URL path of request
  const startTime = req.body.startTime;
  const finishTime = req.body.finishTime;

  const update = {
    startTime,
    finishTime
  };
  Device.findByIdAndUpdate(deviceId, update)
    .then(result => {
      res.status(200).json({
        message: 'Successfully setup time in Server'
      }); //in here don't redirect but send status code of 200 to the browser and respond with some json
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postStateChange = (req, res, next) => {

  const deviceId = req.params.deviceId; // will pull deviceId from the URL path of request
  const state = req.body.state;
  const typeDevice = req.body.typeDevice;

  const update = {
    state
  };

  Device.findByIdAndUpdate(deviceId, update)
    .then(result => {

      res.status(200).json({
        message: 'Successfully state changed in Server'
      }); //in here don't redirect but send status code of 200 to the browser and respond with some json
      
      if(typeDevice==="door" && state==="On"){
   transporter.sendMail({    
        to: req.session.user.email,          //the user's email which was found from DB the one who did request for password Reset 
        from: 'myhome@smart.com',
        subject: "Alarm! The DOOR is Unlocked",
        html: `
              <p>Your door is unlocked. If it was not you, please urgently change your password.</p>
        `
                                                                          //${} will able to inject variables and values inside of {}
    }); 
      }
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postStateChangeAll = (req, res, next) => {

  const userId = req.user;
  const typeDevice = req.body.typeDevice;
  const state = req.body.state;

  var query = {
    userId: userId,
    typeDevice: typeDevice
  };
  var update = {
    state: state
  };

  Device.updateMany(query, update)
    .then(result => {
      res.status(200).json({
        message: 'Successfully states changed in Server'
      }); //in here don't redirect but send status code of 200 to the browser and respond with some json

      if(typeDevice==="door" && state==="On"){
        transporter.sendMail({    
             to: req.session.user.email,          //the user's email which was found from DB the one who did request for password Reset 
             from: 'myhome@smart.com',
             subject: "Alarm! The DOORS are Unlocked",
             html: `
                   <p>Your doors are unlocked. If it was not you, please urgently change your password.</p>
             `
                                                                               //${} will able to inject variables and values inside of {}
         }); 
           }
    })
    .catch(err => {
      console.log(err);
    });
};


exports.postUpdateProfile = (req, res, next) => {

  const userId = req.user;
  const username = req.body.username;

  var query = {
    _id: userId
  };
  var update = {
    userName: username
  };

  User.updateOne(query, update)
    .then(result => {
    //  return res.redirect('/controlPanel');
      res.status(200).json({
        message: 'Successfully profile updated in the Server'
      }); //in here don't redirect but send status code of 200 to the browser and respond with some json
    })
    .catch(err => {
      console.log(err);
    });
};



exports.deleteDevice = (req, res, next) => {
  const deviceId = req.params.deviceId; // will pull deviceId from the URL path of request

  Device.findByIdAndRemove(deviceId)
    .then(() => {
      console.log('device deleted');
      //  console.log(req.body.pathUrl);
      res.status(200).json({
        message: 'Successfully deleted device from Server'
      }); //in here don't redirect but send status code of 200 to the browser and respond with some json
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        message: 'Deleting device failed from Server'
      });
    });
};