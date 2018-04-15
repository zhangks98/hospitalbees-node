const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "chiri",
  password: "123456",
  database: "application"
});
var getArray = [];
var allDisease = [];


module.exports.generateAlerts = function(callback){
    try{
      con.query("SELECT Disease_Name, drank, dnum_of_cases, id, No_of_cases FROM diseases", function(err, alerts){
        if(err){console.log("Error in alerts.js SELECT drank" + err);return callback(NULL);};
//callback(drank_result);
        createAlerts(alerts);

        })

  }



  catch(e){
    console.log(e);
  }
}

function createAlerts(alerts){
  var cnt = 0;
  drank_result = [];
  for(cnt;cnt<5;cnt++){
    allDisease.push(alerts[cnt]);
    if(alerts[cnt].drank > 0 && alerts[cnt].drank < 6){
      if(alerts[cnt].dnum_of_cases>=0){
        drank_result.push(alerts[cnt].Disease_Name + " moved up by " + alerts[cnt].drank + " position(s), coming to " + alerts[cnt].id + " and observed an increase of " + alerts[cnt].dnum_of_cases + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
      }
      else {
        drank_result.push(alerts[cnt].Disease_Name + " moved up by " + alerts[cnt].drank + " position(s), coming to " + alerts[cnt].id + " and observed a decrease of " + Math.abs(alerts[cnt].dnum_of_cases) + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
    }
  }
    else if(alerts[cnt].drank == 0){
      if(alerts[cnt].dnum_of_cases>=0){
        drank_result.push(alerts[cnt].Disease_Name + " stayed at position " + alerts[cnt].id + " and observed an increase of " + alerts[cnt].dnum_of_cases + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
      }
      else {
        drank_result.push(alerts[cnt].Disease_Name + " stayed at position " + alerts[cnt].id + " and observed a decrease of " + Math.abs(alerts[cnt].dnum_of_cases) + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
      }
    }
      else if(alerts[cnt].drank < 0){
        if(alerts[cnt].dnum_of_cases>=0){
          drank_result.push(alerts[cnt].Disease_Name + " moved down by " + Math.abs(alerts[cnt].drank) + " position(s), reaching position " + alerts[cnt].id + " and observed an increase of " + alerts[cnt].dnum_of_cases + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
        }
        else {
          drank_result.push(alerts[cnt].Disease_Name + " moved down by " + Math.abs(alerts[cnt].drank) + " position(s), reaching position " + alerts[cnt].id + " and observed a decrease of " + Math.abs(alerts[cnt].dnum_of_cases) + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
        }
      }
      else if(alerts[cnt].drank == 6){
        drank_result.push(alerts[cnt].Disease_Name + " is a new entry into the list at position " + alerts[cnt].id + " with " + alerts[cnt].No_of_cases + " cases this week.")
      }
    }
    getArray = drank_result;

}
module.export.getAlerts = function(callback){
  console.log("Alerts:");
  let diseaseList = getAllDisease();
  if(getArray.length !== 5){
    createAlerts(diseaseList);
  }
//  con.end();
  return {
    diseases: diseaseList,
    alerts: getArray
  }
}
var getAllDisease = function() {
  if (allDisease.length === 5) {
    return allDisease;
  } else {
    try{
      con.query("SELECT Disease_Name, drank, dnum_of_cases, id, No_of_cases FROM diseases", function(err, diseaseDetails){
        if(err){console.log("Error in alerts.js SELECT drank" + err);return callback(NULL);};
        return JSON.stringify(diseaseDetails);
      }
    })
  }
}
