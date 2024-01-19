-- Link to hosted version (shows list of all possible endpoints) -

https://nc-news-itve.onrender.com/api/

-- Project Summary

This is a project to demonstrate everything I have learned thus far on the Backend section of the Northcoders Software Development bootcamp. The project features an NC News database that consists of several tables (articles, topics, users, and comments).

Endpoint have been created to access each of the tables for GET, POST, PATCH and DELETE requests, all of which are detailed in the endpoints.json file.

-- Instructions

- To set up environment variables, add 2 .env files -

1. .env.development
2. .env.test

In .env.development, add PGDATABASE=nc_news
In .env.test, add PGDATABASE=nc_news_test

-- devDependencies

- Husky - Used for ensuring all tests pass during git commit. Will abort commit if any tests fail
  Terminal command - npm install --save-dev husky
  Docs - https://www.npmjs.com/package/husky

- Jest - used for testing
  Terminal command - npm install --save-dev jest
  Docs - https://jestjs.io/docs/getting-started

- Jest-Extended - used for more thorough testing
  Terminal command - npm install jest-extended
  Docs - https://www.npmjs.com/package/jest-extended

- Jest-sorted - used for testing order of returned data
  Treminal command - npm install --save-dev jest-sorted
  Docs - https://www.npmjs.com/package/jest-sorted

- PG-format - used for the formatting of data to be inserted into tables during seeding
  Terminal command - npm install pg-format
  Docs - https://www.npmjs.com/package/pg-format?activeTab=readme

- Supertest - Used for the testing of endpoints
  Terminal command - npm install --save-dev supertest
  Docs - https://www.npmjs.com/package/supertest

-- Dependencies

- Dotenv - used for the setting of environment variables
  Terminal command - npm install dotenv
  Docs - https://www.npmjs.com/package/dotenv

  Express - used for the setting up of the server
  Terminal command - npm install express
  Docs - https://expressjs.com/en/5x/api.html

  PG - USed for connection pooling
  Terminal command - npm install pg
  Docs - https://www.npmjs.com/package/pg

- Postgres - used for interaction with the database from the terminal
  Terminal command - npm install postgres
  Docs - https://www.npmjs.com/package/postgres

  -- Seeding

To set up the database, run "psql -f ./db/setup.sql" from your terminal

To seed the local database, run "node ./db/seeds/run-seed.js" from your terminal

-- Testing

To run tests, run "npm test" from your terminal

-- Minimum version requirements

- node - v21.3.0
- postgres - v3.4.3
