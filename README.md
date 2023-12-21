# signonMobile
This component is the signOn Mobile Application for [SignON Project](sign.on.website) an EU H2020
research and innovation funded project.
The Application provides the code to run the application on both android and ios platforms
## Getting Started
### Prerequisites
Download Required Tools
Download and install these right away to ensure an optimal Ionic development experience:

Node.js for interacting with the Ionic ecosystem. Download the LTS version.
A code editor for... writing code! We are fans of Visual Studio Code.
Command-line interface/terminal (CLI):
Windows users: for the best Ionic experience, we recommend the built-in command line (cmd) or the Powershell CLI, running in Administrator mode.
Mac/Linux users, virtually any terminal will work.
Install Ionic Tooling
Run the following in the command line terminal to install the Ionic CLI (ionic), native-run, used to run native binaries on devices and simulators/emulators, and cordova-res, used to generate native app icons and splash screens:

Note
To open a terminal in Visual Studio Code, go to Terminal -> New Terminal.

npm install -g @ionic/cli native-run cordova-res

Note
The -g option means install globally. When packages are installed globally, EACCES permission errors can occur.

Note
In order to run the application on ios the user will need an Apple mac with XCode installed
### Installation
Clone this repository and run npm build to download third party components
### Usage
The user will need to synchroise the application with the third party libraries
ionic cap sync ios for Apple users 
ionic cap sync android for Android users
## Additional information
### Compatibility Matrix
### Documentation
https://docs.google.com/document/d/1-8WXPhiM0B7yxGwBIVootllQjqZRkMzH
### Branches description
There is no branches available working off master branch
### Known issues
No known issues
