import React from 'react';
import {shallow} from 'enzyme';
import {ExpenseSection} from '../expenseSection';
import {mock_fetch_api_text, mock_fetch_api_json, mockExpenseDB} from '../../../tests/mock_fetch_api'
require('../../../config');

let wrapper;

beforeEach(() => {
    global.fetch = jest.fn();
    wrapper = shallow(<ExpenseSection alert={{success: jest.fn(), error: jest.fn()}}/>, { disableLifecycleMethods: true});

});

afterEach(() => {
    wrapper.unmount();
});

describe("ExpenseSection component", () => {
    it("Should render ExpenseSection component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});

describe("Visibility of ExpenseSection Children Components", () => {
    it("Should not display ExpenseFilter or ExpenseAdd components", () => {
        expect(wrapper.find('ExpenseFilter').length).toEqual(0);
        expect(wrapper.find('ExpenseAdd').length).toEqual(0);
    });
    it("Should display ExpenseFilter but not ExpenseAdd component", () => {
        wrapper.setProps({section: 'listExpense'});
        expect(wrapper.find('ExpenseFilter').length).toEqual(1);
        expect(wrapper.find('ExpenseAdd').length).toEqual(0);
        wrapper.setProps({section: 'updateExpense'});
        expect(wrapper.find('ExpenseFilter').length).toEqual(1);
        expect(wrapper.find('ExpenseAdd').length).toEqual(0);
    });

    it("Should display ExpenseAdd but not ExpenseFilter component", () => {
        wrapper.setProps({section: 'addExpense'});
        expect(wrapper.find('ExpenseFilter').length).toEqual(0);
        expect(wrapper.find('ExpenseAdd').length).toEqual(1);
    });
});

describe("Adding an Expense", () => {
    const mockAddExpense = {
        _id: '4',
        purchasedOn: "2021-11-01",
        name: "John Doe",
        username: "doej",
        itemName: "Milk",
        itemType: "Food",
        itemCost: "€3.20",
        itemStatus: "Open",
    };

    it("Should update state and provide success alert once expense has been added",
        async (done) => {
            const spyAddExpense = jest.spyOn(wrapper.instance(),'addExpense');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'success');
            wrapper.setState({expenses: mockExpenseDB});
            mock_fetch_api_text(200, mockAddExpense);
            const addExpense = wrapper.instance().addExpense(mockAddExpense);
            expect(spyAddExpense).toHaveBeenCalled();
            addExpense.then(() => {
                wrapper.update();
                expect(spyAlert).toHaveBeenCalled();
                expect(wrapper.state().expenses).toEqual([...mockExpenseDB, mockAddExpense]);
                fetch.mockClear();
                done();
            });
        });

    it("Should alert error having failed to add expense",
        async (done) => {
            const spyAddExpense = jest.spyOn(wrapper.instance(),'addExpense');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'error');
            mock_fetch_api_text(400, mockAddExpense);
            const addExpense = wrapper.instance().addExpense(mockAddExpense);
            expect(spyAddExpense).toHaveBeenCalled();
            addExpense.then(() => {
                expect(spyAlert).toHaveBeenCalled()
                fetch.mockClear();
                done();
            });
        });
});

describe("Updating an Expense", () => {
    const mockUpdateExpense = {
        _id: '2',
        purchasedOn: "2021-11-14",
        name: "Peter Higgins",
        username: "higginsp",
        itemName: "Bread",
        itemType: "Food",
        itemCost: "€2.20",
        itemStatus: "Closed",
    };

    const updatedMockExpenseDB = [{
        _id: '0',
        purchasedOn: "2021-11-08",
        name: "Jane Murphy",
        username: "murphyj",
        itemName: "Eggs",
        itemType: "Food",
        itemCost: "€3.10",
        itemStatus: "Open",
        },  {
        _id: '1',
        purchasedOn: "2021-11-04",
        name: "Jane Murphy",
        username: "murphyj",
        itemName: "Gin",
        itemType: "Alcohol",
        itemCost: "€12.00",
        itemStatus: "Open",
        }, {
        _id: '2',
        purchasedOn: "2021-11-14",
        name: "Peter Higgins",
        username: "higginsp",
        itemName: "Bread",
        itemType: "Food",
        itemCost: "€2.20",
        itemStatus: "Closed",
        }]

    it("Should update state and provide success alert once expense has been updated",
        async (done) => {
            const spyUpdateExpense = jest.spyOn(wrapper.instance(),'updateExpense');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'success');
            wrapper.setState({expenses: mockExpenseDB});
            mock_fetch_api_text(200, mockUpdateExpense);
            const updateExpense = wrapper.instance().updateExpense(mockUpdateExpense, "Closed");
            expect(spyUpdateExpense).toHaveBeenCalled();
            updateExpense.then(() => {
                wrapper.update();
                expect(spyAlert).toHaveBeenCalled();
                expect(wrapper.state().expenses).toEqual(updatedMockExpenseDB);
                fetch.mockClear();
                done();
            });
        });

    it("Should alert error having failed to update expense",
        async (done) => {
            const spyUpdateExpense = jest.spyOn(wrapper.instance(),'updateExpense');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'error');
            mock_fetch_api_text(400, mockUpdateExpense);
            const updateExpense = wrapper.instance().updateExpense(mockUpdateExpense, "Closed");
            expect(spyUpdateExpense).toHaveBeenCalled();
            updateExpense.then(() => {
                expect(spyAlert).toHaveBeenCalled()
                fetch.mockClear();
                done();
            });
        });
});

