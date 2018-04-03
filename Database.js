var mysql = require('mysql');
module.exports.starts = function(){
global.pool = mysql.createPool({
      host: "localhost",
      user: "hospitalBees",
      password: "hospitalbees",
      database: "applicationdatabase"
    });
};

module.exports.query = function(queries, callback){
global.pool.getConnection(function(err, conn) {
  if (err) {console.log("Error happens in getConnection()."); return callback(err, conn)};
conn.query(queries, function (err, result, fields) {
  if (err) {console.log("Error happens in the query()."); return callback(err, conn)};
  return callback(err, result);
  });
conn.release();
});
};

module.exports.queryWithEnds = function(queries, callback){
    global.pool.getConnection(function(err, conn) {
      if (err) {console.log("Error happens in getConnection()."); return callback(err, conn)};
    conn.query(queries, function (err, result, fields) {
      if (err) {console.log("Error happens in query()."); return callback(err, conn)};
      return callback(err, result);
      });
    conn.release();
    global.pool.end();
  });
};

module.exports.ends = function(){
    global.pool.end(function(err){});
};
