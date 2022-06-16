import React from "react";
import {Button, Container, Nav, Navbar, NavbarBrand} from "react-bootstrap";

function AppNavBar(props) {
    return (
        <Navbar bg="primary" variant="dark" expand="lg">
            <Container fluid>
                <NavbarBrand className="fw-bold">Expense Tracker App</NavbarBrand>
                <Navbar.Toggle aria-expanded="false"/>
                <Navbar.Collapse className="justify-content-between">
                    <Nav>
                        {props.employee.username !== "admin" ?
                            <React.Fragment>
                                <Nav.Link href="expense_list">Expenses</Nav.Link>
                                <Nav.Link href="expense_add">Create Expense</Nav.Link>
                                <Nav.Link href="expense_delete">Delete Expense</Nav.Link>
                            </React.Fragment>
                            :
                            <React.Fragment>
                                <Nav.Link href="employees">Employees</Nav.Link>
                                <Nav.Link href="expense_update">Expenses</Nav.Link>
                            </React.Fragment>
                        }
                    </Nav>
                    <Nav>
                        <Navbar.Toggle/>
                        <Navbar.Collapse className="justify-content-end">
                            <Navbar.Text>
                                Logged in as: <a href="/">{props.employee.username}</a>
                            </Navbar.Text>
                            <Button href="/" className="ms-4 px-3" variant="success"
                                    type="submit" onClick={props.handleLogout}>Logout</Button>
                        </Navbar.Collapse>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );

}

export default AppNavBar;