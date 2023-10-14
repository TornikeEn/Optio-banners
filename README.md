# OptioBanners

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.6.

## Description

This project demonstrates how to perform CRUD (Create, Read, Update, Delete) operations in a simple web application. CRUD operations are fundamental to managing data in various applications, and this project serves as a practical example.

- Create: Add new data entries to the server.
- Read: Retrieve data entries from the server.
- Update: Modify existing data entries.
- Delete: Remove data entries from the server.

## Technologies Used

HTML, CSS, Typescript, Angular, Angular Material for the front-end.

#Getting Started

- To get a local copy of this project up and running, follow these steps:
 - git clone https://github.com/TornikeEn/Optio-banners.git
- Change into the project directory:
 - cd optio-banners
- Install packages:
 - npm install

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

## API Endpoints

Banner Create: POST request to /api/v2/banners/save
Banner Read: GET request to /api/v2/banners/find
Banner Update: PUT request to /api/v2/banners/save
Banner Delete: DELETE request to /api/v2/banners/remove

## Acces Token

JSON Web Token is already setted. If the project will be crashed because of expired token, you should assign a new token value to the variable `userToken`  in `jwt-interceptor.ts` file. File path: `src/app/shared/interceptors/jwt-interceptor.ts`