import {Button, Col, Form, Row} from "react-bootstrap";
import React from "react";
import {Formik} from "formik";

const EmployeeSearch = (props) => (
    <React.Fragment>
        <Formik
            onSubmit={(values, { resetForm }) => {
                const search =  values.search;
                props.searchEmployee(search);
                resetForm();
            }}
            initialValues={{
                search: "",
            }}
        >
            {({
                  handleSubmit,
                  handleChange,
                  values,
              }) => (
                <Form name="searchEmployee" onSubmit={handleSubmit} autoComplete="off">
                    <Row className="mb-3">
                        <Col md={8} lg={8} xl={8}>
                            <Form.Group className="mb-3" controlId="formName">
                                <Form.Control
                                    type="text"
                                    placeholder="Search for Employee by Username"
                                    name="search"
                                    value={values.search}
                                    onChange={handleChange}
                                    required/>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group className="mb-3" controlId="formButtonSearch">
                                <Button variant="secondary" type="submit">
                                    Search
                                </Button>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            )}
        </Formik>
    </React.Fragment>
)

export default EmployeeSearch;