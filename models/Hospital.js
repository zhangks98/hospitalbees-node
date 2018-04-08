const database = require('../utils/Database');

module.exports.queryHospital = function(hospitalIPAddress, callback){
    try{
    database.query("SELECT * FROM Hospital WHERE Hospital_IPAddress = '"+hospitalIPAddress+"' ", function(err, hospitaldata){
    if(err) {console.log("Error happens in User.js queryHospital() SELECT. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    if(hospitaldata.length == 0 || hospitaldata ==undefined) return callback('NOTFOUND', null);
    hospitaldata = JSON.parse(JSON.stringify(hospitaldata))[0];
    return callback(null, hospitaldata);
      });
    } catch(e){
    return callback(e, null);
    }
}

module.exports.queryOpenedHospital = function(callback){
    try{
    database.query("SELECT * FROM Hospital WHERE Hospital_OpenClose = 1", function(err, hospitaldata){
    if(err) {console.log("Error happens in User.js queryAllHospital() SELECT. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    if(hospitaldata.length == 0 || hospitaldata ==undefined) return callback('NOTFOUND', null);
    hospitaldata = JSON.parse(JSON.stringify(hospitaldata));
    return callback(null, hospitaldata);
      });
    }catch(e){
      return callback(e, null);
    }
}

module.exports.addHospitalQueueTail = function(hospitalID, callback){
    try{
    database.query("UPDATE Hospital SET Hospital_QueueTail = Hospital_QueueTail + 1 WHERE Hospital_HospitalID = '"+hospitalID+"' AND Hospital_OpenClose = 1 ", function(err, result){
    if(err) {console.log("Error happens in User.js addHospitalQueueTail() SELECT. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    result = JSON.parse(JSON.stringify(result));
    return callback(null, result);
      });
    }catch(e){
      return callback(e, null);
    }
}

module.exports.queryHospitalQueueTail = function(hospitalID, callback){
  try{
  database.query("SELECT Hospital_QueueTail FROM Hospital WHERE Hospital_HospitalID = '"+hospitalID+"' ", function(err, queueTail){
  if(err) {console.log("Error happens in User.js queryHospitalQueueTail() SELECT. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  if(queueTail.length == 0 || queueTail ==undefined) return callback('NOTFOUND', null);
  queueTail = JSON.parse(JSON.stringify(queueTail))[0];
  return callback(null, queueTail);
    });
  }catch(e){
    return callback(e, null);
  }
}

module.exports.closeHospital = function(hospitalID, callback){
    try{
    database.query("UPDATE Hospital SET Hospital_OpenClose = 0, Hospital_QueueTail = 0 WHERE Hospital_HospitalID = "+hospitalID+" ", function(err, result){
    if(err) {console.log("Error happens in User.js closeHospital() SELECT. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    result = JSON.parse(JSON.stringify(result));
    return callback(null, result);
      });
    }catch(e){
      return callback(e, null);
    }
}

module.exports.openHospital = function(hospitalID, callback){
    try{
    database.query("UPDATE Hospital SET Hospital_OpenClose = 1 WHERE Hospital_HospitalID = "+hospitalID+" ", function(err, result){
    if(err) {console.log("Error happens in User.js closeHospital() SELECT. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    result = JSON.parse(JSON.stringify(result));
    return callback(null, result);
      });
    }catch(e){
      return callback(e, null);
    }
}
