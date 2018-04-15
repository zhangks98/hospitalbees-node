
var admin = require("firebase-admin");
var secrets = require("../secrets");
var serviceAccount = secrets.serviceAccount;

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://fir-testings-e032e.firebaseio.com"
});

var payload = {
	android: {
	ttl: 3600 * 1000,
	priority : 'normal',
	notification: {
    title: "NASDAQ News",
    body: "The NASDAQ climbs for the second day. Closes up 0.60%.",
    sound : "default",
	clickAction: "PlayActivity"	
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
