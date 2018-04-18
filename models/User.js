const database = require('../utils/Database');

module.exports.addUser = function(name, phoneNumber, callback){
    try{
     if((name == undefined) || (phoneNumber == undefined)){
     return callback('BADREQUEST', null);
   }
     database.query("SELECT COUNT(*) AS TOTAL_PHONENUMBER FROM User WHERE User_PhoneNumber = '"+phoneNumber+"' ", function(err, totalPhoneNumber){
     if(err) {console.log("Error happens in User.js addUser() COUNT. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
     SamePhoneNumber = JSON.parse(JSON.stringify(totalPhoneNumber))[0].TOTAL_PHONENUMBER;
     if (SamePhoneNumber === 0)
        database.query("INSERT INTO User (User_Name,\
        User_PhoneNumber)\
        VALUES ('"+name+"' ,'"+phoneNumber+"')", function(err, result){
          if(err) {console.log("Error happens in User.js addUser() INSERT. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
          return callback(null, result);
        });
     else{
        return callback("COLLISION", null);
        }
      })
    } catch(e){
        return callback(e, null);
    }
}

module.exports.blockUser = function(phoneNumber, callback){
  try{
    database.query("UPDATE User SET User_BlockedStatus = 1 \
    WHERE User_PhoneNumber = '"+phoneNumber+"'", function(err, result){
      if(err) {console.log("Error happens in User.js blockUser() UPDATE. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
        return callback(null, result);
    });
 } catch(e){
        return callback(e, null);
 }
}

module.exports.deleteUser = function(phoneNumber, callback){
 try{
   database.query("DELETE FROM user WHERE User_PhoneNumber='"+phoneNumber+"'", function(err, result){
      if(err) {console.log("Error happens in User.js deleteUser() DELETE. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
      result = JSON.parse(JSON.stringify(result));
      return callback(null, result);
   });
}
catch(e){
       return callback(e, null);
}
}

module.exports.userAuthentication = function(userid, callback){
  try{
   database.query("SELECT * FROM User WHERE User_UserID= '"+userid+"' ", function(err, userdata){
   if(err) {console.log("Error happens in User.js userAuthentication() QUERY. " + err); return callback(err, null);}    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
   if(userdata.length == 0 || userdata == undefined) return callback('NOTFOUND', null);
  return callback(null, 'FOUND');
 });
  }catch(e){
      return callback(e, null);
}
}

module.exports.queryUser = function(phoneNumber, callback){
  try{
      database.query("SELECT * FROM User WHERE User_PhoneNumber = '"+phoneNumber+"' ", function(err, userdata){
      if(err) {console.log("Error happens in User.js queryUser() SELECT. " + err); return callback(err, null);}
      if(userdata.length === 0 || userdata === undefined) return callback('NOTFOUND', null);   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
      userdata = JSON.parse(JSON.stringify(userdata))[0];
      return callback(null, userdata);
      });
} catch(e){
  return callback(e);
}
}


module.exports.updateUserData = function(id, name, phoneNumber, callback){
  try{
  if((id === undefined || phoneNumber === undefined)){
    return callback('BADREQUEST', null);
  }
  database.query("SELECT COUNT(*) AS TOTAL_PHONENUMBER FROM User WHERE (User_PhoneNumber = '"+phoneNumber+"' AND User_UserID != "+id+") ", function(err, totalPhoneNumber){
  if(err) {console.log("Error happens in User.js updateUserData() SELECT. " + err); return callback(err, null);}
  SamePhoneNumber = JSON.parse(JSON.stringify(totalPhoneNumber))[0].TOTAL_PHONENUMBER;
  if (SamePhoneNumber === 0)
    database.query("UPDATE User SET \
    User_Name = '"+name+"', User_PhoneNumber = '"+phoneNumber+"'\
    WHERE User_UserID = "+id+"", function(err, status){
    if(err) {console.log("Error happens in User.js updateUserData() UPDATE. " + err); return callback(err, null);}
    status= JSON.parse(JSON.stringify(status));
    return callback(null, status);
  });
  else{
    console.log("PLEASE CHANGE THE PHONE NUMBER");
    return callback('COLLISION', null);
  }
  });
}catch(e){
  return callback(e);
}
}

module.exports.updateFCMToken = function(phoneNumber, newToken, callback){
  try{
  if((phoneNumber === undefined || newToken === undefined)){
    return callback('BADREQUEST', null);
  }
    database.query("UPDATE User SET \
    User_FCMToken = '"+newToken+"' WHERE (User_PhoneNumber = '"+phoneNumber+"')", function(err, status){
    if(err) {console.log("Error happens in User.js updateFCMToken() UPDATE. " + err); return callback(err, null);}
    status= JSON.parse(JSON.stringify(status));
    return callback(null, status);
    });

}catch(e){
  return callback(e);
}
};
