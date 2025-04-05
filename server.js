const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

require("dotenv").config(); // Load environment variables
const nodemailer = require("nodemailer"); // Import Nodemailer for sending emails

const app = express();

app.use(express.json());
app.use(cors());

// importing schems
const RentHouse = require('./model/rent-house');

// Connect to MongoDB
mongoose.connect('mongodb+srv://ciilanesalaad482561:njnh tbwn jlva jkwn@real-estate.8symdj0.mongodb.net/?retryWrites=true&w=majority&appName=real-estate/rent-houses').then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log(error);
});


// image distination
const imagelocation = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: imagelocation });

// Creating post API
app.post('/posthouse', upload.single('img'), async (req, res) => { 
    const postHouse = RentHouse({
        image: req.file.filename,
        title: req.body.title,
        price: req.body.price,
        bed: req.body.bed,
        bath: req.body.bath,
        sqft: req.body.sqft,
        Gurinumber: req.body.Gurinumber,
        location: req.body.location,
    })
    const savePost = await postHouse.save();
    if (savePost){

        res.send("House posted successfully");
    }
 });


//  get API
app.get('/gethouse', async (req, res) => {
    const getHouse = await RentHouse.find();
    if (getHouse) {
        res.send(getHouse);
    }
});

// Api Delete

app.delete("/remove/:id", async (req,res)=>{
    const remove = await RentHouse.deleteOne({
        _id: req.params.id
    })
    if(remove){
        res.send("the data has ben removed")
    }

})



// API oo soo bandhigaayo one date from database

app.get("/getSingle/:id", async  (req,res)=>{
    const getsingle = await rentHouse.find({_id: req.params.id})
    if(getsingle){
        res.send(getsingle)
    }
})
// ApI oo Updata 

app.put("/Update/:id", async (req,res)=>{
    const upada = await rentHouse.updateOne(
        { _id: req.params.id },
        {$set : req.body}
    )
    if(upada){
        res.send("The data has been updated")
    }
})


// image route 
app.use('/images',express.static("images"))



app.put("/rent/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { available } = req.body; // Get new availability status

        // Ensure the request has the 'available' field
        if (available === undefined) {
            res.send("Missing availability status")
        }

        const updatedHouse = await RentHouse.findByIdAndUpdate(id, { available }, { new: true });

        res.send(updatedHouse)
    } catch (error) {
        res.send(error)
    }
});


 
// User Register And Login Section
const RegisterLogin = require('./model/RegisterLogin')

// post Register 

app.post("/Register",  async (req,res)=>{

    const register= RegisterLogin(req.body)
    const saveDta = await register.save()
    if(saveDta){
        res.send("The use has alredy registered")
    }

})

// post login

app.post("/login", async (req,res)=>{
    const Login = await RegisterLogin.findOne(req.body).select("-Password")
    if(Login){
        res.send({
            success:"Login Successfully",
            data: Login
        })
    }
    else{
        res.send({ error:"username and passowrd are incorecct"})    }
})

// delete register 
app.delete("/removeRegister/:id", async (req,res)=>{
    const removee= await RegisterLogin.deleteOne({
        _id: req.params.id
    })
    if(removee){
        res.send("The register has been deleted")
    }
})




// Admin Api

const Admin= require("./model/Admin")


app.post("/AdminLogin", async (req,res)=>{
    const Login = await Admin.findOne(req.body).select("-Password")
    if(Login){
        res.send({
            success:"Login Successfully",
            data: Login
        })
    }
    else{
        res.send({ error:"username and passowrd are incorecct"})    }
})

// Admin Register
app.post("/AdminRegister",  async (req,res)=>{

    const register= Admin(req.body)
    const saveDta = await register.save()
    if(saveDta){
        res.send("The use has alredy registered")
    }

})



// Email Sending API


// POST route to handle form submission
app.post("/send-email", async (req, res) => {
    const { name, email, phone, description } = req.body; // Get form data from request
  
    // Configure Gmail SMTP using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_RECEIVER, // Your Gmail (from .env)
        pass: process.env.EMAIL_PASS, // App password (from .env)
      },
    });
  
    // Email details
    const mailOptions = {
      from:email, // Sender email
      to: process.env.EMAIL_RECEIVER, // Receiver email
      subject: "New Contact Form Submission", // Email subject
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${description}`, // Email content
    };
  
    try {
      await transporter.sendMail(mailOptions); // Send email
      res.status(200).json({ message: "Email sent successfully!" }); // Success response
    } catch (error) {
      res.status(500).json({ error: "Failed to send email." }); // Error response
    }
  });





  // Import schema 
  const rentHouse = require('./model/rent-house');
  

  const Complaint = require("./model/Complaints");

//  API  POST
app.post("/post/complainments", async (req, res) => {
    try {
        const { name, email, message } = req.body
        const newComplaint = new Complaint({ name, email, message })
        await newComplaint.save();
        res.status(201).json({ message: "Complaint submitted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

//  API  GET
app.get("/get/complainments", async (req, res) => {
    try {
        const complaints = await Complaint.find()
        res.status(200).json(complaints)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

// Api delete
app.delete("/complainments/:id", async (req,res)=>{
    const removee= await Complaint.deleteOne({
        _id: req.params.id
    })
    if(removee){
        res.send("The register has been deleted")
    }
})













app.listen(5000, () => {
  console.log('Server is running on port 5000');
});