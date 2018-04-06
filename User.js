var database = require('./Database.js');

module.exports.addUser = function(nric, name, password, phoneNumber, callback){
    try{
     if((nric == undefined) || (name == undefined) || (password == undefined) || (phoneNumber == undefined)){
     return callback('BADREQUEST', null);
   }
     database.query("SELECT COUNT(*) AS TOTAL_NRIC FROM User WHERE User_NRIC = '"+nric+"' ", function(err, totalnric){
     if(err) {console.log("Error happens in User.js addUser() COUNT. " + err); return callback(err, null);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
     SameNRIC = JSON.parse(JSON.stringify(totalnric))[0].TOTAL_NRIC;
     if (SameNRIC == 0)
        database.query("INSERT INTO User (User_NRIC, User_Name,\
        User_Password, User_PhoneNumber)\
        VALUES ('"+nric+"', '"+name+"' , '"+password+"', '"+phoneNumber+"')", function(err, result){
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

module.exports.blockUser = function(nric, callback){
  try{
    database.query("UPDATE User SET User_BlockedStatus = 1 \
    WHERE User_NRIC = '"+nric+"'", function(err, result){
      if(err) {console.log("Error happens in User.js blockUser() UPDATE. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
        return callback(null, result);
    });
 } catch(e){
        return callback(e, null);
 }
}

module.exports.deleteUser = function(phoneNumber, password, callback){
 try{
 module.exports.passwordAuthentication(phoneNumber, password, function(errauth, result){
   if(errauth) {console.log("Password Authentication Fails!"); return callback(errauth, null);}    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
   if(result == 'SUCCESS')
   database.query("DELETE FROM user WHERE User_PhoneNumber='"+phoneNumber+"'", function(err, result){
      if(err) {console.log("Error happens in User.js deleteUser() DELETE. " + err); return callback(err, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
      result = JSON.parse(JSON.stringify(result));
      return callback(null, result);
   });
   else if (result == 'FAILED'){
      console.log("Wrong Password!");
      return callback('AUTHENTICATION', null);
    }
   else{
     console.log("Your account is blocked");
     return callback('BLOCKED', null);
   }
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

module.exports.passwordAuthentication = function(phoneNumber, password, callback){
  try{
   database.query("SELECT * FROM User WHERE User_PhoneNumber = '"+phoneNumber+"' ", function(err, userdata){
   if(err) {console.log("Error happens in User.js addUser() INSERT. " + err); return callback(err, null);}    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
   if(userdata.length == 0 || userdata == undefined) return callback('NOTFOUND', null);
   if(JSON.parse(JSON.stringify(userdata))[0].User_BlockedStatus == 1)
       return callback(null, 'BLOCKED');
   else if(password == JSON.parse(JSON.stringify(userdata))[0].User_Password)
       return callback(null, 'SUCCESS');
   else
       return callback(null, 'FAILED');
 });
  }catch(e){
      return callback(e, null);
}
}

module.exports.queryUser = function(phoneNumber, password, callback){
  try{
  module.exports.passwordAuthentication(phoneNumber, password, function(errauth, result){
    if(errauth) {console.log("Password Authentication Fails!"); return callback(errauth, null);}    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    if(result == 'SUCCESS')
        database.query("SELECT * FROM User WHERE User_PhoneNumber = '"+phoneNumber+"' ", function(err, userdata){
        if(err) {console.log("Error happens in User.js queryUser() SELECT. " + err); return callback(err, null);}
        if(userdata.length == 0 || userdata == undefined) return callback('NOTFOUND', null);   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
        userdata = JSON.parse(JSON.stringify(userdata))[0];
        return callback(null, userdata);
        console.log("success!");
      });
    else if (result == 'FAILED'){
       console.log("Wrong Password!");
       return callback('AUTHENTICATION', null);
     }
    else{
      console.log("Your account is blocked");
      return callback('BLOCKED', null);
    }
  });
} catch(e){
  return callback(e);
}
}


module.exports.updateUserData = function(id, nric, name, phoneNumber, callback){
  try{
  if((id == undefined || phoneNumber == undefined)){
    return callback('BADREQUEST', null);
  }
  database.query("SELECT COUNT(*) AS TOTAL_NRIC FROM User WHERE (User_NRIC = '"+nric+"' AND User_UserID != "+id+") ", function(err, totalnric){
  if(err) {console.log("Error happens in User.js updateUserData() SELECT. " + err); return callback(err, null);}
  SameNRIC = JSON.parse(JSON.stringify(totalnric))[0].TOTAL_NRIC;
  if (SameNRIC == 0)
    database.query("UPDATE User SET User_NRIC = '"+nric+"', \
    User_Name = '"+name+"', User_PhoneNumber = '"+phoneNumber+"'\
    WHERE User_UserID = "+id+"", function(err, status){
    if(err) {console.log("Error happens in User.js updateUserData() UPDATE. " + err); return callback(err, null);}
    status= JSON.parse(JSON.stringify(status));
    return callback(null, status);
  });
  else{
    console.log("PLEASE CHANGE THE NRIC");
    return callback('COLLISION', null);
  }
  });
}catch(e){
  return callback(e);
}
}

module.exports.updateUserPassword = function(phoneNumber, oldpassword, newPassword, confirmPassword, callback){
  try{
  if(newPassword != confirmPassword){
    console.log("PLEASE CONFIRM YOUR PASSWORD CORRECTLY");
    callback('AUTHENTICATION', null);
  }
  else{
    module.exports.passwordAuthentication(phoneNumber, oldpassword, function(err, correctornot){
    if(err) {console.log("Password Authentication fails"); return callback(err, null);}
    if(correctornot == 'SUCCESS')
        database.query("UPDATE User SET User_Password = '"+newPassword+"' \
        WHERE User_PhoneNumber = '"+phoneNumber+"'", function(err, status){
        if(err) {console.log("Error happens in User.js updateUserPassword() UPDATE. " + err); return callback(err, null);}
        status = JSON.parse(JSON.stringify(status));
        return callback(null, status);
    });
    else{
        console.log("Wrong Old Password, Please try again!");
        return callback('AUTHENTICATION', null);
      }
      });
    }
  }catch(e){
  return callback(e, null);
  }
}
