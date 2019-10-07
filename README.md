# project-manager-be (aka project manager back end)

## How to run

This project requires `Node >= 10.16`

`yarn` was used but everything should work with `npm` if you are a windows user.

-   First install dependencies: `yarn install` or `npm install`

-   Copy `sample.env` file and name it `.env`

-   Then to start: `yarn start` or `npm run start`

-   To fill database with test data: `yarn seed:db` or `npm run seed:db` **!!Important:** Always run `yarn start` before seeding to generate a db file to seed

## Database

SQLite was used, database by default is `./project_manager_db.db` file. To change it go to `./config/config.js`

## Rest API

https://jsonapi.org specification was an apptemt

## Project structure

```
     User
      ↓ ↑
     Route
      ↓ ↑
  Controller
      ↓ ↑
    Service
      ↓ ↑
     Model
```

## Notes for the teacher in Lithuanian

Į testus nekrepkit dėmėsio jie strukturizuoti nesamoningai ir coverina gal tik 1/3 use casu
