const bcrypt = require('bcryptjs');
const crypto = require ('crypto');
const User = require('../models/user');
const nodemailer = require('nodemailer');
const sendGrid = require ('nodemailer-sendgrid-transport') //sendgrid is the 3rd party package,  in order to send emails to users
const request = require('request');

const transporter = nodemailer.createTransport(sendGrid({      //nodemailer will use the service of sendgrid to send emails
 auth:{
   api_key: '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'
 }
})); 

exports.getLogin = (req, res, next) => {
  let messageError = req.flash('error'); //the error is the key whatever stored in the key error will be shown in here
  if(messageError.length > 0){
    messageError=messageError[0];
  }
  else{
    messageError=null;
  }
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessage: messageError
  });
};

exports.getSignup = (req, res, next) => {
  let messageError = req.flash('error'); //the error is the key whatever stored in the key error will be shown in here
  if(messageError.length > 0){
    messageError=messageError[0];
  }
  else{
    messageError=null;
  }
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    errorMessage: messageError
  });
}; 


exports.getEmailConfirmation = (req,res,next) =>{

  const token = req.params.token; //req.params.token means you extracting the token from the URL
  User.findOne({
    emailConfirmationToken: token, emailConfirmationExpiration: {$gt: Date.now()}
  })
  .then(user =>{
    let messageError = req.flash('error'); //the error is the key whatever stored in the key error will be shown in here
  if(messageError.length > 0){
    messageError=messageError[0];
  }
  else{
    messageError=null;
  }

  res.render('auth/confirmEmail', {
    path: '/confirmEmail',
    pageTitle: 'Confirm Email',
    errorMessage: messageError,
    userId: user._id.toString(),   //userId required in order to include to the POST request where the password will be updated
    emailConfirmationToken: token
  })
  })
  .catch(err=>{
    console.log(err);
  })
};


exports.getResetPassword = (req,res,next) => {
  let messageError = req.flash('error'); //the error is the key whatever stored in the key error will be shown in here
  if(messageError.length > 0){
    messageError=messageError[0];
  }
  else{
    messageError=null;
  }
  res.render('auth/passwordReset', {
    path: '/passwordReset',
    pageTitle: 'Reset Password',
    errorMessage: messageError
  });
};


exports.getNewPassword = (req,res,next) =>{

  const token = req.params.token; //req.params.token means you extracting the token from the URL
  User.findOne({
    resetPasswordToken: token, resetPasswordExpiration: {$gt: Date.now()}
  })
  .then(user =>{
    let messageError = req.flash('error'); //the error is the key whatever stored in the key error will be shown in here
  if(messageError.length > 0){
    messageError=messageError[0];
  }
  else{
    messageError=null;
  }

  res.render('auth/newPassword', {    //whatever responded property will be available in the front end to use, such as, pageTitle and userId will be rendered in the front end
    path: '/newPassword',
    pageTitle: 'New Password',
    errorMessage: messageError,
    userId: user._id.toString(),                      //userId required in order to include to the POST request where the password will be updated
    passwordToken: token
  });
  })
  .catch(err=>{
    console.log(err);
  })
};

 
exports.postLogin = (req, res, next) => { 
  const email = req.body.email;
  const password = req.body.password;
 
  const captcha = req.body['g-recaptcha-response']; //recaptcha values from the front end will be retrieved

  // Secret Key
  const secretKey = '6LeT85gUAAAAALx3ngBnZxbzXOC5_ffg2bsCDj0V';

  // Verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;
  // Make Request To VerifyURL
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    
    // If Not Successful
    if(body.success !== undefined && !body.success){
      req.flash('error','Failed captcha verification');
    //  return  res.status(200).json({"success": false, "msg":"Failed captcha verification","link": "/login"});
      return res.redirect('/login');
  }
 
    User.findOne({ email: email })
    .then(user => {
      if (!user) {
        req.flash('error','Invalid email or password.');
        //if the email does not exist in database then redirect to the login page
        return res.redirect('/login');
     //   return  res.status(200).json({"link": "/login","success": true, "msg":"Passed captcha verification"});
      }
      bcrypt
        .compare(password, user.password) //the encrypted password from database will be checked with the password that user entered it will return true or false
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
           return  res.redirect('/overview');
          // return  res.status(200).json({"link": "/overview","success": true, "msg":"Passed captcha verification"});
            });
          }
          
          req.flash('error','Invalid email or password.');
          return res.redirect('/login');
        //  return  res.status(200).json({"link": "/login","success": false, "msg":"Passed captcha verification"});
        })
    })
  });
  };


