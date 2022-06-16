import {Button, Col, Form, Row} from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Formik} from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import CurrencyInput from 'react-currency-input-field';
import React from "react";

const ExpenseAdd = (props) => (
    <Formik
        onSubmit={(values, { resetForm }) => {
            const form = document.forms.expenseAdd;
            const expense = {
                purchasedOn: form.purchasedOn.value,
                name: props.employee.employeeName,
                username: props.employee.username,
                itemName: values.itemName.trim().charAt(0).toUpperCase() + values.itemName.trim().slice(1),
                itemType: values.itemType,
                itemCost: form.itemCost.value,
            }
            resetForm();
            props.addExpense(expense);
        }}
        initialValues={{
            purchasedOn: "",
            itemName: "",
            itemType: "",
            itemCost: "",
        }}
    >
        {({
              handleSubmit,
              handleChange,
              values,
              setFieldValue,
          }) => (
            <Form name="expenseAdd" onSubmit={handleSubmit} autoComplete="off">
                <Row className="mb-3">
                    <Col lg={true}>
                        <Form.Group className="mb-3" controlId="formPurchaseOn"  >
                            <DatePicker
                                className="form-control"
                                dateFormat="yyyy-MM-dd"
                                name="purchasedOn"
                                value={values.purchasedOn}
                                selected={values.purchasedOn}
                                onChange={date => setFieldValue('purchasedOn', date)}
                                placeholderText="Purchase Date"
                                isClearable
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={true}>
                        <Form.Group className="mb-3" controlId="formItemName">
                            <Form.Control
                                type="text"
                                placeholder="Item Name"
                                name="itemName"
                                value={values.itemName}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                    <Col lg={true}>
                        <Form.Group className="mb-3" controlId="formItemCost">
                            <CurrencyInput
                                name="itemCost"
                                value={values.itemCost}
                                className="form-control"
                                placeholder="Item Cost"
                                prefix="€"
                                decimalsLimit={2}
                                decimalScale={2}
                                onValueChange={value => setFieldValue('itemCost', value)}
                                required/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col lg={true}>
                        <Form.Group className="mb-3" controlId="formItemType">
                          <Form.Select
                                type="text"
                                name="itemType"
                                value={values.itemType}
                                onChange={handleChange}
                                required>
                                <option label="Item Type"/>
                                <option value="Food">Food</option>
                                <option value="Household">Household</option>
                                <option value="Alcohol">Alcohol</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col lg={true}>
                        <Form.Group className="mb-3" controlId="formButton">
                            <Button variant="secondary" type="submit">
                            Submit
                            </Button>
                        </Form.Group>
                    </Col>
                <Col/>
                </Row>
            </Form>
        )}
    </Formik>
)

export default ExpenseAdd;