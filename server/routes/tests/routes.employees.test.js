const { EMPLOYEE_API_ENDPOINT, TEST_DB_EMPLOYEES} = require('../../config');
const express = require('express');
const request = require('supertest');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const Employees = require('../../schema/employees');
const api = require('../employees');
const app = express();

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(EMPLOYEE_API_ENDPOINT, api);

beforeAll((done) => {
    mongoose.connect(TEST_DB_EMPLOYEES,
        () => done());
});

afterAll( (done) => {
    mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => done())
    });

});

afterEach(async () => {
    await new Promise(resolve => setTimeout(() => resolve(), 500))
});

describe('Test to add an Employee to the Expense Tracker App', () => {
    it('Should successfully create a new employee', (done) => {
        request(app)
            .post(EMPLOYEE_API_ENDPOINT)
            .set("Content-Type", "multipart/form-data")
            .field("name", "Donald Duck")
            .field("username", "duckd")
            .field("email", "duckd@company.com")
            .field("password", "TheBigDuck9!")
            .field("retypePassword", "TheBigDuck9!")
            .attach("profilePic", 'routes/tests/images/download.jpeg')
            .end((err, res) => {
                expect(res.statusCode).toEqual(200)
                expect(res.text).toEqual('Employee successfully added')
                done();
            })
    });

    it('Should fail to add employee as employee already exists', (done) => {
        const username="duckd";
        request(app)
            .post(EMPLOYEE_API_ENDPOINT)
            .set("Content-Type", "multipart/form-data")
            .field("name", "Donald Duck")
            .field("username", username)
            .field("email", "duckd@company.com")
            .field("password", "TheBigDuck9!")
            .field("retypePassword", "TheBigDuck9!")
            .attach("profilePic", 'routes/tests/images/download.jpeg')
            .end((err, res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.text).toEqual(`Employee already exists with username: ${username}`)
                done();
            })
    });

    it('Should fail to add employee as passwords do not match', (done) => {
        request(app)
            .post(EMPLOYEE_API_ENDPOINT)
            .set("Content-Type", "multipart/form-data")
            .field("name", "Mickey Mouse")
            .field("username", "mousem")
            .field("email", "mousem@company.com")
            .field("password", "MouseHouse?2")
            .field("retypePassword", "MouseHouse32")
            .attach("profilePic", 'routes/tests/images/download.jpeg')
            .end((err, res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.text).toEqual('Passwords do not match')
                done();
            })
    });

    it('Should fail to add employee as password does not meet criteria', (done) => {
        request(app)
            .post(EMPLOYEE_API_ENDPOINT)
            .set("Content-Type", "multipart/form-data")
            .field("name", "Minnie Mouse")
            .field("username", "mousem2")
            .field("email", "mousem2@company.com")
            .field("password", "Minnie12")
            .field("retypePassword", "Minnie12")
            .attach("profilePic", 'routes/tests/images/download.jpeg')
            .end((err, res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.text).toEqual('Password must be a minimum of eight characters and contain at least one letter, one number and one special character (i.e. @,$,!,%,*)')
                done();
            })
    });

    it('Should fail to add employee as email has incorrect domain name', (done) => {
        request(app)
            .post(EMPLOYEE_API_ENDPOINT)
            .set("Content-Type", "multipart/form-data")
            .field("name", "Goofy")
            .field("username", "goof")
            .field("email", "goof@house.com")
            .field("password", "GoofProof*1")
            .field("retypePassword", "GoofProof*1")
            .attach("profilePic", 'routes/tests/images/download.jpeg')
            .end((err, res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.text).toEqual('Domain name of email must be set to "@company.com"')
                done();
            })
    });

    it('Should fail to add employee as profile picture has the incorrect format', (done) => {
        request(app)
            .post(EMPLOYEE_API_ENDPOINT)
            .set("Content-Type", "multipart/form-data")
            .field("name", "Goofy")
            .field("username", "goof")
            .field("email", "goof@company.com")
            .field("password", "GoofProof*1")
            .field("retypePassword", "GoofProof*1")
            .attach("profilePic", 'routes/tests/images/Test_PDF.pdf')
            .end((err, res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.text).toEqual('Invalid file format. Profile Picture must have a ".png", ".jpg" or ".jpeg" filename extension')
                done();
            })
    });
});

describe('Test to validate Login to the Expense Tracker App', () => {
    it('Should successfully validate an employee\'s username and password', (done) => {
        request(app)
            .get(`${EMPLOYEE_API_ENDPOINT}/duckd/TheBigDuck9!`)
            .end((err, res) => {
                expect(res.statusCode).toEqual(200)
                done();
            })
    });

    it('Should fail to validate employee as employee doesn\'t exist', (done) => {
        request(app)
            .get(`${EMPLOYEE_API_ENDPOINT}/simba/TheLionKing1!`)
            .end((err, res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.text).toEqual('Invalid username: simba')
                done();
            })
    });

    it('Should fail to validate employee as password is incorrect', (done) => {
        request(app)
            .get(`${EMPLOYEE_API_ENDPOINT}/duckd/DonkeyKong2*`)
            .end((err, res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.text).toEqual('Invalid password. Please try again')
                done();
            })
    });
});

describe('Test to search for an Employee in the Expense Tracker App', () => {
    it('Should succeed as employee exists', (done) => {
        request(app)
            .get(`${EMPLOYEE_API_ENDPOINT}/duckd`)
            .end((err, res) => {
                expect(res.statusCode).toEqual(200)
                done();
            })
    });

    it('Should fail as employee doesn\'t exist', (done) => {
        request(app)
            .get(`${EMPLOYEE_API_ENDPOINT}/snoopy`)
            .end((err, res) => {
                expect(res.statusCode).toEqual(400)
                expect(res.text).toEqual('Employee with username: "snoopy" does not exist')
                done();
            })
    });
});

describe('Test to download an Image File from the Expense Tracker App', () => {
    it('Should successfully download image file', (done) => {
        request(app)
            .get(`${EMPLOYEE_API_ENDPOINT}/server/images/11ba67f6-d9ec-4a8a-bcd2-68499d45dfab.png`)
            .end((err, res) => {
                expect(res.statusCode).toEqual(200)
                done();
            })
    });
});

describe('Test to update an Employee password in the Expense Tracker App', () => {
    it('Should successfully update employee password', async () => {
        const username = 'duckd'
        const password = 'NewPassword5?'
        const id = await request(app)
            .get(`${EMPLOYEE_API_ENDPOINT}/${username}`)
            .then((res) => {return res.body[0]._id})
        const res = await request(app)
            .put(`${EMPLOYEE_API_ENDPOINT}/${id}/${password}`)
        expect(res.statusCode).toEqual(200)
        expect(res.text).toEqual('Password successfully updated')
    });
});

describe('Test to delete an Employee from the Expense Tracker App', () => {
    it('Should successfully delete employee', async () => {
        const username = 'duckd'
        Employees.find({username:  username},async function(err,employee){
            if(employee.length > 0) {
                const res = await request(app)
                    .delete(`${EMPLOYEE_API_ENDPOINT}/${username}/${ employee[0].profilePic}`)
                expect(res.statusCode).toEqual(200)
                expect(res.text).toEqual(`Successfully deleted employee: ${username}`)
            }
        });

    });
});