export const mockExpenseDB = [{
    _id: '0',
    purchasedOn: "2021-11-08",
    name: "Jane Murphy",
    username: "murphyj",
    itemName: "Eggs",
    itemType: "Food",
    itemCost: "€3.10",
    itemStatus: "Open",
    }, {
    _id: '1',
    purchasedOn: "2021-11-04",
    name: "Jane Murphy",
    username: "murphyj",
    itemName: "Gin",
    itemType: "Alcohol",
    itemCost: "€12.00",
    itemStatus: "Open",
    }, {
    _id: '2',
    purchasedOn: "2021-11-14",
    name: "Peter Higgins",
    username: "higginsp",
    itemName: "Bread",
    itemType: "Food",
    itemCost: "€2.20",
    itemStatus: "Open",
}]

export const mockEmployee = [{
    name: 'Donald Duck',
    username: 'duckd',
    email: 'duckd@company.com',
    password: 'DaffyD88*',
    profilePic: '1223b3RsnEWEa-323R421-5ff.png'
}];

export const mock_fetch_api_text = (status, expense) => fetch.mockImplementation(() => {
    return Promise.resolve({
        status: status,
        text: () => {
            return Promise.resolve(
                JSON.stringify(expense)
            );
        }
    });
});

export const mock_fetch_api_text_alt = (status) => fetch.mockImplementation(() => {
    return Promise.resolve({
        status: status,
        text: () => {
            return Promise.resolve(
                JSON.stringify(mockEmployee)
            );
        }
    });
});

export const mock_fetch_api_json = (status) => fetch.mockImplementation(() => {
    return Promise.resolve({
        status: status,
        json: () => {
            return Promise.resolve(
                mockExpenseDB
            );
        }
    });
});




