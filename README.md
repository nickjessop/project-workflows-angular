# Stepflow

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 8.1.0.

Install npm version 6.10.2 and node 12.9.1.

## Development server

For Angular CLI
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

For NX CLI
Run `nx serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

For running NX CLI without it install globally
Run `npm run nx serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Deployment to Firebase from Local machine

To build the full Stepflow app, with the new authenication page do the following:

1. Using terminal from the root of the project, use `npm run build-stepflow-prod`
2. Once built, use `firebase deploy --only hosting:stepflow-app` to deploy the locally compiled stepflow app to firebase
