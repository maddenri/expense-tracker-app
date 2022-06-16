import React from 'react';
import {shallow} from 'enzyme';
import {EmployeeSection} from '../employeeSection';
import {mock_fetch_api_text, mock_fetch_api_text_alt, mockEmployee} from '../../../tests/mock_fetch_api'
require('../../../config');

let wrapper;

beforeEach(() => {
    global.fetch = jest.fn();
    global.confirm = jest.fn(() => true)
    wrapper = shallow(<EmployeeSection alert={{success: jest.fn(), error: jest.fn()}}/>, { disableLifecycleMethods: true});

});

afterEach(() => {
    wrapper.unmount();
});

describe("EmployeeSection component", () => {
    it("Should render EmployeeSection component", () => {
        expect(wrapper.exists()).toBeTruthy();
    });
});

describe("Visibility of EmployeeSection Children Components", () => {
    it("Should not display EmployeeDisplay component", () => {
        wrapper.setState({searchSuccess: false});
        expect(wrapper.find('EmployeeDisplay').length).toEqual(0);
    });
    it("Should display EmployeeDisplay component but not EmployeeUpdateDelete component", () => {
        wrapper.setState({searchSuccess: true, employee: {username: 'admin'}});
        expect(wrapper.find('EmployeeDisplay').length).toEqual(1);
        expect(wrapper.find('ForwardRef(WithAlert(EmployeeUpdateDelete))').length).toEqual(0);
    });
    it("Should display both EmployeeDisplay and EmployeeUpdateDelete components", () => {
        wrapper.setState({searchSuccess: true, employee: {username: 'nonadmin'}});
        expect(wrapper.find('EmployeeDisplay').length).toEqual(1);
        expect(wrapper.find('ForwardRef(WithAlert(EmployeeUpdateDelete))').length).toEqual(1);
    });
});

describe("Adding an Employee", () => {
    const mockAddEmployee = {
        firstName: 'Scooby',
        surname: 'Doo',
        name: 'Scooby Doo',
        username: 'doos',
        email: 'doos@company.com',
        password: 'MysteryM8chine!',
        retypePassword:'MysteryM8chine!',
        profilePic: '12fbsna-3421-23r.png'
    };
    it("Should provide success alert once employee has been added",
        async (done) => {
            const spyAddEmployee = jest.spyOn(wrapper.instance(),'addEmployee');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'success');
            mock_fetch_api_text(200, mockAddEmployee);
            const addEmployee = wrapper.instance().addEmployee(mockAddEmployee);
            expect(spyAddEmployee).toHaveBeenCalled();
            addEmployee.then(() => {
                expect(spyAlert).toHaveBeenCalled();
                fetch.mockClear();
                done();
            });
        });

    it("Should provide error alert having failed to add employee",
        async (done) => {
            const spyAddEmployee = jest.spyOn(wrapper.instance(),'addEmployee');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'error');
            mock_fetch_api_text(400, mockAddEmployee);
            const addEmployee = wrapper.instance().addEmployee(mockAddEmployee);
            expect(spyAddEmployee).toHaveBeenCalled();
            addEmployee.then(() => {
                expect(spyAlert).toHaveBeenCalled()
                fetch.mockClear();
                done();
            });
        });
});

describe("Searching for an Employee", () => {
    const mockSearch = 'duckd';
    it("Should update state if employee exists",
        async (done) => {
            const spySearchEmployee = jest.spyOn(wrapper.instance(),'searchEmployee');
            expect(wrapper.state().searchSuccess).toBeFalsy();
            mock_fetch_api_text_alt(200, mockSearch);
            const searchEmployee = wrapper.instance().searchEmployee(mockSearch);
            expect(spySearchEmployee).toHaveBeenCalled();
            searchEmployee.then(() => {
                wrapper.update();
                expect(wrapper.state().searchSuccess).toBeTruthy();
                expect(wrapper.state().employee).toEqual(mockEmployee[0]);
                fetch.mockClear();
                done();
            });
        });

    it("Should provide error alert having failed to find employee",
        async (done) => {
            const spySearchEmployee = jest.spyOn(wrapper.instance(),'searchEmployee');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'error');
            mock_fetch_api_text_alt(400, mockSearch);
            const searchEmployee = wrapper.instance().searchEmployee(mockSearch);
            expect(spySearchEmployee).toHaveBeenCalled();
            searchEmployee.then(() => {
                expect(spyAlert).toHaveBeenCalled()
                fetch.mockClear();
                done();
            });
        });
});

describe("Update an Employee Password", () => {
    const mockPassword = 'Onomatopa81!';
    it("Should provide success alert once employee password has been updated",
        async (done) => {
            const spyUpdatePassword = jest.spyOn(wrapper.instance(),'updatePassword');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'success');
            mock_fetch_api_text(200, mockPassword);
            const updatePassword = wrapper.instance().updatePassword(mockPassword);
            expect(spyUpdatePassword).toHaveBeenCalled();
            updatePassword.then(() => {
                expect(spyAlert).toHaveBeenCalled();
                fetch.mockClear();
                done();
            });
        });

    it("Should provide error alert having failed to update employee password",
        async (done) => {
            const spyUpdatePassword = jest.spyOn(wrapper.instance(),'updatePassword');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'error');
            mock_fetch_api_text(400, mockPassword);
            const updatePassword = wrapper.instance().updatePassword(mockPassword);
            expect(spyUpdatePassword).toHaveBeenCalled();
            updatePassword.then(() => {
                expect(spyAlert).toHaveBeenCalled()
                fetch.mockClear();
                done();
            });
        });
});


describe("Deleting an employee", () => {
    it("Should update state and provide success alert once employee has been deleted",
        async (done) => {
            const spyDeleteEmployee = jest.spyOn(wrapper.instance(),'deleteEmployee');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert,'success');
            wrapper.setState({expenses: mockEmployee, searchSuccess: true});
            mock_fetch_api_text_alt(200);
            const deleteEmployee = wrapper.instance().deleteEmployee()
            expect(spyDeleteEmployee).toHaveBeenCalled();
            deleteEmployee.then(() => {
                expect(wrapper.state().employee).toEqual({});
                expect(wrapper.state().searchSuccess).toBeFalsy();
                expect(spyAlert).toHaveBeenCalled();
                fetch.mockClear();
                done();
            });
        });

    it("Should provide error alert having failed to delete employee",
        async (done) => {
            const spyDeleteEmployee = jest.spyOn(wrapper.instance(), 'deleteEmployee');
            const spyAlert = jest.spyOn(wrapper.instance().props.alert, 'error');
            mock_fetch_api_text_alt(400);
            const deleteEmployee = wrapper.instance().deleteEmployee();
            expect(spyDeleteEmployee).toHaveBeenCalled();
            deleteEmployee.then(() => {
                expect(spyAlert).toHaveBeenCalled()
                fetch.mockClear();
                done();
            });
        });
});