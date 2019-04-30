const Device = require('../models/device');
const User = require('../models/user');
const Temp = require('../models/temperature');
var moment = require('moment');
const bcrypt = require('bcryptjs');
const crypto = require ('crypto');
const nodemailer = require('nodemailer');
const sendGrid = require ('nodemailer-sendgrid-transport') //sendgrid is the 3rd party package,  in order to send emails to users


const transporter = nodemailer.createTransport(sendGrid({      //nodemailer will use the service of sendgrid to send emails
  auth:{
    api_key: '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'
  }
 })); 


exports.getOverview = (req, res, next) => {
  const userId = req.user;
  const serialNumber = req.serialNumber;

var start = moment().subtract(6,'hours');// only show the lattest 6 hours temp/humidity from current time
var end = moment();// shows the current time

  Device.find({userId})
    .then(devices => {
      Temp.find({serialNumber: serialNumber, date: {$gte: start, $lt: end}})// only show the lattest 6 hours temp/humidity from current time
  .then(resultTemp=>{ 
      res.render('overview', {
        dev: devices,
        path: '/overview',
        activeButton: "checked",
        thermo: resultTemp,
        moment: moment,
        username: req.username //the req.username is the username of the person which is authenticated to use the system
      });
    })
  }); 
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
  let messageError = req.flash('error'); //the error is the key whatever stored in the key error will be shown in here
  if(messageError.length > 0){
    messageError=messageError[0];
  }
  else{
    messageError=null;
  }
  res.render('controlPanel', {
    path: '/controlPanel',
    username: req.username,
    errorMessage: messageError
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


exports.postUpdateUsername = (req, res, next) => {

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

exports.postUpdatePassword = (req, res, next) => {

  const userId = req.user;
  const password = req.body.password;
  const newPassword = req.body.newPassword; 
  var email="";

    crypto.randomBytes(32, (err,buffer)=>{
      if(err){
        console.log(err);
        return redirect('/controlPanel')
      }

      const token = buffer.toString('hex'); //buffer will store hexadecimal values thats why we need to convert it to the String
      User.findOne({_id: userId})   //the id of the user which is logged in will be verified with database
      .then(user => {

        bcrypt
        .compare(password, user.password) //the encrypted password from database will be checked with the password that user entered it will return true or false
        .then(doMatch => {
          if (doMatch) {
          return bcrypt
          .hash(newPassword, 12) //encrypt the given password with the highest hash encryption level 12
          .then(hashedPassword => {
          
              user.password = hashedPassword;
            email=user.email;
            user.isEmailConfirmed = false;
            user.emailConfirmationToken = token;
            user.emailConfirmationExpiration = Date.now() + 5400000 ; //the reset tokens expiry date is from when the user is pressed + 1:30hour in milliseconds
            return user.save();
            
        })
        .then(next=>{
          req.session.destroy(err => {
            console.log(err);
            res.redirect('/login');
          });
        })
        .then(next=>{               
          transporter.sendMail({    
            to: email,          //the user's email which was found from DB the one who did request for password Reset 
            from: 'myhome@smart.com',
            subject: 'Confirm Your Password',
            html: `
                  <p>You have Changed Your Password.</p>
                  <p>Click this <a href="https://www.smart-homes.me/confirmEmail/${token}">link</a> in order to confirm you are authenticated to change the password</p>
                  <p>Note: This link will expiry in 1:30 hour.</p>
            `
                                                                              //${} will able to inject variables and values inside of {}
        }); 
        })
      }
      req.flash('error','Old Password does not match.');
      return res.redirect('/controlPanel');
    })
    })
      .catch(err=>{
        console.log(err);
      })
  })
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




  exports.postUpdateGraph = (req, res, next) => {

    const serialNumber = req.serialNumber;
    var from = req.body.from;
    var to = req.body.to;
     
    console.log(from);
    console.log(to);

    Temp.find({serialNumber: serialNumber, date: {$gte: from, $lte: to}})
.then(resultTemp=>{ 
  res.status(200).json({message: resultTemp });
  })
  };

  