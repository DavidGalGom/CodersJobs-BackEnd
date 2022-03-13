# CodersJobs-API

This project is an API rest of jobs, is done with node.js + express using typescript, eslint, Mongoose as database, Jest for unit test and Cypress for integration tests.

We've added husky and github workflows to help code better.

There is an auth and isAdminAuth method using jsonwebtoken.

We are going to use the library express-validation to validate the body of the routes.

There are 3 databases: 1 for production, 1 for development and the last for testing with cypress.

## The project have the following endpoints:

Coming soon

## Commands to try out the project

```
npm install // to install all packages used
```

### Run the server

```
npm start // production server
npm run start-dev // production server with nodemon
npm run start-cy // testing server with cypress
```

### Compiles Typescript

```
npx tsc
npx tsc --watch
```

### Run unit tests with jest

```
npm test
npm run test-w // watchAll
npm run test-cov // coverage
```

### Run integration tests with cypress

```
npm run cy
npm run cy-open
```
