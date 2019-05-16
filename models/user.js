const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema (
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
     serialNumber:{
       type: String,
       required: true
     },
     userName:{
       type: String,
       required: true
     },
     emailConfirmationToken: String,
     emailConfirmationExpiration: Date,
     isEmailConfirmed: Boolean,
     resetPasswordToken: String,
     resetPasswordExpiration : Date

  }
);

module.exports = mongoose.model('User', userSchema);