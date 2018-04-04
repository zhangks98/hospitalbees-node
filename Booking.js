var database = require('./Database.js');

module.exports.addBooking = function(tid ,time, queueStatus, bookingStatus, queueNumber, refQueueNumber, userID,
  hospitalID, callback){
  try{
  database.query("SELECT COUNT(*) AS PENDING_COUNT FROM Booking WHERE Booking_BookingStatus = 'PENDING' AND User_UserID = "+userID+"", function(err, pending){
    if(err) {console.log("Error happens in Booking.js addBooking() COUNT. " + err); return callback(0, null);}
    pending = JSON.parse(JSON.stringify(pending))[0].PENDING_COUNT;
    if (pending == 0)
        database.query("INSERT INTO Booking (Booking_TID, Booking_Time, Booking_QueueStatus,\
        Booking_BookingStatus, Booking_QueueNumber, Booking_ReferencedQueueNumber, User_UserID, Hospital_HospitalID)\
        VALUES ('"+tid+"', '"+time+"' , '"+queueStatus+"', '"+bookingStatus+"', '"+queueNumber+"', '"+refQueueNumber+"',"+userID+", "+hospitalID+")", function(err, result){
        if(err){console.log("Error happens in Booking.js addBooking() INSERT. " + err); return callback(0, null);}
        return callback(1, tid);});
     else{
        console.log("ERROR! There are still unfinished BOOKING!");
        return callback(0, null);
      }
      })
    }catch(e){
      console.log(e);
    }
};

module.exports.queryPendingBooking = function(userid, callback){
  try{
  database.query("SELECT * FROM Booking WHERE User_UserID = '"+userid+"' AND Booking_BookingStatus = 'PENDING'", function(err, bookingdata){
  if(err) {console.log("Error happens in Booking.js queryPendingBooking() SELECT. " + err); return callback(0, null);}
  else{
  bookingdata = JSON.parse(JSON.stringify(bookingdata))[0];
  return callback(1,bookingdata);
      }});
    }catch(e){
      console.log(e);
    }
}

module.exports.updateQueueStatusToActive = function(tid, callback){ //The function only can run if the booking is not completed yet
  try{
  database.query("UPDATE booking SET Booking_QueueStatus = 'ACTIVE' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateQueueStatusToActive() UPDATE. " + err); return callback(0);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  return callback(1);
  });
}catch(e){
  console.log(e);
}
};

module.exports.updateQueueStatusToReactivated = function(tid, callback){ //The function only can run if the booking is not completed yet
  try{
  database.query("UPDATE booking SET Booking_QueueStatus = 'REACTIVATED' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateQueueStatusToActive() UPDATE. " + err); return callback(0);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  return callback(1);
  });
}catch(e){
  console.log(e);
}
};

module.exports.updateQueueStatusToMissed = function(tid, callback){
  try{
  database.query("UPDATE booking SET Booking_QueueStatus = 'MISSED' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateQueueStatusToMissed() UPDATE. " + err); return callback(0);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  return callback(1);
  });
}catch(e){
  console.log(e);
}
};

module.exports.updateBookingStatusToCompleted = function(tid, callback){
  try{
  database.query("UPDATE booking SET Booking_BookingStatus = 'COMPLETED', Booking_QueueStatus = 'FINISHED' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateBookingStatusToCompleted() UPDATE. " + err); return callback(0);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  return callback(1);    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  });
}catch(e){
  console.log(e);
}
};

module.exports.updateAllBookingStatusesToAbsent = function(hospitalID, callback){
  try{
  database.query("UPDATE booking SET Booking_BookingStatus = 'ABSENT', Booking_QueueStatus = 'FINISHED' WHERE Hospital_HospitalID = "+hospitalID+" AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateBookingStatusToAbsent() UPDATE. " + err); return callback(0);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  return callback(1);    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  });
}catch(e){
  console.log(e);
}
};

module.exports.updateBookingStatusToCancelled = function(tid, callback){
  try{
  database.query("UPDATE booking SET Booking_BookingStatus = 'CANCELLED', Booking_QueueStatus = 'FINISHED' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateBookingStatusToCancelled() UPDATE. " + err); return callback(0);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  return callback(1);    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  });
}catch(e){
  console.log(e);
}
};

module.exports.queryAllBooking = function(userid, callback){
  try{
  database.query("SELECT COUNT(*) AS TOTAL FROM Booking WHERE User_UserID = '"+userid+"'", function(err, total){
    if(err) {console.log("Error happens in Booking.js queryAllBooking() COUNT. " + err); return callback(0, null, null);}
    total = JSON.parse(JSON.stringify(total))[0].TOTAL;
  database.query("SELECT * FROM Booking WHERE User_UserID = '"+userid+"'", function(err, bookingdata){
  if(err) {console.log("Error happens in Booking.js queryPendingBooking() SELECT. " + err); return callback(0, null, null);}
  else{
  bookingdata = (JSON.parse(JSON.stringify(bookingdata)));
  callback(1, total, bookingdata);
      };
    });
  });
    }catch(e){
      console.log(e);
    }
}
//function updateBookingStatus(){};
