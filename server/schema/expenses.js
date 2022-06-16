const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    createdOn: {
        type: String,
        required: true,
    },
    purchasedOn: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    itemName: {
        type: String,
        required: true,
    },
    itemType: {
        type: String,
        required: true,
    },
    itemCost: {
        type: String,
        required: true,
    },
    itemStatus: {
        type: String,
        required: true,
    }
});

const Expenses = mongoose.model("expenses", expenseSchema);

module.exports = Expenses;