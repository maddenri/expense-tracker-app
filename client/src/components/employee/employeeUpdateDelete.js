import React from "react";
import {Formik} from "formik";
import {Button, Col, Form, Row} from "react-bootstrap";
import {withAlert} from 'react-alert'

export const EmployeeUpdateDelete = (props) => (
    <Formik
        onSubmit={(values, {resetForm}) => {
            const regex_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*]{8,}$/
            if (values.password !== values.retypePassword) {
                props.alert.error('Passwords do not match')
            } else if(!(regex_password.test(values.password))) {
                props.alert.error('Password must be a minimum of eight characters and contain at least one letter, one number and one special character (i.e. @,$,!,%,*)');
            }
            else {
                props.updatePassword(values.password)
            }
            resetForm();
        }}
        initialValues={{
            password: "",
            retypePassword: ""
        }}
    >
        {({
              handleSubmit,
              handleChange,
              values,
          }) => (
            <Form name="employeeModify" onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col>
                        <Form.Group className="mb-3" controlId="formPassword">
                            <Form.Control
                                type="password"
                                placeholder="Password"
                                name="password"
                                autoComplete="new-password"
                                value={values.password}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="formRetypePassword">
                            <Form.Control
                                type="password"
                                placeholder="Retype Password"
                                name="retypePassword"
                                autoComplete="new-password"
                                value={values.retypePassword}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row className="mb-3">
                    <Col>
                        <Form.Group className="mb-3" controlId="formButton">
                            <Button variant="warning" type="submit">
                                Update Password
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3" controlId="formButton">
                            <Button variant="danger" onClick={props.confirmDelete}>
                                Delete Employee
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        )}
    </Formik>
)

export default withAlert()(EmployeeUpdateDelete);