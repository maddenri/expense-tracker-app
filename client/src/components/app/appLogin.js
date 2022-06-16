import {Button, Col, Form} from "react-bootstrap";
import { Formik} from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import React from "react";

const Login = (props) => (
    <Formik
        onSubmit={( values, { resetForm }) => {
            const employee = {
                username: values.username,
                password: values.password,
            }
            resetForm();
            props.validateLogin(employee);
        }}
        initialValues={{
            username: "",
            password: "",
        }}
    >
        {({
              handleSubmit,
              handleChange,
              values,
          }) => (
            <Form name="login" onSubmit={handleSubmit}>
                <Col className="mb-4 px-5">
                    <Form.Group controlId="formUsername">
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            name="username"
                            autoComplete="off"
                            value={values.username}
                            onChange={handleChange}
                            required/>
                    </Form.Group>
                </Col>
                <Col className="px-5 mb-4">
                    <Form.Group controlId="formPassword">
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            name="password"
                            autoComplete="current-password"
                            value={values.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </Col>
                <Col className="text-center px-4 mb-3">
                    <Button className="px-5" variant="success" type="submit">Login</Button>
                </Col>
                <Col className="text-center px-4">
                    <p className="my-para">Please contact IT team for any login issues</p>
                </Col>
            </Form>
        )}
    </Formik>
)

export default Login;