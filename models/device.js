const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

//in the below the data shcema for product will be implemented such as title will have a type of String and it must be given


const deviceSchema = new Schema ({
  serialNumber:{
    type: String,
    required: true
  },
  name:{
    type: String,
    required: true
  } ,
  typeDevice:{
    type: String,
    required: true
  },
  startTime:{
    type:Date,
    required:false
  },
  finishTime:{
    type:Date,
    required:false
  },
  state:{
    type: String,
    required: true
  },
  userId:{
    type: Schema.Types.ObjectId,
    //the userId type will be refered to the User model
    ref: 'User',
    required: true
  }
});

//Mongoose model is important because you can connect to schemas with it's name such as Device
module.exports = mongoose.model('Device',deviceSchema);