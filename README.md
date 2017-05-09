# shampoo
An application for fixing errors/dirty edits in Bethesda Plugin Files.

# building
Shampoo is a NodeJS application using Electron.  Instead [NodeJS](https://nodejs.org/en/), then start a terminal/command prompt in the application directory and run `npm install`.

You can build a release of the application using `npm run release`.  The application structure is based off of [electron-boilerplate](https://github.com/szwacz/electron-boilerplate).  

## build issues
Running the application with `npm start` may not work due to directory/dll issues.  Fall back to `npm run release` if `npm start` doesn't work for you.

# contact
If you're looking for support or want to contribute, join the [Modding Tools discord server](https://discord.gg/GUfRdpT).

You can view project progress and user stories on the [trello board](https://trello.com/b/CPX0FReQ/shampoo-plugin-cleaner).
