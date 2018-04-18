var admin = require("firebase-admin");
var secrets = require("../secrets");
var serviceAccount = secrets.serviceAccount;

admin.initializeApp({
 credential:  admin.credential.cert(serviceAccount),
  databaseURL: "https://hospitalbees.firebaseio.com"
});

// This registration token comes from the client FCM SDKs.
// See documentation on defining a message payload.

// Send a message to the device corresponding to the provided
// registration token.
var sendFCMMessage = function(message) {
	admin.messaging().send(message)
		.then((response) => {
			// Response is a message ID string.
			console.log('Successfully sent message:', response);
		})
		.catch((error) => {
			console.log('Error sending message:', error);
		});
};

module.exports = {sendFCMMessage};

