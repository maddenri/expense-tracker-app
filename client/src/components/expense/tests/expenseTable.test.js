import {mount} from "enzyme";
import ExpenseTable from "../expenseTable";
import {mockExpenseDB} from '../../../tests/mock_fetch_api'
import React from "react";

let wrapper;

const tableProps = {
    employee: {username: 'murphyj', password: 'mockPassword12!'},
    expenses: mockExpenseDB,
    updateExpense: jest.fn(),
    deleteExpense: jest.fn()
}

beforeEach(() => {
    wrapper = mount(<ExpenseTable {...tableProps}/>);
});

afterEach(() => {
    wrapper.unmount();
});

describe("ExpenseTable Component", () => {
    it("Should render ExpenseTable component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});

describe("Visibility of ExpenseTable Children Components", () => {
    it("Shouldn't display 'Update Status', 'Delete Expense' or 'Total' rows", () => {
        expect(wrapper.find('.expenseUpdate').length).toEqual(0);
        expect(wrapper.find('.expenseDelete').length).toEqual(0);
        expect(wrapper.find('.expenseTotal').length).toEqual(0);
    });
    it("Should display 'Update Status' but not 'Delete Expense' or 'Total' rows", () => {
        wrapper.setProps({option: 'update'});
        expect(wrapper.find('.expenseUpdate').length).toBeGreaterThanOrEqual(1);
        expect(wrapper.find('.expenseDelete').length).toEqual(0);
        expect(wrapper.find('.expenseTotal').length).toEqual(0);
    });
    it("Should display 'Delete Expense' but not 'Update Status' or 'Total' rows", () => {
        wrapper.setProps({option: 'delete'});
        expect(wrapper.find('.expenseUpdate').length).toEqual(0);
        expect(wrapper.find('.expenseDelete').length).toBeGreaterThanOrEqual(1);
        expect(wrapper.find('.expenseTotal').length).toEqual(0);
    });
    it("Should display 'Total' but not 'Update Status' or 'Delete Expense' rows", () => {
        wrapper.setProps({section: 'listExpense'});
        expect(wrapper.find('.expenseUpdate').length).toEqual(0);
        expect(wrapper.find('.expenseDelete').length).toEqual(0);
        expect(wrapper.find('.expenseTotal').length).toBeGreaterThanOrEqual(1);
    });
});

describe("Validate the Expense Total of an Employee", () => {
    it("Should sum all expenses for a given employee", () => {
        wrapper.setProps({section: 'listExpense'});
        expect(wrapper.find('.expenseTotal').find('strong').text()).toEqual('€15.10');
    });
});

describe("Visibility of ExpenseRow Children Components", () => {
    it("Shouldn't display 'Update' or 'Delete' Buttons", () => {
        expect(wrapper.find('.updateButton').length).toEqual(0);
        expect(wrapper.find('.deleteButton').length).toEqual(0);
    });
    it("Should display Update' but not 'Delete' Buttons", () => {
        wrapper.setProps({option: 'update'});
        expect(wrapper.find('.updateButton').length).toBeGreaterThanOrEqual(1);
        expect(wrapper.find('.deleteButton').length).toEqual(0);
    });
    it("Should display Delete' but not 'Update' Buttons", () => {
        wrapper.setProps({option: 'delete'});
        expect(wrapper.find('.updateButton').length).toEqual(0);
        expect(wrapper.find('.deleteButton').length).toBeGreaterThanOrEqual(1);
    });
});



