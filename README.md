# shampoo
An application for fixing errors/dirty edits in Bethesda Plugin Files.

# building
Shampoo is a NodeJS application using Electron.  Instead [NodeJS](https://nodejs.org/en/), then start a terminal/command prompt in the application directory and run `npm install`.

You can build a release of the application using `npm run release`.  The application structure is based off of [electron-boilerplate](https://github.com/szwacz/electron-boilerplate).  

## build issues
Note that you will need to copy `XEditLib.dll` to the output `dist/win-ia32-unpacked` folder for the application to run (I don't have the build script configured to do this automatically yet).

Running the application with `npm start` may require you to copy `XEditLib.dll` to the electron dist folder at `node_modules\electron\dist`.  Also note: the Hardcoded dat files for the game modes you want to start the application in must also be alongside the DLL to be utilized.

# contact
If you're looking for support or want to contribute, join the [Modding Tools discord server](https://discord.gg/GUfRdpT).

You can view project progress and user stories on the [trello board](https://trello.com/b/CPX0FReQ/shampoo-plugin-cleaner).
