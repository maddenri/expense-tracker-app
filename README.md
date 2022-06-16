#  Expense Tracker App

## Overview

This is an expense tracker application that has been designed to allow a company 
to track employee expenses. There are two distinct roles for this application:

* Admin
  * Can create, read, update or delete an employee profile
  * Can update the item status of an expense to: 'Open', 'Accepted', 'Rejected', 'Closed'
* Employee
    * Can create, read, delete or filter an expense

## Setup
This project separates out front and back end code into client/server folders.
1. Open a terminal `cd ./expense-tracker-app/client` and run:
    * `yarn install` to install all packages from `./expense-tracker-app/client/package.json`
    * `yarn start` to start up front-end application on port 3000
    * `yarn test` to run unit tests should you wish
2. Open a separate terminal window `cd ./expense-tracker-app/server` and run:
   * `yarn install` to install all packages from `./expense-tracker-app/server/package.json
   * `yarn start` to start up back-end on port 3001 (if not already started)
   * `yarn test` to run unit tests should you wish
3. Start the MongoDB server by opening another terminal window and running `mongod --config /usr/local/etc/mongod.conf`
4. Restore the expense tracker database dump by running `mongorestore -d expense_tracker ./expense-tracker-app/server/db_dump/expense_tracker`
5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. Express routing requests are handled 
   on [http://localhost:3001](http://localhost:3001) which is configured as a proxy within `~/expense-tracker-app/client/package.json`
6. At the login screen, log into the application as either admin or an employee to view distinct functionality e.g.
   <pre>
   username: admin      password: Power12! 
   username: maddenr    password: Welcome12!
   username: cleesej    password: Towers123!
   username: torresf    password: Liverpool12!
   username: martinl    password: Lizard45@
   username: murphym    password: Smurf45$
   </pre>
7. Have fun exploring the expense tracker application :)


