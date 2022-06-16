import {mount} from "enzyme";
import EmployeeAdd from "../employeeAdd";
import React from "react";

let wrapper;
const addProps = {
    addEmployee: jest.fn(),
}

beforeEach(() => {
    global.document.forms.employeeAdd = {profilePic: {value: null}};
    wrapper = mount(<EmployeeAdd {...addProps}/>);
});

afterEach(() => {
    wrapper.unmount();
});

describe("EmployeeSearch Component", () => {
    const employeeFormValues = {
        firstName: 'scooby',
        surname: ' doo ',
        username: '  doos ',
        email: 'doos@company.com',
        password: 'MysteryM8chine!',
        retypePassword:'MysteryM8chine!',
        file: '12fbsna-3421-23r.png'}
    it("Should render EmployeeSearch component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('Should call props function searchEmployee on form submission with correct args', () => {
        const employeeFormSubmitted = {
            firstName: 'Scooby',
            surname: 'Doo',
            name: 'Scooby Doo',
            username: 'doos',
            email: 'doos@company.com',
            password: 'MysteryM8chine!',
            retypePassword:'MysteryM8chine!',
            profilePic: '12fbsna-3421-23r.png'}
        wrapper.find('Formik').prop('onSubmit')(employeeFormValues, {resetForm: jest.fn() })
        expect(addProps.addEmployee).toHaveBeenCalledWith(employeeFormSubmitted);
    });
});
