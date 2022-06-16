import React from "react";
import {Col, Image, ListGroup, Row} from "react-bootstrap";

const EmployeeDisplay = (props) => (
    <React.Fragment>
        <Row>
            <Col>
                <Image
                    className="my_img"
                    src={`${props.api}/server/images/${props.employee.profilePic}`}
                    thumbnail/>
            </Col>
            <Col>
                <ListGroup.Item className="justify-content-between align-items-start">
                    <div className="fw-bold">Employee:</div>
                    {props.employee.employeeName}
                </ListGroup.Item>
                <ListGroup.Item className="justify-content-between align-items-start">
                    <div className="fw-bold">Username:</div>
                    {props.employee.username}
                </ListGroup.Item>
                <ListGroup.Item className="justify-content-between align-items-start">
                    <div className="fw-bold">Email:</div>
                    {props.employee.email}
                </ListGroup.Item>
            </Col>
        </Row>
    </React.Fragment>
)

export default EmployeeDisplay;