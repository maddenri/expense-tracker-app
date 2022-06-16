import React, {Component} from "react";
import { withAlert } from 'react-alert'
import ExpenseAdd from "./expenseAdd";
import ExpenseTable from "./expenseTable";
import ExpenseFilter from "./expenseFilter";
const { EXPENSE_API_ENDPOINT} = require('../../config');

export class ExpenseSection extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expenses: [],
        }
        this.addExpense = this.addExpense.bind(this);
        this.deleteExpense = this.deleteExpense.bind(this);
        this.updateExpense = this.updateExpense.bind(this);
        this.loadExpenseData = this.loadExpenseData.bind(this);
        this.loadFilteredExpenses = this.loadFilteredExpenses.bind(this);
    }

    async addExpense(expenses) {
        const response = await fetch(EXPENSE_API_ENDPOINT, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(expenses)
        });
        const body = await response.text();
        if (response.status !== 200) {
            this.props.alert.error(`Error: ${body}`, {timeout: 10000 })
        } else {
            this.setState({expenses: [...this.state.expenses, JSON.parse(body)]})
            this.props.alert.success('Expense successfully added', {timeout: 2000 })
        }
    };

    async updateExpense(expense, status) {
        const response = await fetch(
            `${EXPENSE_API_ENDPOINT}/${expense._id}/${status}`, {
                method: 'PUT',
            });
        const body = await response.text();
        if (response.status !== 200) {
            this.props.alert.error(`Error: ${body}`)
        } else {
            this.setState(prevState => {
            const itemIndex = this.state.expenses.findIndex((item => item._id === expense._id));
            const copy = Object.assign({}, prevState.expenses);
            copy[itemIndex].itemStatus = status;
            return {copy};
        })
            this.props.alert.success(body, {timeout: 1500 })
        }
    };

    async deleteExpense(expense) {
        const response = await fetch(
            `${EXPENSE_API_ENDPOINT}/${expense._id}`, {
                method: 'DELETE',
            });
        const body = await response.text();
        if (response.status !== 200) {
            this.props.alert.error(`Error: ${body}`)
        } else {
            this.setState({expenses: this.state.expenses.filter((item) => item._id !== expense._id)})
            this.props.alert.success(body, {timeout: 2000 })
        }
    };

    async loadFilteredExpenses(filter) {
        this.setState(
            {expenses: this.state.expenses.filter((
                item => (item.itemType.toLowerCase() === filter.toLowerCase() ||
                         item.itemStatus.toLowerCase() === filter.toLowerCase())
                ))}
        )
    }

    async loadExpenseData() {
        const response = await fetch(EXPENSE_API_ENDPOINT);
        const body = await response.json();
        if (response.status !== 200) {
            this.props.alert.error(`Error: ${body}`)
        } else {
            this.setState({expenses: body})
        }
    };

    async componentDidMount() {
        this.loadExpenseData()
            .catch(err => (this.props.alert.error(`Error: ${err}`)));
    }

    render() {
        return (
            <React.Fragment>
                <ExpenseTable employee={this.props.employee} option={this.props.option} expenses={this.state.expenses}
                              section={this.props.section} deleteExpense={this.deleteExpense} updateExpense={this.updateExpense}/>
                <hr/>
                {this.props.section === "listExpense" || this.props.section === "updateExpense" ?
                    <ExpenseFilter filterExpense={this.loadFilteredExpenses} clearFilter={this.loadExpenseData}/> : null}
                {this.props.section === "addExpense" ?
                    <ExpenseAdd employee={this.props.employee} addExpense={this.addExpense}/> : null}
            </React.Fragment>
        );
    }
}

export default withAlert()(ExpenseSection);
