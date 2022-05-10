const bcrypt = require("bcryptjs/dist/bcrypt");
const express = require("express");
const path = require('path');
const app = express();
require("./db/connect");

const Register = require("./models/register")

const port = process.env.PORT || 5000;

const static_path = path.join('_dirname', '../public');
app.use(express.static(static_path));

app.use(express.json());
app.use(express.urlencoded({extended:false}))

app.set('view engine', "ejs");

app.get("/", (req, res) => {
    res.render("index", {
        title:"Home"
    });
})


app.get("/register", (req, res) => {
    res.render("register", {
        title:"Employee Registration"
    })
})

app.post("/register", async(req, res) => {
    try{
        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if(password === cpassword){
            const registerEmployee = new Register({
                fullName: req.body.fullName,
                age: req.body.age,
                email: req.body.email,
                password:password,
                cpassword: cpassword,
                department: req.body.department
            });
            
            const registered = await registerEmployee.save();
            res.status(200).send({
                registeredUser:registered,
            })
          
        }else{
            res.send("password is not matching")
        }
    }catch(error){
        res.status(400).send(error);
    }
})

app.get("/login", (req, res) => {
    res.render("login", {
        title:"Employee Login"
    })
})

app.post('/login', async (req, res) => {
    try{

        const email = req.body.email;
        const password = req.body.password;

        const useremail =  await Register.findOne({email});

        const isMatch = await bcrypt.compare(password, useremail.password)

        if(isMatch){
            res.status(200).send({
                loggedInUser:useremail
            })
            
        }else{
            res.send(`Your password is incorrect`)
        }
    }catch(error){
        res.status(400).send(`Invalid Login Details`)
    }
})

app.get("/employelist", async (req, res) => {
    const users = await Register.find();
    res.status(200).send({
        employees:users
    })
})

app.get("/update-employee", async(req, res) => {
    const user = await Register.findById(req.query.id)
    console.log(user);
    res.render("updatedata", {
        title:"Employee Update",
        employee:user
    })
})

app.get("/delete-employee", async(req, res) => {
    const deletedUser = await Register.findByIdAndDelete(req.query.id);
    console.log(deletedUser);
    res.status(200).send({
        deletedEmployee:deletedUser
    })
    
})

app.post("/update-employee",async (req, res) => {
    let updatedUser = await Register.findByIdAndUpdate(req.body.id, req.body)
    res.status(200).send({
        updatedEmployee:updatedUser
    })
   
})



app.listen(port, () => {
    console.log(`Server is running at port no ${port}`);
})