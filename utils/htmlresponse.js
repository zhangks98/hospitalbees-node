const moment = require('moment');

module.exports.error = function(err, source){
  if (err === 'BADREQUEST')
    return ({
    "timestamp": moment().utc().format(),
    "error": "Bad Request",
    "path": source
});
  else if (err === 'COLLISION')
    return ({
    "timestamp": moment().utc().format(),
    "error": "Conflict",
    "path": source
});
  else if (err === 'NOTFOUND')
    return({
    "timestamp": moment().utc().format(),
    "error": "Not Found",
    "path": source
});
  else if(err === "FORBIDDEN")
    return ({
    "timestamp": moment().utc().format(),
    "error": "Not Found",
    "path": source
});
  else {
    console.error(source, err);
    return({
    "timestamp": moment().utc().format(),
    "error": "Internal Server Error",
    "message": err,
    "path": source
    });
  }
};
module.exports.success = function(request, message, path){
  if(request === 200)
    return ({
    "timestamp": moment().utc().format(),
    "status": 200,
    "success": "OK",
    "message": message,
    "path": path
});
  else if(request === 201)
  return({
  "timestamp": moment().utc().format(),
  "status": 201,
  "success": "Created",
  "message": message,
  "path": path
});
};