describe("Deleting an Expense", () => {
    const mockDeleteExpense = {
        _id: '2',
        purchasedOn: "2021-11-14",
        name: "Peter Higgins",
        username: "higginsp",
        itemName: "Bread",
        itemType: "Food",
        itemCost: "€2.20",
        itemStatus: "Open",
    };

    const deletedMockExpenseDB = [{
        _id: '0',
        purchasedOn: "2021-11-08",
        name: "Jane Murphy",
        username: "murphyj",
        itemName: "Eggs",
        itemType: "Food",
        itemCost: "€3.10",
        itemStatus: "Open",
        },
        {
        _id: '1',
        purchasedOn: "2021-11-04",
        name: "Jane Murphy",
        username: "murphyj",
        itemName: "Gin",
        itemType: "Alcohol",
        itemCost: "€12.00",
        itemStatus: "Open",
    }]
    it("Should update state and provide success alert once expense has been deleted",
        async (done) => {
            const spyDeleteExpense = jest.spyOn(wrapper.instance(),'deleteExpense');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'success');
            wrapper.setState({expenses: mockExpenseDB});
            mock_fetch_api_text(200, mockDeleteExpense);
            const deleteExpense = wrapper.instance().deleteExpense(mockDeleteExpense);
            expect(spyDeleteExpense).toHaveBeenCalled();
            deleteExpense.then(() => {
                wrapper.update();
                expect(spyAlert).toHaveBeenCalled();
                expect(wrapper.state().expenses).toEqual(deletedMockExpenseDB);
                fetch.mockClear();
                done();
            });
        });

    it("Should provide error alert having failed to delete expense",
        async (done) => {
            const spyUpdateExpense = jest.spyOn(wrapper.instance(),'deleteExpense');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'error');
            mock_fetch_api_text(400, mockDeleteExpense);
            const deleteExpense = wrapper.instance().deleteExpense(mockDeleteExpense);
            expect(spyUpdateExpense).toHaveBeenCalled();
            deleteExpense.then(() => {
                expect(spyAlert).toHaveBeenCalled()
                fetch.mockClear();
                done();
            });
        });
});

describe("Filtering an Expense", () => {
    const filteredMockExpenseDB = [{
        _id: '1',
        purchasedOn: "2021-11-04",
        name: "Jane Murphy",
        username: "murphyj",
        itemName: "Gin",
        itemType: "Alcohol",
        itemCost: "€12.00",
        itemStatus: "Open",
    }]
    it("Should update state once expense has been filtered",
        async (done) => {
            const spyFilterExpense = jest.spyOn(wrapper.instance(),'loadFilteredExpenses');
            wrapper.setState({expenses: mockExpenseDB});
            const filterExpense = wrapper.instance().loadFilteredExpenses('Alcohol');
            expect(spyFilterExpense).toHaveBeenCalled();
            filterExpense.then(() => {
                wrapper.update();
                expect(wrapper.state().expenses).toEqual(filteredMockExpenseDB);
                fetch.mockClear();
                done();
            });
        });
});

describe("Loading Expense Data", () => {
    it("Should update state and retrieve expense data once page loads",
        async (done) => {
            const spyLoadExpenses = jest.spyOn(wrapper.instance(),'componentDidMount');
            mock_fetch_api_json(200);
            wrapper.setState({expenses: mockExpenseDB});
            const loadExpense = wrapper.instance().componentDidMount();
            expect(spyLoadExpenses).toHaveBeenCalled();
            loadExpense.then(() => {
                wrapper.update();
                expect(wrapper.state().expenses).toEqual(mockExpenseDB);
                fetch.mockClear();
                done();
            });
        });

    it("Should provide error alert if unable to retrieve expense data once page loads",
        async (done) => {
            const spyLoadExpenses = jest.spyOn(wrapper.instance(),'loadExpenseData');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'error');
            mock_fetch_api_json(400);
            const loadExpense = wrapper.instance().loadExpenseData();
            expect(spyLoadExpenses).toHaveBeenCalled();
            loadExpense.then(() => {
                expect(spyAlert).toHaveBeenCalled()
                fetch.mockClear();
                done();
            });
        });
});
