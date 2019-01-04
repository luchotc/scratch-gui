# scratch-gui
#### Scratch GUI is a set of React components that comprise the interface for creating and running Scratch 3.0 projects

## Mu Stuff

### Easily build the gem

Clone scratch-vm
```bash
git clone git@github.com:luchotc/scratch-vm.git
```

Run build-scratch script located at the root of this repo. 
You'll need to provide the local path for both this repo and scratch-vm.
To do so export SCRATCH_VM_PATH and SCRATCH_GUI_PATH. 
You can also specify the build type by setting the ENV variable. 
You can set it to development or production mode. 
The default one is development

```bash
SCRATCH_VM_PATH=path/to/vm SCRATCH_GUI_PATH=path/to/gui ENV=production ./build-scratch
```

### Gem wrapper

This module can also be deployed a ruby gem. `scratch-gui` works with Ruby 2.3.1

```bash
cd gem
rake wrapper:wrap
bundle install
bundle exec rspec
```

### Tagging and releasing

```bash
./tag.sh
```


## Installation
This requires you to have Git and Node.js installed.
```bash
git clone git@github.com:luchotc/scratch-gui.git
cd scratch-gui
npm install
```

## Getting started
Running the project requires Node.js to be installed.

## Running
Open a Command Prompt or Terminal in the repository and run:
```bash
npm start
```
Then go to [http://localhost:8601/](http://localhost:8601/) - the playground outputs the default GUI component

## Developing alongside other Scratch repositories

### Linking this code to another project's `node_modules/scratch-gui`

#### Configuration

If you wish to develop scratch-gui alongside other scratch repositories that depend on it, you may wish
to have the other repositories use your local scratch-gui build instead of fetching the current production
version of the scratch-gui that is found by default using `npm install`.

To do this:
1. Make sure you have run `npm install` from this (scratch-gui) repository's top level
2. Make sure you have run `npm install` from the top level of each repository (such as scratch-www) that depends on scratch-gui
3. From this (scratch-gui) repository's top level, build the `dist` directory by running `BUILD_MODE=dist npm run build`
4. From this (scratch-gui) repository's top level, establish a link to this repository by running `npm link`
5. From the top level of each repository that depends on scratch-gui, run `npm link scratch-gui`
6. Build or run the repositories that depend on scratch-gui

Instead of `BUILD_MODE=dist npm run build` you can also use `BUILD_MODE=dist npm run watch`, however this may be unreliable.

#### Oh no! It didn't work!
* Follow the recipe above step by step and don't change the order. It is especially important to run npm first because installing after the linking will reset the linking.
* Make sure the repositories are siblings on your machine's file tree.
* If you have multiple Terminal tabs or windows open for the different Scratch repositories, make sure to use the same node version in all of them.
* In the worst case unlink the repositories by running `npm unlink` in both, and start over.

### Running tests

*NOTE: If you're a windows user, please run these scripts in Windows `cmd.exe`  instead of Git Bash/MINGW64.*

Before running any test, make sure you have run `npm install` from this (scratch-gui) repository's top level.

#### Main testing command

To run linter, unit tests, build, and integration tests, all at once:
```bash
npm test
```

#### Running unit tests

To run unit tests in isolation:
```bash
npm run test:unit
```

To run unit tests in watch mode (watches for code changes and continuously runs tests):
```bash
npm run test:unit -- --watch
```

You can run a single file of integration tests (in this example, the `button` tests):

```bash
$(npm bin)/jest --runInBand test/unit/components/button.test.jsx
```

#### Running integration tests

Integration tests use a headless browser to manipulate the actual html and javascript that the repo
produces. You will not see this activity (though you can hear it when sounds are played!).

Note that integration tests require you to first create a build that can be loaded in a browser:

```bash
npm run build
```

Then, you can run all integration tests:

```bash
npm run test:integration
```

Or, you can run a single file of integration tests (in this example, the `backpack` tests):

```bash
$(npm bin)/jest --runInBand test/integration/backpack.test.js
```

If you want to watch the browser as it runs the test, rather than running headless, use:

```bash
USE_HEADLESS=no $(npm bin)/jest --runInBand test/integration/backpack.test.js
```

