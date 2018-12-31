# Document

A basic markdown text editor. The goal for version 1 is to build out core functionality needed for a workable text editor. Version 2 will contain more experimental features.

## Setup (Environment)

- Install [node](https://nodejs.org/en/)
- Install [nvm](https://github.com/creationix/nvm)
- Install [yarn](https://yarnpkg.com/en/docs/install)
- Install [flow](https://github.com/facebook/flow)

## Recommended IDE

- Install [atom](https://atom.io/)
- Install [nuclide](https://nuclide.io/docs/quick-start/getting-started/#installation)

*Whichever IDE you use, make sure to setup flow type checking and prettier formatting for JS**

## Setup (Repo)

- Run the command from the root of the repo: `yarn`
- Run `yarn start` to start the server and open it in the server.

## Running Unit Tests

We write our unit tests using [Jest](https://jestjs.io/). 99% of the time, you will only ever need to run one of the following commands:

`yarn test` for running the tests or `yarn test --watch` for running the tests and listening to changes in your JS.
