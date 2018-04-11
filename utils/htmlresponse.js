const moment = require('moment');

module.exports.error = function(err, source){
  if (err === 'BADREQUEST')
    return ({
    "timestamp": moment().utc().format(),
    "status": 400,
    "error": "Bad Request",
    "message": "No message available",
    "path": source
});
  else if (err === 'COLLISION')
    return ({
    "timestamp": moment().utc().format(),
    "status": 409,
    "error": "Conflict",
    "message": "No message available",
    "path": source
});
  else if (err === 'NOTFOUND')
    return({
    "timestamp": moment().utc().format(),
    "status": 404,
    "error": "Not Found",
    "message": "No message available",
    "path": source
});
  else if(err === "FORBIDDEN")
    return ({
    "timestamp": moment().utc().format(),
    "status": 403,
    "error": "Not Found",
    "message": "No message available",
    "path": source
});
  else {
    console.error(source, err);
    return({
    "timestamp": moment().utc().format(),
    "status": 500,
    "error": "Internal Server Error",
    "message": err,
    "path": null
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
