
var admin = require("firebase-admin");
var secrets = require("../secrets");
var serviceAccount = secrets.serviceAccount;

admin.initializeApp({
 credential:  admin.credential.cert(serviceAccount),
  databaseURL: "https://hospitalbees.firebaseio.com"
});

var payload = {
	android: {
	ttl: 3600 * 1000,
	priority : 'normal',
	notification: {
    title: "Hospital Bees",
    body: "Please Be on Time!!!",
    sound : "default",
	clickAction: "MYQUEUE"
	}
  },
  topic: 'news'
};

admin.messaging().send(payload)
  .then(function(response) {
    console.log("Successfully sent message:", response);
  })
  .catch(function(error) {
    console.log("Error sending message:", error);
  });
