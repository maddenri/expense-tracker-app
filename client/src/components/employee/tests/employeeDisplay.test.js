import {shallow} from "enzyme";
import EmployeeDisplay from "../employeeDisplay";
import React from "react";

let wrapper;

const displayProps = {
    employee: {
       profilePic: null
    }
}

beforeEach(() => {
    wrapper = shallow(<EmployeeDisplay {...displayProps}/>);
});

afterEach(() => {
    wrapper.unmount();
});

describe("EmployeeDisplay Component", () => {
    it("Should render EmployeeDisplay component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});
