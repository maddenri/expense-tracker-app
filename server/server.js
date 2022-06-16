const { EMPLOYEE_API_ENDPOINT, EXPENSE_API_ENDPOINT, PROD_DB } = require('./config');
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');
const expenses_api = require('./routes/expenses');
const employees_api = require('./routes/employees');

const app = express();
const db = mongoose.connection;
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(EMPLOYEE_API_ENDPOINT, employees_api);
app.use(EXPENSE_API_ENDPOINT, expenses_api);

mongoose.connect(PROD_DB);

db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
