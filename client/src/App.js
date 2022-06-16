import React, {Component} from 'react';
import {Badge, Container, Row, Col} from "react-bootstrap";
import {BrowserRouter as Router, Routes ,Route} from "react-router-dom";
import { withAlert } from 'react-alert'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import AppNavBar from "./components/app/appNavBar";
import Login from './components/app/appLogin';
import EmployeeSection from "./components/employee/employeeSection";
import ExpenseSection from "./components/expense/expenseSection";
const { EMPLOYEE_API_ENDPOINT} = require('./config');
require('./App.css');

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            employee: localStorage.getItem('employee') || false,
            loggedIn: localStorage.getItem('loggedIn') || false,
        }
        this.validateEmployee = this.validateEmployee.bind(this);
        this.storageUpdated = this.storageUpdated.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        window.addEventListener('storage', (e) => this.storageUpdated(e));
    }

    async storageUpdated(e) {
        if(e.key === 'loggedIn') {
            this.setState({loggedIn: e.newValue})
        }
        if(e.key === 'employee') {
            this.setState({employee: e.newValue})
        }
    }

    async validateEmployee(employee) {
        const response = await fetch(
            `${EMPLOYEE_API_ENDPOINT}/${employee.username.toLowerCase()}/${employee.password}`);
        const body = await response.text();
        if (response.status !== 200) {
            this.props.alert.error(`Error: ${body}`);
        } else {
            this.setState({employee: JSON.stringify(JSON.parse(body)[0]), loggedIn: true});
            localStorage.setItem('employee', JSON.stringify(JSON.parse(body)[0]));
            localStorage.setItem('loggedIn', 'true');
        }
    };

    async handleLogout() {
        this.setState({employee: false, loggedIn: false});
        localStorage.removeItem('employee');
        localStorage.removeItem('loggedIn');
    }


    render() {
        const loggedIn = this.state.loggedIn
        const employee = this.state.employee ? JSON.parse(this.state.employee) : false

        return (
            <React.Fragment>
                {!loggedIn ?
                    <React.Fragment>
                        <Container>
                            <Row>
                                <Col/>
                                <Col className="mt-10 bg-primary bg-opacity-75 shadow pt-5 pb-3 rounded-3"
                                                xs={10} sm={10} md={8} lg={6} xl={6}>
                                    <h1 className="my-badge">Expense Tracker App</h1>
                                    <Login validateLogin={this.validateEmployee}/>
                                </Col>
                                <Col/>
                            </Row>
                        </Container>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <AppNavBar employee={employee} handleLogout={this.handleLogout}/>
                        <Container fluid>
                            <Router>
                                <Routes>
                                    {employee.username !== "admin" ?
                                        <React.Fragment>
                                            {["/", "/expense_list"].map(path => (<Route key={path} path={path}
                                                   element={<React.Fragment><h6><Badge className="mt-4" bg="dark">Expense
                                                       List</Badge></h6><ExpenseSection employee={employee}
                                                                                        section="listExpense"/></React.Fragment>}/>))}
                                            <Route path="/expense_add"
                                                   element={<React.Fragment><h6><Badge className="mt-4" bg="dark">Create
                                                       Expense</Badge></h6><ExpenseSection employee={employee}
                                                                                           section="addExpense"/></React.Fragment>}/>

                                            <Route path="/expense_delete"
                                                   element={<React.Fragment><h6><Badge className="mt-4" bg="dark">Delete
                                                       Expense</Badge></h6><ExpenseSection employee={employee}
                                                                                           section="deleteExpense"
                                                                                           option="delete"/></React.Fragment>}/>
                                        </React.Fragment>
                                        :
                                        <React.Fragment>
                                            {["/", "/employees"].map(path => (<Route key={path} path={path}
                                                   element={<React.Fragment><EmployeeSection/></React.Fragment>}/>))}
                                            <Route path="/expense_update"
                                                   element={<React.Fragment><h6><Badge className="mt-4" bg="dark">Update
                                                       Expense</Badge></h6><ExpenseSection employee={employee}
                                                                                           section="updateExpense"
                                                                                           option="update"/></React.Fragment>}/>
                                        </React.Fragment>
                                    }
                                </Routes>
                            </Router>
                        </Container>
                    </React.Fragment>
                }
            </React.Fragment>
        );
    }
}

export default withAlert()(App);
