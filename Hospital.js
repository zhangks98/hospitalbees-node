var database = require('./Database.js');

module.exports.queryHospital = function(hospitalIPAddress, callback){
    try{
    database.query("SELECT * FROM Hospital WHERE Hospital_IPAddress = '"+hospitalIPAddress+"' ", function(err, hospitaldata){
    if(err) {console.log("Error happens in User.js queryHospital() SELECT. " + err); return callback(0, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    hospitaldata = JSON.parse(JSON.stringify(hospitaldata))[0];
    return callback(1, hospitaldata);
      });
    }catch(e){
      console.log(e);
    }
}

module.exports.queryOpenedHospital = function(callback){
    try{
    database.query("SELECT * FROM Hospital WHERE Hospital_OpenClose = 1", function(err, hospitaldata){
    if(err) {console.log("Error happens in User.js queryAllHospital() SELECT. " + err); return callback(0, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    hospitaldata = JSON.parse(JSON.stringify(hospitaldata));
    return callback(1, hospitaldata);
      });
    }catch(e){
      console.log(e);
    }
}

module.exports.addHospitalQueueTail = function(hospitalID, callback){
    try{
    database.query("UPDATE Hospital SET Hospital_QueueTail = Hospital_QueueTail + 1 WHERE Hospital_HospitalID = '"+hospitalID+"' AND Hospital_OpenClose = 1 ", function(err, result){
    if(err) {console.log("Error happens in User.js addHospitalQueueTail() SELECT. " + err); return callback(0);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    return callback(1);
      });
    }catch(e){
      console.log(e);
    }
}

module.exports.queryHospitalQueueTail = function(hospitalID, callback){
  try{
  database.query("SELECT Hospital_QueueTail FROM Hospital WHERE Hospital_HospitalID = '"+hospitalID+"' ", function(err, queueTail){
  if(err) {console.log("Error happens in User.js queryHospitalQueueTail() SELECT. " + err); return callback(0, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  hospitaldata = JSON.parse(JSON.stringify(queueTail))[0];
  return callback(1, queueTail);
    });
  }catch(e){
    console.log(e);
  }
}

module.exports.closeHospital = function(hospitalIPAddress, callback){
    try{
    database.query("UPDATE Hospital SET Hospital_OpenClose = 0, Hospital_QueueTail = 0 WHERE Hospital_IPAddress = '"+hospitalIPAddress+"' ", function(err, result){
    if(err) {console.log("Error happens in User.js closeHospital() SELECT. " + err); return callback(0);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    return callback(1);
      });
    }catch(e){
      console.log(e);
    }
}

module.exports.openHospital = function(hospitalIPAddress, callback){
    try{
    database.query("UPDATE Hospital SET Hospital_OpenClose = 1 WHERE Hospital_IPAddress = '"+hospitalIPAddress+"' ", function(err, result){
    if(err) {console.log("Error happens in User.js closeHospital() SELECT. " + err); return callback(0);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    return callback(1);
      });
    }catch(e){
      console.log(e);
    }
}
