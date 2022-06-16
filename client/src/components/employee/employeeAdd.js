import {Button, Form, Row} from "react-bootstrap";
import { Formik} from 'formik';
import React from "react";

const EmployeeAdd = (props) => (
    <Formik
        onSubmit={(values, { resetForm }) => {
            const form = document.forms.employeeAdd;
            const employee = {
                firstName: values.firstName.trim().charAt(0).toUpperCase() + values.firstName.trim().slice(1),
                surname: values.surname.trim().charAt(0).toUpperCase() + values.surname.trim().slice(1),
                username: values.username.trim().toLowerCase(),
                email: values.email.trim(),
                password: values.password,
                retypePassword: values.retypePassword,
                profilePic: values.file,
            }
            resetForm();
            form.profilePic.value = "";
            employee.name = employee.firstName + " " + employee.surname;
            props.addEmployee(employee);
        }}
        initialValues={{
            firstName: "",
            surname: "",
            username: "",
            email: "",
            password: "",
            retypePassword: ""
        }}
    >
        {({
              handleSubmit,
              handleChange,
              values,
              setFieldValue,
          }) => (
            <Form name="employeeAdd" onSubmit={handleSubmit} autoComplete="off">
                <Row className="mb-3">
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Control
                            type="text"
                            placeholder="First Name"
                            name="firstName"
                            value={values.firstName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formSurname">
                        <Form.Control
                            type="text"
                            placeholder="Surname"
                            name="surname"
                            value={values.surname}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formUsername">
                        <Form.Control
                            type="text"
                            placeholder="Username"
                            name="username"
                            value={values.username}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Control
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            autoComplete="off"
                            value={values.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
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
                    <Form.Group className="mb-3" controlId="formRetypePassword">
                        <Form.Control
                            type="password"
                            placeholder="Retype Password"
                            name="retypePassword"
                            autoComplete="current-password"
                            value={values.retypePassword}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formFile" className="mb-3">
                        <Form.Label className="ms-1">Employee Profile Picture:</Form.Label>
                        <Form.Control type="file"
                                      placeholder="Profile Picture"
                                      name="profilePic"
                                      value={values.profilePic}
                                      onChange={(event) => {
                                          setFieldValue("file", event.currentTarget.files[0])
                                      }}
                                      required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formButton">
                        <Button variant="secondary" type="submit">
                            Submit
                        </Button>
                    </Form.Group>
                </Row>
            </Form>
        )}
    </Formik>
)

export default EmployeeAdd;