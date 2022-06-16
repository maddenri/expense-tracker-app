import {mount} from "enzyme";
import EmployeeSearch from "../employeeSearch";
import React from "react";

let wrapper;
const searchProps = {
    searchEmployee: jest.fn(),
}

beforeEach(() => {
    wrapper = mount(<EmployeeSearch {...searchProps}/>);
});

afterEach(() => {
    wrapper.unmount();
});

describe("EmployeeSearch Component", () => {
    it("Should render EmployeeSearch component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('Should call props function searchEmployee on form submission with correct arg', async () => {
        const values = {search: 'maddenr'}
        wrapper.find('Formik').prop('onSubmit')(values, {resetForm: jest.fn() })
        expect(searchProps.searchEmployee).toHaveBeenCalledWith('maddenr');
    });
});
