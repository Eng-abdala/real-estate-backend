const mongoose = require('mongoose');

const Admin =mongoose.Schema({

    username:{
        type:String,
        required :true
    },
    Password:{
        type: String,
        required: true
    }
})

module.exports=mongoose.model("Admin", Admin)
