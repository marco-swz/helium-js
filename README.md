The Helium UI library provides a collection of Javascript UI components.
The components are based on the Webcomponents technology found in modern browsers.

# Repository Structure

The project root contains various config and build files:
- `shell.nix` - Defines the shell environment for Nix based development
- `packages.json` - Contains the `npm` project definition with its dependencies and tasks
- `packages.lock.json` - Contains unique identifiers for all `npm` project dependencies
- `rollup.config.mjs` - The config file of Rollup bundler
- `playwright.config.js` - The config file of the Playwright testing framework
- `jsdoc.config.js` - The config for the JSDoc documentation generator

All source files can be found in the `src` directory. 
Each components consists of a Javascript and CSS file.

The bundled javascript files meant for distribution are loacated in the `dist` and `dist-min` directory.
`dist-min` contains the minified files for production usage, while `dist` contains the same files unminifed for development/testing.
Both directories contain further subdirectories of the different library versions.
New code is always bundled into `latest`.
This allows users to choose an older, more stable versions for specific applications.  
The bundled files are Javascript files only, with the CSS packages inside.
Each file contains a single component, but may reference other components as import.
In the `dist` directory, for each component, two files are generated, one including a content-based hash and one without.
The version with hash is used to avoid caching issues, while the one without hash simplifies local development and testing.

The `tests` directory contains the test cases for the Playwright test framework.
The tests for each components are stored in their own subdirectory.

# Development Environment

Requirements:
- Git
- NodeJS (`npm`)

## Setup

Clone this repository:
```sh
git clone https://git.digitalweb.at/vawa1/helium-js.git
```

In the project root, run the following command to install the NodeJS development dependencies:

```sh
npm install
```

Then, download the browser engines for the Playwright testing framework:

```sh
npx playwright install
```

After that, the installation processs is done.

## Usage

To run a local webserver for development, use:
```sh
npm run
```

Then connect to the webserver with your browser under the URL
```
http://localhost:8080/<path to index.html>
```

To run all test cases, use:
```sh
npx playwright test
```

Playwright also provides a graphical interface to work with tests:
```sh
npx playwright test --ui
```




