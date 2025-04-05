const mongoose = require('mongoose');

const Register =mongoose.Schema({

    username:{
        type:String,
        required :true
    },
    Email:{
        type: String, 
    },
    Password:{
        type: String,
        required: true
    }
})

module.exports=mongoose.model("User", Register)
