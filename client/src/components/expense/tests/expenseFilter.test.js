import {mount} from "enzyme";
import ExpenseFilter from "../expenseFilter";
import React from "react";

let wrapper;
const filterProps = {
    filterExpense: jest.fn(),
}

beforeEach(() => {
    wrapper = mount(<ExpenseFilter {...filterProps}/>);
});

afterEach(() => {
    wrapper.unmount();
});

describe("ExpenseFilter Component", () => {
    it("Should render ExpenseFilter component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('Should call props function filterExpense on form submission with correct arg', async () => {
        const values = {filter: 'Food'}
        wrapper.find('Formik').prop('onSubmit')(values, {resetForm: jest.fn() })
        expect(filterProps.filterExpense).toHaveBeenCalledWith('Food');
    });
});
