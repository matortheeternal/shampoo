# shampoo
An application for fixing errors/dirty edits in Bethesda Plugin Files.

# building
Shampoo is a NodeJS application using Electron.  Install [NodeJS](https://nodejs.org/en/download/current/) **32-bit**, then start a terminal/command prompt in the application directory and run `node -v` and `npm -v`.  The output should be v7.10.0 and 4.2.0 or newer.  If you get anything else you probably have multiple installations of node which you'll need to sort out.  If the versions are right, run `npm install`.

You can build a release of the application using `npm run release`.  The application structure is based off of [electron-boilerplate](https://github.com/szwacz/electron-boilerplate).  

## build issues
Running the application with `npm start` may not work due to directory/dll issues.  Fall back to `npm run release` if `npm start` doesn't work for you.

If you run into a bug with `bindings.js`, you may need to use node-gyp to rebuild the `ref` module.

# contact
If you're looking for support or want to contribute, join the [Modding Tools discord server](https://discord.gg/GUfRdpT).

You can view project progress and user stories on the [trello board](https://trello.com/b/CPX0FReQ/shampoo-plugin-cleaner).
