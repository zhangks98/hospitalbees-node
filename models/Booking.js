const database = require('../utils/Database');

module.exports.addBooking = function(time, eta, queueStatus, bookingStatus, queueNumber, refQueueNumber, userPhoneNumber,
  hospitalID, callback) {
	try {
		if ((userPhoneNumber === undefined) || (eta === undefined) || (hospitalID === undefined) || queueNumber === undefined) {
			return callback('BADREQUEST', null);
		}
		var tid = padding(hospitalID) + time + padding(queueNumber);
		database.query("INSERT INTO Booking (Booking_TID, Booking_ETA, Booking_QueueStatus,\
        Booking_BookingStatus, Booking_QueueNumber, Booking_ReferencedQueueNumber, User_PhoneNumber, Hospital_HospitalID)\
        VALUES ('" + tid + "', '" + eta + "' , '" + queueStatus + "', '" + bookingStatus + "', '" + padding(queueNumber) + "', '" + refQueueNumber + "'," + userPhoneNumber + ", " + hospitalID + ")", function (errinsert, result) {
			if (errinsert) {
				console.log("Error happens in Booking.js addBooking() INSERT. " + errinsert);
				return callback(errinsert, null);
			}
			// result = JSON.parse(JSON.stringify(result));
			return callback(null, tid);
		});
	} catch (errsync) {
		return callback(errsync);
	}
};

module.exports.checkDuplicatePendingBooking  = (userPhoneNumber,callback) => {
	try {
		database.query("SELECT COUNT(*) AS PENDING_COUNT FROM Booking WHERE Booking_BookingStatus = 'PENDING' AND User_PhoneNumber = " + userPhoneNumber + "", function (errcount, pending) {
			if (errcount) {
				console.error("Error happens in Booking.js addBooking() COUNT" + errcount);
				return callback(errcount);
			}
			if (pending.length === 0 || pending === undefined) return callback('NOTFOUND');
			pending = JSON.parse(JSON.stringify(pending))[0].PENDING_COUNT;
			if (pending === 0) {
				callback(undefined, false);
			} else {
				callback(undefined, true);
			}
		});
	} catch (e) {
	  return callback(e)
    }
};

module.exports.queryBooking = function(tid, callback){
  try{
  database.query("SELECT * FROM Booking WHERE Booking_TID = '"+tid+"'", function(err, bookingdata){
  if(err) {console.log("Error happens in Booking.js queryBooking() SELECT. " + err); return callback(err, null);}
  else{
  bookingdata = JSON.parse(JSON.stringify(bookingdata))[0];
    return callback(undefined,bookingdata);
      }});
    }catch(e){
      return callback(e, null);
    }
};

module.exports.updateQueueStatusToActive = function(tid, callback){ //The function only can run if the booking is not completed yet
  try{
  database.query("UPDATE booking SET Booking_QueueStatus = 'ACTIVE' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateQueueStatusToActive() UPDATE. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  result = JSON.parse(JSON.stringify(result));
  return callback(null, result);
  });
}catch(e){
  return callback(e, null);
}
};

module.exports.updateQueueStatusToReactivated = function(tid, callback){ //The function only can run if the booking is not completed yet
  try{
    database.query("UPDATE booking SET Booking_QueueStatus = 'REACTIVATED' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
      if(err) {console.log("Error happens in Booking.js updateQueueStatusToActive() UPDATE. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
      result = JSON.parse(JSON.stringify(result));
        return callback(null, result);
  });
    }catch(e){
        return callback(e, null);
}
};

module.exports.updateQueueStatusToMissed = function(tid, callback){
  try{
  database.query("UPDATE booking SET Booking_QueueStatus = 'MISSED' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateQueueStatusToMissed() UPDATE. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
      result = JSON.parse(JSON.stringify(result));
      return callback(null, result);
    });
    }catch(e){
        return callback(e, null);
      }
  };

module.exports.updateBookingStatusToCompleted = function(tid, callback){
  try{
    database.query("UPDATE booking SET Booking_BookingStatus = 'COMPLETED', Booking_QueueStatus = 'FINISHED' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
      if(err) {console.log("Error happens in Booking.js updateBookingStatusToCompleted() UPDATE. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
        result = JSON.parse(JSON.stringify(result));
        return callback(null, result);    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
      });
  } catch(e){
      return callback(e, null);
    }
};

module.exports.updateBookingStatusToAbsent = function(tid, callback){
  try{
  database.query("UPDATE booking SET Booking_BookingStatus = 'ABSENT', Booking_QueueStatus = 'FINISHED' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateBookingStatusToAbsent() UPDATE. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  result = JSON.parse(JSON.stringify(result));
  return callback(null, result);    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  });
}catch(e){
  return callback(e, null);
}
};

module.exports.updateAllBookingStatusesToAbsent = function(hospitalID, callback){
  try{
  database.query("UPDATE booking SET Booking_BookingStatus = 'ABSENT', Booking_QueueStatus = 'FINISHED' WHERE Hospital_HospitalID = "+hospitalID+" AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateBookingStatusToAbsent() UPDATE. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  result = JSON.parse(JSON.stringify(result));
  return callback(null, result);    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  });
}catch(e){
  return callback(e, null);
}
};

module.exports.updateBookingStatusToCancelled = function(tid, callback){
  try{
  database.query("UPDATE booking SET Booking_BookingStatus = 'CANCELLED', Booking_QueueStatus = 'FINISHED' WHERE Booking_TID = '"+tid+"' AND Booking_BookingStatus = 'PENDING'", function(err, result){
  if(err) {console.log("Error happens in Booking.js updateBookingStatusToCancelled() UPDATE. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  result = JSON.parse(JSON.stringify(result));
  return callback(null, result);    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
  });
}catch(e){
  return callback(e, null);
}
};

module.exports.queryAllBooking = function(userPhoneNumber, callback){
  try{
  database.query("SELECT COUNT(*) AS TOTAL FROM Booking WHERE User_PhoneNumber = '"+userPhoneNumber+"'", function(err, total){
    if(err){console.log("Error happens in Booking.js queryAllBooking() COUNT. " + err); return callback(err, null, null);}
    total = JSON.parse(JSON.stringify(total))[0].TOTAL;
  database.query("SELECT * FROM Booking WHERE User_PhoneNumber = '"+userPhoneNumber+"'", function(err, bookingdata){
  if(err) {console.log("Error happens in Booking.js queryBooking() SELECT. " + err); return callback(err, null, null);}
  else{
  if(bookingdata.length === 0 || bookingdata === undefined) return callback('NOTFOUND', null);
  bookingdata = (JSON.parse(JSON.stringify(bookingdata)));
  callback(err, total, bookingdata);
      };
    });
  });
  }catch(e){
  return callback(e, null, null);
    }
};
//function updateBookingStatus(){};
function padding(n){
    if(n>999){
      return "" + n;
    }
    else if(n>99){
      return "0" + n;
    }
    else if(n>9){
        return "00" + n;
    }
    else
        return "000" + n;
}