exports.postSignup = (req, res, next) => { 
  
  const userName = req.body.userName;
  const serialPi = req.body.serialPi;
  const email = req.body.email;
  const password = req.body.password;
  const captcha = req.body['g-recaptcha-response']; //recaptcha values from the front end will be retrieved

  // Secret Key
  const secretKey = '6LeT85gUAAAAALx3ngBnZxbzXOC5_ffg2bsCDj0V';

  // Verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make Request To VerifyURL
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    
    // If Not Successful
    if(body.success !== undefined && !body.success){
      req.flash('error','Failed captcha verification');
    //  return  res.status(200).json({"success": false, "msg":"Failed captcha verification","link": "/login"});
      return res.redirect('/signup');
  }

  crypto.randomBytes(32, (err,buffer)=>{
    if(err){
      console.log(err);
      return redirect('/signup')
    }
    const token = buffer.toString('hex'); //buffer will store hexadecimal values thats why we need to convert it to the String
    User.findOne({email: req.body.email})   //the email of the user will be pulled from the request body
    .then(user => {
      if (user) { //if the email is already exist then dont sign up but redirect to the login page
        req.flash('error','Email is exist. Please choose other one.');
        return res.redirect('/signup');
      }
      return bcrypt
      .hash(password, 12) //encrypt the given password with the highest hash encryption level 12
      .then(hashedPassword => {
        const user = new User({
          userName: userName,
          serialNumber: serialPi,
          email: email,
          password: hashedPassword,
        });
        user.isEmailConfirmed = false;
        user.emailConfirmationToken = token;
        user.emailConfirmationExpiration = Date.now() + 5400000 ; //the reset tokens expiry date is from when the user is pressed + 1:30hour in milliseconds
        return user.save();
    })
  })
    .then(result=>{
       //if it is on here which means the data saved in database
       res.redirect('/login');
       transporter.sendMail({    
        to: email,          //the user's email which was found from DB the one who did request for password Reset 
        from: 'myhome@smart.com',
        subject: 'Confirm Your Email',
        html: `
              <p>You have registered.</p>
              <p>Click this <a href="https://www.smart-homes.me/confirmEmail/${token}">link</a> in order to confirm your email</p>
              <p>Note: This link will expiry in 1:30 hour.</p>
        `
      //${} will able to inject variables and values inside of {}
    }); 

    })
    .catch(err=>{
      console.log(err);
    })
})
});
};
 

exports.postEmailConfirmation = (req,res,next) =>{
 
  const userId = req.body.userId;
  const emailConfirmationToken = req.body.emailConfirmationToken;
 
  User.findOne({emailConfirmationToken: emailConfirmationToken, emailConfirmationExpiration: {$gt: Date.now()},_id: userId})
  .then( user =>{
   user.emailConfirmationToken=undefined;
   user.emailConfirmationExpiration=undefined;
   user.isEmailConfirmed=true;

   transporter.sendMail({    
    to: user.email,          
    from: 'myhome@smart.com',
    subject: 'Email Address Confirmed',
    html: `
          <p>You have confirmed your email address.</p>
          <p>Click this <a href="https://www.smart-homes.me/login">link</a> in order to use the admin dashboard. Thank
          you for using our services.</p>
    ` 
}); 
   return user.save();
  }
  )
  .then(result => {
    res.redirect('/login'); //after confirming email redirect it to the login page
    
  })
  .catch(err=>{
    console.log(err);
  })
  };


exports.postResetPassword = (req,res,next) => {
  const captcha = req.body['g-recaptcha-response']; //recaptcha values from the front end will be retrieved

  // Secret Key
  const secretKey = '6LeT85gUAAAAALx3ngBnZxbzXOC5_ffg2bsCDj0V';

  // Verify URL
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${captcha}&remoteip=${req.connection.remoteAddress}`;

  // Make Request To VerifyURL
  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);
    
    // If Not Successful
    if(body.success !== undefined && !body.success){
      req.flash('error','Failed captcha verification');
    //  return  res.status(200).json({"success": false, "msg":"Failed captcha verification","link": "/login"});
      return res.redirect('/passwordReset');
  }

  crypto.randomBytes(32, (err,buffer)=>{
    if(err){
      console.log(err);
      return res.redirect('/passwordReset')
    }
    const token = buffer.toString('hex'); //buffer will store hexadecimal values thats why we need to convert it to the String
    User.findOne({email: req.body.email})   //the email of the user will be pulled from the request body
    .then(user => {
      if(!user) //user doesn't exist
      {
        req.flash('error','The email does not exist. Enter valid email.')
        return res.redirect('/passwordReset') //if the user's email address wont match database redirect to the passwordReset URL
        
      }

      user.resetPasswordToken = token;
      user.resetPasswordExpiration = Date.now() + 5400000 ; //the reset tokens expiry date is from when the user is pressed + 1:30hour in milliseconds
      return user.save();
    })
    .then(result=>{
       //if it is on here which means the data saved in database
       res.redirect('/login');
       transporter.sendMail({    
        to: req.body.email,          //the user's email which was found from DB the one who did request for password Reset 
        from: 'myhome@smart.com',
        subject: 'Request of Password Reset',
        html: `
              <p>You have requested a password reset</p>
              <p>Click this <a href="https://www.smart-homes.me/newPassword/${token}">link</a> in order to reset a new password</p>
              <p>Note: This link will expiry in 1:30 hour.</p>
        `
                                                                          //${} will able to inject variables and values inside of {}
    }); 
    })
    .catch(err=>{
      console.log(err);
    })
})
});
};


exports.postNewPassword = (req,res,next) =>{
const newPassword = req.body.password //the link which is calling postNewPassword will have inside of HTML  <input name="password">
const userId = req.body.userId;
const passwordToken = req.body.passwordToken;
let resetRequestedUser;

User.findOne({resetPasswordToken: passwordToken, resetPasswordExpiration: {$gt: Date.now()},_id: userId})
.then( user =>{
  resetRequestedUser = user;
  return bcrypt.hash(newPassword,12);  //it will generate encrypted password for the newpassword
}
)
.then(hashedNewPassword => {
  resetRequestedUser.password=hashedNewPassword;
  resetRequestedUser.resetPasswordToken=undefined;   //this doesn't require to save any infor after the user's password have been updated with the new password
  resetRequestedUser.resetPasswordExpiration=undefined;
  return resetRequestedUser.save();
})
.then(result=>{               //when the password have been updated in database then redirect it to the login page
  res.redirect('/login');
})
.catch(err=>{
  console.log(err);
})
};


exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.status(200).json({message: 'Successfully logged out', linkRedirect: '/login'}); //in here don't redirect but send status code of 200 to the browser and respond with some json and browser will redirect to login page
  });
};