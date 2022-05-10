const bcrypt = require('bcryptjs/dist/bcrypt');
const mongoose = require('mongoose');

const employee = new mongoose.Schema({
    fullName: {
        type:String,
        required:true
    },
    age: {
        type:Number,
        required:true
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password: {
        type:String,
        required:true
    },
    department: {
        type:String,
        required:true
    }
});


employee.pre("save", async function(next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
        this.cpassword = undefined;
    }
    
    next();
})  

const Register = new mongoose.model("Register", employee);

module.exports = Register;

