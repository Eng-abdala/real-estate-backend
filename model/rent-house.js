const mongoose = require('mongoose');

const rentHouseSchema =  mongoose.Schema({
    image:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    bed:{
        type:Number,
        required:true
    },
    bath:{
        type:Number,
        required:true
    },
    sqft:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    Gurinumber:{

        type:Number,
        required : true
    },
   
    available: { type: Boolean, 
                 default: true
     } // Default: true (Available)


})

module.exports = mongoose.model('RentHouse', rentHouseSchema);