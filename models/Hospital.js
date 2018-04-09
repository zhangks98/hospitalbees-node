const database = require('../utils/Database');

module.exports.incQueueNumberGenerator = function(hospitalID, callback){
    try{
    database.query("UPDATE Hospital SET Hospital_QueueTail = Hospital_QueueTail + 1 WHERE Hospital_HospitalID = '"+hospitalID+"' AND Hospital_OpenClose = 1 ", function(err, result){
    if(err) {console.log("Error happens in User.js incQueueNumberGenerator() SELECT. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    result = JSON.parse(JSON.stringify(result));
    return callback(null, result);
      });
    }catch(e){
      return callback(e, null);
    }
};

module.exports.generateQueueNumber = function(hospitalID, callback){
  try{
  database.query("SELECT Hospital_QueueTail FROM Hospital WHERE Hospital_HospitalID = '"+hospitalID+"' ", function(err, queueTail){
  if(err) {console.log("Error happens in User.js generateQueueNumber() SELECT. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  if(queueTail.length == 0 || queueTail ==undefined) return callback('NOTFOUND', null);
  queueTail = JSON.parse(JSON.stringify(queueTail))[0];
  return callback(null, queueTail);
    });
  }catch(e){
    return callback(e, null);
  }
};
