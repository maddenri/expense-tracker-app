const { EXPENSE_API_ENDPOINT, TEST_DB_EXPENSES} = require('../../config');
const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const api = require('../expenses');
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(EXPENSE_API_ENDPOINT, api);

beforeAll((done) => {
    mongoose.connect(TEST_DB_EXPENSES,
        () => done());
});

afterAll((done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done())
    });
});

describe('Test to retrieve Expenses from the Expense Tracker App', () => {
    it('Should successfully retrieve expenses', async () => {
        await request(app)
            .get(EXPENSE_API_ENDPOINT)
            .expect(200)
    });
});

describe('Test to add an Expense to the Expense Tracker App', () => {
    it('Should successfully create a new expense', async () => {
        const res = await request(app)
            .post(EXPENSE_API_ENDPOINT)
            .send({
                purchasedOn: "2021-07-16",
                name: "Richard Madden",
                username: "maddenr",
                itemName: "Salmon",
                itemType: "Food",
                itemCost: "€4.40",
            })
        expect(res.statusCode).toEqual(200)
    });

    it('Should fail to add expense as invalid fields were provided', async () => {
        const res = await request(app)
            .post(EXPENSE_API_ENDPOINT)
            .send({
                purchasedOn: "2021-07-16",
                na: "John Doe",
                username: "doej",
                itemNae: "Crisps",
                itType: "Food",
                itemCost: "€1.28",
            })
        expect(res.statusCode).toEqual(400)
        expect(res.text).toEqual('Invalid. Please check expense fields are valid')
    });

    it('Should fail to add expense as Purchase Date is in incorrect format', async () => {
        const purchased = "202432-11-16"
        const res = await request(app)
            .post(EXPENSE_API_ENDPOINT)
            .send({
                purchasedOn: purchased,
                name: "John Sheldon",
                username: "sheldonj",
                itemName: "Milk",
                itemType: "Food",
                itemCost: "€2.00",
            })
        expect(res.statusCode).toEqual(400)
        expect(res.text).toEqual(`Invalid Purchase Date: ${purchased} - Should be in format YYYY-MM-DD`)
    });

    it('Should fail to add expense as Purchased Date falls after Creation Date', async () => {
        const purchased = "2050-11-16"
        const created = new Date().toISOString().split('T')[0];
        const res = await request(app)
            .post(EXPENSE_API_ENDPOINT)
            .send({
                purchasedOn: purchased,
                name: "Mike Spencer",
                username: "spencerm",
                itemName: "Dog food",
                itemType: "Food",
                itemCost: "€3.10",
            })
        expect(res.statusCode).toEqual(400)
        expect(res.text).toEqual(`Purchase Date: ${purchased} cannot fall after Creation Date: ${created}`)
    });

    it('Should fail to add expense as Item Cost is negative', async () => {
        const res = await request(app)
            .post(EXPENSE_API_ENDPOINT)
            .send({
                purchasedOn: "2021-05-10",
                name: "Brendan Lynch",
                username: "lynchb",
                itemName: "Guinness",
                itemType: "Alcohol",
                itemCost: "-€10.00",
            })
        expect(res.statusCode).toEqual(400)
        expect(res.text).toEqual('Cannot enter a negative Item Cost')
    });

    it('Should fail to add expense as expense already exists with the same Purchase Date, Employee and Item Name details', async () => {
        const res = await request(app)
            .post(EXPENSE_API_ENDPOINT)
            .send({
                purchasedOn: "2021-07-16",
                name: "Richard Madden",
                username: "maddenr",
                itemName: "Salmon",
                itemType: "Food",
                itemCost: "€2.40",
            })
        expect(res.statusCode).toEqual(400)
        expect(res.text).toEqual(`An expense already exists for Employee: maddenr, with Purchase Date: 2021-07-16, and Item Name: Salmon`);
    });
});

describe('Test to update an Expense from the Expense Tracker App', () => {
    it('Should successfully update Item Status of an item', async () => {
        const status = 'Closed'
        const id = await request(app)
            .get(EXPENSE_API_ENDPOINT)
            .then((res) => {return res.body[0]._id})
        const res = await request(app)
            .put(`${EXPENSE_API_ENDPOINT}/${id}/${status}`)
        expect(res.statusCode).toEqual(200)
        expect(res.text).toEqual('Expense successfully updated')
    });
});

describe('Test to delete an Expense from the Expense Tracker App', () => {
    it('Should successfully delete item', async () => {
        const id = await request(app)
            .get(EXPENSE_API_ENDPOINT)
            .then((res) => {return res.body[0]._id})
        const res = await request(app)
            .delete(`${EXPENSE_API_ENDPOINT}/${id}`)
        expect(res.statusCode).toEqual(200)
        expect(res.text).toEqual('Expense successfully removed')
    });
});

