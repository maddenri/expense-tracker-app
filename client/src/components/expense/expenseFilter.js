import {Button, Col, Form, Row} from "react-bootstrap";
import { Formik} from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import React from "react";

const ExpenseFilter = (props) => (
    <Formik
        onSubmit={(values, { resetForm }) => {
            const filter =  values.filter;
            props.filterExpense(filter);
            resetForm();
        }}
        initialValues={{
            filter: "",
        }}
    >
        {({
              handleSubmit,
              handleChange,
              values,
          }) => (
            <Form name="expenseFilter" onSubmit={handleSubmit} autoComplete="off">
                <Row className="mb-3">
                    <Col lg={true}>
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Control
                                type="text"
                                placeholder="Filter Expenses by Item Type or Item Status"
                                name="filter"
                                value={values.filter}
                                onChange={handleChange}
                                required/>
                        </Form.Group>
                    </Col>
                    <Col  xs={3} sm={2} md={2} lg={1} xl={1}>
                        <Form.Group className="mb-3" controlId="formButtonSubmit">
                            <Button variant="secondary" type="submit">
                                Submit
                            </Button>
                        </Form.Group>
                    </Col>
                    <Col >
                        <Form.Group className="mb-3" controlId="formButtonClear">
                            <Button variant="secondary" onClick={props.clearFilter} >
                                Clear Filter
                            </Button>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
        )}
    </Formik>
)

export default ExpenseFilter;
