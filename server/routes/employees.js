const Employees = require('../schema/employees');
const Expenses = require("../schema/expenses");
const router = require('express').Router();
const multer = require('multer');
const { v4: uuidv4} = require('uuid');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4() + path.extname(file.originalname));
    },
    onError : function(err, next) {
        next(err);
    }
});

const fileFilter = (req, file, cb) => {
    const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    allowedFileTypes.includes(file.mimetype) ? cb(null, true) :  cb(new Error('Invalid file format for Profile Picture'), false);
}

const validateEmployee = (req, res) => {
    const username = req.params.username;
    const password = req.params.password;
    Employees.find({username: username.toLowerCase()}, function (err, employee) {
        if (employee.length === 0){
            res.status(400);
            return res.send(`Invalid username: ${username}`);
        } else if (employee[0].password !== password) {
            res.status(400);
            return res.send('Invalid password. Please try again');
        } else {
            res.json(employee);
        }
    })
};

const searchEmployee = (req, res) => {
    const username = req.params.username;
    Employees.find({username: username}, function (err, employee) {
        if (employee.length === 0){
            res.status(400);
            return res.send(`Employee with username: "${username}" does not exist`);
        } else {
            res.json(employee);
        }
    })
};

const downloadProfilePic = (req, res) =>  {
    const profilePic = req.params.profilePic;
    res.sendFile(profilePic, {root: path.join(__dirname,'..','images')})
}

const addEmployeePostFileFormatValidation = (req, res) => {
    const employeeName = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const retypePassword = req.body.retypePassword;
    const profilePic = req.file.filename;
    const regex_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*]{8,}$/

    Employees.find({username: username}, function (err, employee) {
        if (employee.length !== 0) {
            res.status(400);
            fs.unlinkSync('images/' + profilePic);
            return res.send(`Employee already exists with username: ${username}`);
        } else if (password !== retypePassword) {
            res.status(400);
            fs.unlinkSync('images/' + profilePic);
            return res.send('Passwords do not match');
        } else if(!(regex_password.test(password))) {
            res.status(400);
            fs.unlinkSync('images/' + profilePic);
            return res.send('Password must be a minimum of eight characters and contain at least one letter, one number and one special character (i.e. @,$,!,%,*)');
        } else if(email.substr(-12) !== "@company.com") {
            res.status(400);
            fs.unlinkSync('images/' + profilePic);
            return res.send('Domain name of email must be set to "@company.com"');
        }
        else{
            const newEmployee = new Employees({
                employeeName: employeeName, username: username,
                email: email, password: password, profilePic: profilePic
            });
            newEmployee.save()
                .then( res.send('Employee successfully added'))
                .catch(() => res.status(400).send('Invalid. Please check employee fields are valid'));
        }
    });
};

const addEmployee = (req, res) => {
    multer({storage, fileFilter}).single('profilePic')(req, res, function (err) {
        err ? res.status(400).send('Invalid file format. Profile Picture must have a ".png", ".jpg" or ".jpeg" filename extension')
            : addEmployeePostFileFormatValidation(req, res);
    })
}

const updateEmployee = (req, res)  => {
    const id = req.params._id;
    const password = req.params.password;

    Employees.findByIdAndUpdate(id, {password: password}).then(function () {
        res.send('Password successfully updated');
    }).catch(err => res.status(500).json('Error: ' + err));

};

const deleteEmployee = async (req, res)  => {
    const username = req.params.username;
    const profilePic = req.params.profilePic;

    await Expenses.deleteMany({username: username}).then(function () {
        console.log(`Deleted all expenses for employee: ${username}`)
    }).catch(err => res.status(500).json('Error: ' + err));

    await Employees.findOneAndDelete({username: username}).then(function () {
        fs.unlinkSync('images/' + profilePic);
        res.send(`Successfully deleted employee: ${username}`)
    }).catch(err => res.status(500).json('Error: ' + err));
}

router.route('/:username/:password').get(validateEmployee);
router.route('/:username').get(searchEmployee);
router.route('/server/images/:profilePic').get(downloadProfilePic);
router.route('/').post(addEmployee);
router.route('/:_id/:password').put(updateEmployee);
router.route('/:username/:profilePic').delete(deleteEmployee);

module.exports = router;
