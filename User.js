var database = require('./Database.js');

module.exports.addUser = function(nric, name, password, phoneNumber, callback){
    try{
     database.query("SELECT COUNT(*) AS TOTAL_NRIC FROM User WHERE User_NRIC = '"+nric+"' ", function(err, totalnric){
     if(err) {console.log("Error happens in User.js addUser() COUNT. " + err); return callback(0);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
     SameNRIC = JSON.parse(JSON.stringify(totalnric))[0].TOTAL_NRIC;
     if (SameNRIC == 0)
        database.query("INSERT INTO User (User_NRIC, User_Name,\
        User_Password, User_PhoneNumber)\
        VALUES ('"+nric+"', '"+name+"' , '"+password+"', '"+phoneNumber+"')", function(err, result){
          if(err) {console.log("Error happens in User.js addUser() INSERT. " + err); return callback(0);};    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
          return callback(1);
        });
     else{
        console.log("ERROR! This NRIC has been registered!");
        return callback(0);
      }
      })
    } catch(e){
        console.log(e);
    }
}

module.exports.blockUser = function(nric, callback){
  try{
    database.query("UPDATE User SET User_BlockedStatus = 1 \
    WHERE User_NRIC = '"+nric+"'", function(err, result){
      if(err) {console.log("Error happens in User.js blockUser() UPDATE. " + err); return callback(0);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
      return callback(1);
    });
 } catch(e){
        console.log(e);
 }
}

module.exports.deleteUser = function(nric, callback){
  try{
   database.query("DELETE FROM user WHERE User_NRIC='"+nric+"'", function(err, result){
     if(err) {console.log("Error happens in User.js deleteUser() DELETE. " + err); return callback(0);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
     return callback(1);
   });
 } catch(e){
        console.log(e);
 }
}

module.exports.passwordAuthentication = function(nric, password, callback){
  try{
   database.query("SELECT * FROM User WHERE User_NRIC = '"+nric+"' ", function(err, userdata){
   if(err) {console.log("Error happens in User.js addUser() INSERT. " + err); return callback(0, null);}    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
   if(JSON.parse(JSON.stringify(userdata))[0].User_BlockedStatus == 1)
       return callback(1, -1);
   else if(password == JSON.parse(JSON.stringify(userdata))[0].User_Password)
       return callback(1, 1);
   else
       return callback(1, 0);
 });
  }catch(e){
      console.log(e);
}
}

module.exports.queryUser = function(nric, password, callback){
  try{
  module.exports.passwordAuthentication(nric, password, function(fail, correctornot){
    if(!fail) {console.log("Password Authentication Fails!"); return callback(0, null);}    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    if(correctornot == 1)
        database.query("SELECT * FROM User WHERE User_NRIC = '"+nric+"' ", function(err, userdata){
        if(err) {console.log("Error happens in User.js queryUser() SELECT. " + err); return callback(0, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
        userdata = JSON.parse(JSON.stringify(userdata))[0];
        return callback(1, userdata);
        console.log("success");
      });
    else if (correctornot == 0){
       console.log("Wrong Password");
       return callback(0, null);
     }
    else{
      console.log("Your account is blocked");
      return callback(0, null);
    }
  });
} catch(e){
  console.log(e);
}
}

module.exports.queryUser = function(nric, password, callback){
  try{
  module.exports.passwordAuthentication(nric, password, function(fail, correctornot){
    if(!fail) {console.log("Password Authentication Fails!"); return callback(0, null);}    //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
    if(correctornot == 1)
        database.query("SELECT * FROM User WHERE User_NRIC = '"+nric+"' ", function(err, userdata){
        if(err) {console.log("Error happens in User.js queryUser() SELECT. " + err); return callback(0, null);}   //console.log(JSON.parse(JSON.stringify(result))[0].Booking_QueueNumber);
        userdata = JSON.parse(JSON.stringify(userdata))[0];
        return callback(1, userdata);
        console.log("success");
      });
    else if (correctornot == 0){
       console.log("Wrong Password");
       return callback(0, null);
     }
    else{
      console.log("Your account is blocked");
      return callback(0, null);
    }
  });
} catch(e){
  console.log(e);
}
}

module.exports.updateUserData = function(id, nric, name, phoneNumber, callback){
  try{
  database.query("SELECT COUNT(*) AS TOTAL_NRIC FROM User WHERE (User_NRIC = '"+nric+"' AND User_UserID != "+id+") ", function(err, totalnric){
  if(err) {console.log("Error happens in User.js updateUserData() SELECT. " + err); return callback(0);}
  SameNRIC = JSON.parse(JSON.stringify(totalnric))[0].TOTAL_NRIC;
  if (SameNRIC == 0)
    database.query("UPDATE User SET User_NRIC = '"+nric+"', \
    User_Name = '"+name+"', User_PhoneNumber = '"+phoneNumber+"'\
    WHERE User_UserID = "+id+"", function(err, userdata){
    if(err) {console.log("Error happens in User.js updateUserData() UPDATE. " + err); return callback(0);}
    callback(1);
  });
  else{
    console.log("PLEASE CHANGE THE NRIC");
    callback(0);
  }
  });
}catch(e){
  console.log(e);
}
}

module.exports.updateUserPassword = function(nric, oldpassword, newPassword, confirmPassword, callback){
  try{
  if(newPassword != confirmPassword){
    console.log("PLEASE CONFIRM YOUR PASSWORD CORRECTLY");
    callback(0);
  }
  else{
    module.exports.passwordAuthentication(nric, oldpassword, function(success, correctornot){
    if(!success) {console.log("Password Authentication fails"); return callback(0);}
    if(correctornot == 1)
        database.query("UPDATE User SET User_Password = '"+newPassword+"' \
        WHERE User_NRIC = '"+nric+"'", function(err, userdata){
        if(err) {console.log("Error happens in User.js updateUserPassword() UPDATE. " + err); return callback(0);}
        return callback(1);
    });
    else{
        console.log("Wrong Old Password, Please try again!");
        return callback(0);
      }
      });
    }
  }catch(e){
  console.log(e);
  }
}
