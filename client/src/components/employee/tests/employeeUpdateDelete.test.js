import {mount} from "enzyme";
import {EmployeeUpdateDelete} from "../employeeUpdateDelete";
import React from "react";

let wrapper;
const updateDeleteProps = {
    updatePassword: jest.fn(),
    confirmDelete: jest.fn(),
    alert: {success: jest.fn(), error: jest.fn()}
}

beforeEach(() => {
    wrapper = mount(<EmployeeUpdateDelete {...updateDeleteProps}/>);
});

afterEach(() => {
    wrapper.unmount();
});

describe("EmployeeUpdateDelete Component", () => {

    it("Should render EmployeeUpdateDelete component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('Should error alert when passwords don\'t match',  () => {
        const formValues = {
            password: 'MysteryM8ine!',
            retypePassword:'MysteryM8chine!'
        }
        wrapper.find('Formik').prop('onSubmit')(formValues, {resetForm: jest.fn() })
        expect(updateDeleteProps.alert.error).toHaveBeenCalled();
    });

    it('Should error alert if password does not meet criteria',  () => {
        const formValues = {
            password: 'MysteryM8',
            retypePassword:'MysteryM8'
        }
        wrapper.find('Formik').prop('onSubmit')(formValues, {resetForm: jest.fn() })
        expect(updateDeleteProps.alert.error).toHaveBeenCalled();
    });

    it('Should call props function updatePassword on form submission with correct args',  () => {
        const formValues = {
            password: 'MysteryM8chine!',
            retypePassword:'MysteryM8chine!'
        }
        wrapper.find('Formik').prop('onSubmit')(formValues, {resetForm: jest.fn() })
        expect(updateDeleteProps.updatePassword).toHaveBeenCalledWith(formValues.password);
    });

    it('Should call props function deleteEmployee when button clicked',  () => {
        wrapper.find('Button').last().simulate('click')
        expect(updateDeleteProps.confirmDelete).toHaveBeenCalled();
    });
});
