import {shallow} from "enzyme";
import AppNavBar from "../appNavBar";
import React from "react";

let wrapper;

const navBarProps = {
    employee: {username: 'mockEmployee', password: 'mockPassword12!'}
}

beforeEach(() => {
    wrapper = shallow(<AppNavBar {...navBarProps}/>);
});

afterEach(() => {
    wrapper.unmount();
});

describe("AppNavBar Component", () => {
    it("Should render AppNavBar component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});

describe("Logged in User", () => {
    it("Should display username on AppNavBar", () => {
        expect(wrapper.find('NavbarText').text()).toEqual('Logged in as: mockEmployee');
    });
    it("Should display correct tabs for non-admin employee on AppNavBar", () => {
        expect(wrapper.find('NavLink[href="expense_list"]').length).toEqual(1);
        expect(wrapper.find('NavLink[href="expense_add"]').length).toEqual(1);
        expect(wrapper.find('NavLink[href="expense_delete"]').length).toEqual(1);
        expect(wrapper.find('NavLink[href="employees"]').length).toEqual(0);
        expect(wrapper.find('NavLink[href="expense_update"]').length).toEqual(0);
    });
    it("Should display correct tabs for admin employee on AppNavBar", () => {
        wrapper.setProps({employee: {username: 'admin', password: 'dontRevealHere1!'}})
        expect(wrapper.find('NavLink[href="expense_list"]').length).toEqual(0);
        expect(wrapper.find('NavLink[href="expense_add"]').length).toEqual(0);
        expect(wrapper.find('NavLink[href="expense_delete"]').length).toEqual(0);
        expect(wrapper.find('NavLink[href="employees"]').length).toEqual(1);
        expect(wrapper.find('NavLink[href="expense_update"]').length).toEqual(1);
    });
});
