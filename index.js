require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const WebSocketClient = require("websocket").client;
const mic = require("mic");
const request = require("request");

const micInstance = mic({
  rate: "44100",
  channels: "1",
  debug: false,
  exitOnSilence: 6,
});

// Get input stream from the microphone
const micInputStream = micInstance.getAudioStream();
let connection = undefined;

const ws = new WebSocketClient();

ws.on("connectFailed", (err) => {
  console.error("Connection Failed.", err);
});

ws.on("connect", (connection) => {
  // Start the microphone
  micInstance.start();

  connection.on("close", () => {
    console.log("WebSocket closed.");
  });

  connection.on("error", (err) => {
    console.log("WebSocket error.", err);
  });

  connection.on("message", (data) => {
    const { utf8Data } = data;
    console.log(utf8Data); // Print the data for illustration purposes
  });

  console.log("Connection established.");

  connection.send(
    JSON.stringify({
      type: "start_request",
      insightTypes: ["question", "action_item"],
      config: {
        confidenceThreshold: 0.5,
        timezoneOffset: 480, // Your timezone offset from UTC in minutes
        languageCode: "en-US",
        speechRecognition: {
          encoding: "LINEAR16",
          sampleRateHertz: 44100, // Make sure the correct sample rate is provided for best results
        },
        meetingTitle: "Sample Demo Meeting",
      },
      speaker: {
        userId: process.env.USER_EMAIL,
        name: process.env.USER_NAME,
      },
    })
  );

  micInputStream.on("data", (data) => {
    connection.send(data);
  });

  // Schedule the stop of the client after 60 seconds
  setTimeout(() => {
    micInstance.stop();
    // Send stop request
    connection.sendUTF(
      JSON.stringify({
        type: "stop_request",
      })
    );
    connection.close();
  }, 60000);
});

// Generate Auth Token

const options = {
  method: "POST",
  url: "https://api.symbl.ai/oauth2/token:generate",
  headers: {
    "Content-Type": ["application/json", "text/plain"],
  },
  body: JSON.stringify({
    type: "application",
    appId: process.env.APP_ID,
    appSecret: process.env.APP_SECRET,
  }),
};

request(options, function (error, response) {
  if (error) throw new Error(error);

  if (response.body) {
    const { accessToken } = JSON.parse(response.body);
    const realTimeSessionId = "session-1234"; // This should be a Unique ID and must be same for all the participants in single session. Use a good randomizer like UUIDs
    ws.connect(
      `wss://api.symbl.ai/v1/realtime/insights/${realTimeSessionId}`,
      null,
      null,
      {
        "X-API-KEY": accessToken,
      }
    );
  } else {
    throw new Error("Access token not available");
  }
});
