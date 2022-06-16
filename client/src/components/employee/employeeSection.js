import React, {Component} from "react";
import {Badge, Col, Container, Row} from "react-bootstrap";
import { withAlert } from 'react-alert'
import {confirm} from "react-confirm-box";
import EmployeeAdd from "./employeeAdd";
import EmployeeSearch from "./employeeSearch";
import EmployeeDisplay from "./employeeDisplay";
import EmployeeUpdateDelete from "./employeeUpdateDelete";
const { EMPLOYEE_API_ENDPOINT} = require('../../config');

export class EmployeeSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee: {},
            searchSuccess: false,
        }
        this.addEmployee = this.addEmployee.bind(this);
        this.searchEmployee = this.searchEmployee.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
        this.deleteEmployee = this.deleteEmployee.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);
    }

    async addEmployee(employee) {
        const data = new FormData();
        for ( let key in employee ) {
            data.append(key, employee[key]);
        }
        const response = await fetch(EMPLOYEE_API_ENDPOINT, {
            method: 'POST',
            body: data
        });
        const body = await response.text();
        if (response.status !== 200) {
            this.props.alert.error(`Error: ${body}`, {timeout: 10000 })
        } else {
            this.props.alert.success(body, {timeout: 2000 })
        }
    };

    async searchEmployee(search) {
        const response = await fetch(`${EMPLOYEE_API_ENDPOINT}/${search.toLowerCase()}`)
        const body = await response.text();
        if (response.status !== 200) {
            this.props.alert.error(`Error: ${body}`)
        } else {
            this.setState({employee: JSON.parse(body)[0], searchSuccess: true});
        }
    };

    async updatePassword(newPassword) {
        const response = await fetch(
            `${EMPLOYEE_API_ENDPOINT}/${this.state.employee._id}/${newPassword}`, {
                method: 'PUT',
            });
        const body = await response.text();
        if (response.status !== 200) {
            this.props.alert.error(`Error: ${body}`)
        } else {
            this.props.alert.success(body, {timeout: 1500 })
        }
    };

    async deleteEmployee() {
        const response = await fetch(
            `${EMPLOYEE_API_ENDPOINT}/${this.state.employee.username}/${this.state.employee.profilePic}`, {
                method: 'DELETE',
            });
        const body = await response.text();
        if (response.status !== 200) {
            this.props.alert.error(`Error: ${body}`)
        } else {
            this.setState({employee: {}, searchSuccess: false})
            this.props.alert.success(body, {timeout: 3000})
        }
    };

    async confirmDelete() {
        const result = await confirm(`Are you sure you want to delete this employee?`)
        if (result) {
            await this.deleteEmployee();
        }
    }

    render() {
        return (
            <React.Fragment>
                <Container fluid>
                    <Row >
                        <Col md={true} className="mt-3 bg-light border shadow pt-3 rounded-3 me-md-4 me-lg-4 me-xl-4">
                            <h6><Badge className="mb-2" bg="dark">Create Employee</Badge></h6>
                            <EmployeeAdd addEmployee={this.addEmployee}/>
                        </Col>
                        <Col md={true} className="mt-3 bg-light border shadow pt-3 rounded-3 ms-md-4 ms-lg-4 ms-xl-4">
                            <h6><Badge className="mb-2" bg="dark">Review Employee</Badge></h6>
                            <EmployeeSearch searchEmployee={this.searchEmployee}/>
                            <hr/>
                            {this.state.searchSuccess ?
                                <React.Fragment>
                                    <EmployeeDisplay employee={this.state.employee} api={EMPLOYEE_API_ENDPOINT}/>
                                    <hr/>
                                    {this.state.employee.username !== "admin" ?
                                        <EmployeeUpdateDelete updatePassword={this.updatePassword}
                                                              confirmDelete={this.confirmDelete}/>
                                        : null}
                                </React.Fragment>
                            : null}
                        </Col>
                    </Row>
                </Container>
            </React.Fragment>
        );
    }
}

export default withAlert()(EmployeeSection);