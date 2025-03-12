# NC News

Hosted version: <!-- add a link to the hosted version -->

### Summary

This API minics the backend service of a news website which will provide information to the Front End architecture. 

### Setup Instructions

Clone the repo to have a local copy:

In the terminal write `git clone https://github.com/12hunti/nc-news-be.git`


Install the following dependencies in order to run the code locally (npm install):

- Dev dependencies: husky, jest, jest-sorted, supertest
- General dependencies: dotenv, express, pg, pg-format

To seed the local database, run the following scripts:

- npm-run set-ups-dbs 
- npm-run test-seed
- npm-run seed-dev

These will create the test and development databases, seed the test database and seed the developmemt databse respectively.

To run tests:

- npm run test (all tests)
- npm run test-utils (only utils tests)
- npm run test-seed (only seed tests)
- npm run \<file name>  (only the tests from the file)


<!-- Clear instructions of how to clone, install dependencies, seed local database, and run tests-->

### .env Files

The .env files are not usually included in the README file in order to allow access to the code, and to connect to the databases, please create two files locally titled:

 - .env.development
- .env.test

Inside .env.development, set `PGDATABASE=nc_news` (to connect to the development database when executing the code in the development environment)

Inside .env.test, set `PGDATABASE=nc_news_test` (to connect to the test database when executing the code in the testing environment)

### Minimum Requirements

node v23.6.0

Postgres v17


