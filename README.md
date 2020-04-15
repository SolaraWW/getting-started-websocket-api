# Getting Started with Websocket API

This is a sample implementation of Symbl's Websocket API. You can use this sample code to generate intelligent insights in realtime and integrate real-time capabilities within your applications.

## Authentication

In order to use the SDK, you need a valid `appId` and `appSecret` which you can get by logging into [Symbl Platform](https://platform.symbl.ai)

## npm

Before running the code, install all the dependencies by running `npm install`. 
For this sample code, you'll also need to install [SOX](https://at.projects.genivi.org/wiki/display/PROJ/Installation+of+SoX+on+different+Platforms) - SoX is a cross-platform (Windows, Linux, MacOS X, etc.) command line utility that can convert various formats of computer audio files in to other formats.

## Run

Make sure to configure the `userId`,`name` and `auth_token` parameters before running the code.

Once you've configured the above, run `node index.js`

## Test

If you've configured everything correctly including `sox`, you should be able to speak into your microphone and see the transcription as well any generated insights logging in your console.

## References
Feel free to fork any of the projects here to use on your own and if you have any code improvements, make a pull request and the request will be reviewed by one of our admins.

For a sample reference implentation using Symbl, take a look at our [Platform](https://platform.symbl.ai).

If you have questions, bugs to report or feature suggestions, join our [Dev Community](https://community.symbl.ai).
