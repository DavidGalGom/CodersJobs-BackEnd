# CodersJobs-API

This project is an API rest of jobs, is done with node.js + express using typescript, eslint, Mongoose as database, Jest for unit test and Cypress for integration tests.

We've added husky and github workflows to help code better.

There is an auth and isAdminAuth method using jsonwebtoken.

We are going to use the library express-validation to validate the body of the routes.

There are 3 databases: 1 for production, 1 for development and the last for testing with cypress.

## The project have the following endpoints:

URL: https://codersjobs.herokuapp.com

User endpoints:

-url/users/register (POST) : Need the body of the user to create.
-url/users/login (POST) : Need the userName and password in the body.
-url/users/ (GET) : Needed to be the admin to see the list of users.
-url/users/:userId (GET) : Need the token of the same user to visualize.
-url/users/:userId (DELETE) : As an Admin you can delete any user.

Job endpoints:

-url/jobs/ (GET) : To see the list of jobs, don't need to be registered.
-url/jobs/ (POST) : You need to be authenticated and the body of the job.
-url/jobs/:idJob (DELETE) : Needed to be authenticated and be the creator of the job.
-url/jobs/:idJob (PUT) : Needed to be authenticated and be the creator of the job, and send the updated job in the body.
-url/jobs/:idJob (GET) : To see the details of the job.

To see the body of the user and job, just check it in the folder database/models.

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
