let Expenses = require('../schema/expenses');
const router = require('express').Router();

const getExpenses = (req, res) => {
    Expenses.find()
        .then(expenses => res.json(expenses))
        .catch(err => res.status(500).json('Error: ' + err));
};

const checkAlreadyExistsBeforeAdding = (req, res, next)  => {
    const username = req.body.username;
    const purchasedOn = req.body.purchasedOn;
    const itemName = req.body.itemName;

    Expenses.find({username: username, purchasedOn: purchasedOn, itemName: itemName}, function (err, expense){
        if (expense.length !== 0) {
            res.status(400)
            return res.send(`An expense already exists for Employee: ${username}, with Purchase Date: ${purchasedOn}, and Item Name: ${itemName}`);
        }else {
            return next();
        }
    })
};

const addExpense = (req, res)  => {
    const created = new Date().toISOString().split('T')[0];
    const status = "Open";
    const purchased = req.body.purchasedOn;
    const name = req.body.name;
    const username = req.body.username;
    const item = req.body.itemName;
    const type = req.body.itemType;
    const cost = req.body.itemCost;
    const regex_date = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/

    if (!(regex_date.test(purchased))) {
        res.status(400)
        return res.send(`Invalid Purchase Date: ${purchased} - Should be in format YYYY-MM-DD`)
    } else if (new Date(created) < new Date(purchased)) {
        res.status(400)
        return res.send(`Purchase Date: ${purchased} cannot fall after Creation Date: ${created}`)
    } else if (parseFloat(cost.replace('€', '')) < 0) {
        res.status(400)
        return res.send('Cannot enter a negative Item Cost')
    } else {
        const newExpense = new Expenses({
            createdOn: created, purchasedOn: purchased,
            name: name, username: username, itemName: item, itemType: type, itemCost: cost, itemStatus: status
        });
        newExpense.save()
            .then(expenses => res.json(expenses))
            .catch(() => res.status(400).send('Invalid. Please check expense fields are valid'));
    }
};

const updateExpense = (req, res)  => {
    const id = req.params._id;
    const status = req.params.status;

    Expenses.findByIdAndUpdate(id, {itemStatus: status}).then(function () {
        res.send('Expense successfully updated');
    }).catch(err => res.status(500).json('Error: ' + err));

};

const deleteExpense = (req, res)  => {
    const id = req.params._id;

    Expenses.findByIdAndDelete(id).then(function () {
        res.send('Expense successfully removed');
    }).catch(err => res.status(500).json('Error: ' + err));

};

router.route('/').get(getExpenses);
router.route('/').post(checkAlreadyExistsBeforeAdding);
router.route('/').post(addExpense);
router.route('/:_id/:status').put(updateExpense);
router.route('/:_id').delete(deleteExpense);

module.exports = router;
