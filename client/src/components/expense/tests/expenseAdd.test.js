import {mount} from "enzyme";
import ExpenseAdd from "../expenseAdd";
import React from "react";

let wrapper;
const addProps = {
    addExpense: jest.fn(),
    employee: {
        employeeName: 'Billie Bradshaw',
        username: 'bradshawb'
    }
}

beforeEach(() => {
    global.document.forms.expenseAdd = {purchasedOn: {value: '2021-11-01'}, itemCost: {value: '€2.00'}};
    wrapper = mount(<ExpenseAdd {...addProps}/>);
});

afterEach(() => {
    wrapper.unmount();
});

describe("ExpenseAdd Component", () => {
    const expenseFormValues = {
        itemName: 'milk',
        itemType: 'Food'
    }
    it("Should render ExpenseAdd component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('Should call props function addExpense on form submission with correct args', () => {
        const expenseFormSubmitted = {
            purchasedOn: '2021-11-01',
            name: 'Billie Bradshaw',
            username: 'bradshawb',
            itemName: 'Milk',
            itemType: 'Food',
            itemCost: '€2.00',
        }
        wrapper.find('Formik').prop('onSubmit')(expenseFormValues, {resetForm: jest.fn() })
        expect(addProps.addExpense).toHaveBeenCalledWith(expenseFormSubmitted);
    });
});
