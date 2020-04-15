const WebSocketClient = require("websocket").client;

const mic = require("mic");

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
        confidenceThreshold: 0.8,
        timezoneOffset: 480, // Your timezone offset from UTC in minutes
        languageCode: "en-US",
        speechRecognition: {
          encoding: "LINEAR16",
          sampleRateHertz: 44100, // Make sure the correct sample rate is provided for best results
        },
        meetingTitle: "Client Meeting",
      },
      speaker: {
        userId: "your_email_id",
        name: "your_name",
      },
    })
  );

  micInputStream.on("data", (data) => {
    connection.send(data);
  });

  // Schedule the stop of the client after 10 seconds
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

ws.connect("wss://api.symbl.ai/v1/realtime/insights/1", null, null, {
  "X-API-KEY": "<your_auth_token>",
});
