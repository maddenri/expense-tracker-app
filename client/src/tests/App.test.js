import React from 'react';
import {shallow} from 'enzyme';
import {App} from "../App";
import {mock_fetch_api_text} from './mock_fetch_api'
require('../config');

let wrapper;

const mockEmployee = {
    username: "curriem",
    password: "Radioactive1!",
};
const mockEmployee_fetchResponse = [{
        "employeeName":"Marie Curie",
        "username":"curriem",
        "email":"curriem@company.com",
        "password":"Radioactive1!",
        "profilePic":"124a67f6-d9dc-4a8a-bcd2-62344d45dfab.png",
    }]

beforeEach(() => {
    global.fetch = jest.fn();
    wrapper = shallow(<App alert={{success: jest.fn(), error: jest.fn()}}/>, { disableLifecycleMethods: true});
});

afterEach(() => {
    wrapper.unmount();
});

describe("App Component", () => {
    it("Should render App component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});

describe("Visibility of App Children Components", () => {
    it("Should display Login component if not logged in", () => {
        wrapper.setState({loggedIn: false});
        expect(wrapper.find('Login').length).toEqual(1);
        expect(wrapper.find('AppNavBar').length).toEqual(0);
    });
    it("Should display AppNavBar component once logged in", () => {
        wrapper.setState({loggedIn: true});
        expect(wrapper.find('Login').length).toEqual(0);
        expect(wrapper.find('AppNavBar').length).toEqual(1);
    });
});

describe("Login Validation", () => {
    it("Should validate an employee logging into the application",
        (done) => {
            const spyValidate = jest.spyOn(wrapper.instance(),'validateEmployee');
            mock_fetch_api_text(200, mockEmployee_fetchResponse);
            const validate = wrapper.instance().validateEmployee(mockEmployee);
            expect(spyValidate).toHaveBeenCalled();
            validate.then(() => {
                wrapper.update();
                expect(wrapper.state().loggedIn).toBeTruthy();
                expect(localStorage.getItem('loggedIn')).toEqual('true');
                expect(localStorage.getItem('employee') && wrapper.state().employee).toEqual(
                    JSON.stringify(mockEmployee_fetchResponse[0])
                );
                spyValidate.mockRestore();
                fetch.mockClear();
                done();
            });
        });

    it("Should fail an employee logging into the application",
        (done) => {
            const spyValidate = jest.spyOn(wrapper.instance(),'validateEmployee');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'error');
            mock_fetch_api_text(400, mockEmployee_fetchResponse);
            const validate = wrapper.instance().validateEmployee(mockEmployee);
            expect(spyValidate).toHaveBeenCalled();
            validate.then(() => {
                wrapper.update();
                expect(spyAlert).toHaveBeenCalled();
                spyValidate.mockRestore();
                fetch.mockClear();
                done();
            });
        });

    it("Should remove employee login details from local storage when logging out of application",
        (done) => {
            const spylogOut = jest.spyOn(wrapper.instance(),'handleLogout');
            const logOut = wrapper.instance().handleLogout();
            expect(spylogOut).toHaveBeenCalled();
            logOut.then(() => {
                wrapper.update();
                expect(wrapper.state().loggedIn && wrapper.state().employee).toBeFalsy();
                expect(localStorage.getItem('loggedIn') && localStorage.getItem('employee')).toEqual(null);
                spylogOut.mockRestore();
                fetch.mockClear();
                done();
            });
        });

    it("Should update the state of the App component once local storage has been updated",
        (done) => {
            const mock_map_employee = {key:'employee', newValue: JSON.stringify(mockEmployee_fetchResponse)};
            const mock_map_loggedIn = {key:'loggedIn', newValue: true};
            const spyStorage = jest.spyOn(wrapper.instance(),'storageUpdated');
            const storage_emp = wrapper.instance().storageUpdated(mock_map_employee);
            const storage_log = wrapper.instance().storageUpdated(mock_map_loggedIn);
            expect(spyStorage).toHaveBeenCalled();
            storage_emp.then(() => {
                wrapper.update();
                expect(wrapper.state().employee).toEqual(JSON.stringify(mockEmployee_fetchResponse));
            });
            storage_log.then(() => {
                wrapper.update();
                expect(wrapper.state().loggedIn).toBeTruthy();
                spyStorage.mockRestore();
                fetch.mockClear();
                done();
            });
        });
});