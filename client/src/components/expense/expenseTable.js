import {Table,Thead,Tbody, Td,Th,Tr} from "react-super-responsive-table";
import React from "react";
import {Button, Dropdown, DropdownButton} from "react-bootstrap";

function ExpenseTable(props) {
    let expenseTotal = 0;
    let formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'EUR',
    });

    const expenseRows = props.expenses.map(expense => (
        <ExpenseRow key={expense._id} employee={props.employee} expense={expense} option={props.option}
                    deleteExpense={props.deleteExpense} updateExpense={props.updateExpense}/>));
    const expenseTotals = props.expenses
        .filter((expense) => props.employee.username === 'admin' ? expense : expense.username === props.employee.username)
        .map(expense => (parseFloat(expense.itemCost.substring(1))));
    expenseTotals.forEach((v) => (expenseTotal += v));

    return (
        <Table className="table table-bordered table-hover table-responsive-lg table-light">
            <Thead className="table table-primary">
                <Tr>
                    <Th>Creation Date</Th>
                    <Th>Purchase Date</Th>
                    <Th>Employee</Th>
                    <Th>Item Name</Th>
                    <Th>Item Type</Th>
                    <Th>Item Cost</Th>
                    <Th>Item Status</Th>
                    {props.option === "update" ?
                        <Th className='expenseUpdate'>Update Status</Th> : null}
                    {props.option === "delete" ?
                        <Th className='expenseDelete'>Delete Expense</Th> : null}
                </Tr>
            </Thead>
            <Tbody>
                {expenseRows}
            </Tbody>
            {props.section === "listExpense" ?
                <tfoot>
                    <Tr>
                        <Td/><Td/><Td/><Td/>
                        <Td><strong>Total</strong></Td>
                        <Td className='expenseTotal'><strong>{formatter.format(expenseTotal)}</strong></Td>
                        <Td/>
                    </Tr>
                </tfoot> : null}
        </Table>
    );
}

function ExpenseRow(props) {
    const expense = props.expense;
    const username = props.employee.username;
    const handleSelect=(e)=>{
        props.updateExpense(expense, e)
    };

    return (
        <React.Fragment>
            {username === "admin" || username === expense.username?
                <Tr>
                    <Td>{expense.createdOn}</Td>
                    <Td>{expense.purchasedOn}</Td>
                    <Td>{expense.name}</Td>
                    <Td>{expense.itemName}</Td>
                    <Td>{expense.itemType}</Td>
                    <Td>{expense.itemCost}</Td>
                    <Td>{expense.itemStatus}</Td>
                    {props.option === "update" ?
                        <Td className="updateButton">
                            <DropdownButton size="sm" variant="warning"
                                            id="dropdown-menu-align-right" title="Update"
                                            onSelect={handleSelect}>
                            <Dropdown.Item eventKey="Open">Open</Dropdown.Item>
                            <Dropdown.Item eventKey="Accepted">Accepted</Dropdown.Item>
                            <Dropdown.Item eventKey="Rejected">Rejected</Dropdown.Item>
                            <Dropdown.Item eventKey="Closed">Closed</Dropdown.Item>
                        </DropdownButton></Td> : null}
                    {props.option === "delete" ?
                        <Td className="deleteButton">
                            <Button size="sm" variant="danger"
                                    onClick={() => (props.deleteExpense(expense))}>Delete</Button></Td> : null}
                </Tr> : null}
        </React.Fragment>
    );
}

export default ExpenseTable;