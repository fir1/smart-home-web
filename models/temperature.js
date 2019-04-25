const mongoose = require ('mongoose');

const Schema = mongoose.Schema;

const tempSchema = new Schema (
  {
     serialNumber:{
       type: String,
       required: true
     },
     date:{
         type: Date,
         required: true
     },
     temperature:{
         type: Number,
         required: true
     },
     humidity: {
         type: Number,
         required: true
     } 

  }
);

module.exports = mongoose.model('Temp', tempSchema);