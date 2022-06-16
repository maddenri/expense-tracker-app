const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema({
    employeeName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePic: {
        type: String,
        required: true,
    },
});

const Employees = mongoose.model("employees", employeeSchema);

module.exports = Employees;

