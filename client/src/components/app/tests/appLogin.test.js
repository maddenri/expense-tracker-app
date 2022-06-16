import {mount} from "enzyme";
import Login from "../appLogin";
import React from "react";

let wrapper;
const loginProps = {
    validateLogin: jest.fn(),
}

beforeEach(() => {
    wrapper = mount(<Login {...loginProps}/>);
});

afterEach(() => {
    wrapper.unmount();
});

describe("Login Component", () => {
    it("Should render Login component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });

    it('Should call props function validateLogin on form submission with correct args', async () => {
        const values = {username: 'milliganm', password: 'GolfCity5!'}
         wrapper.find('Formik').prop('onSubmit')(values, {resetForm: jest.fn() })
         expect(loginProps.validateLogin).toHaveBeenCalledWith(values);
    });
});
