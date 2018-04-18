/*The following snippet helps in returning
a list of alerts showing changes every week
and sending it as a JSON object to the
server which is fetched using RESTful API*/

const mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "chiri",
  password: "123456",
  database: "application"
});
var getArray = [];
var allDisease = [];
//creating two global variables to keep track of list of alerts and disesase details

function createAlerts(alerts){  //This function helps in creating alerts by comparing changes in positions and number of cases as well as handling new entries
  var cnt = 0;
  drank_result = [];
  console.log(alerts);
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

module.exports = {  //exporting the two functions so that they can be called from outside this code as well

  generateAlerts: function(){
      try{
        con.query("SELECT Disease_Name, drank, dnum_of_cases, id, No_of_cases FROM diseases", function(err, alerts){
          if(err){console.log("Error in alerts.js SELECT drank" + err);return callback(NULL);};
          createAlerts(alerts);
          })
    }catch(e){
        console.log(e);
      }
    },
    getAlerts: function(){
      console.log("Alerts:");
      let diseaseList = getAllDisease();
      console.log(diseaseList)
      if(getArray.length !== 5){
        createAlerts(diseaseList);
      }
      return {
        diseases: diseaseList,
        alerts: getArray
      }
    }
}

var getAllDisease = function() {
  if (allDisease.length === 5) {
    //console.log("IN IFFFF");
    return allDisease.splice(0,5);
  } else {
    try{
      //console.log("IN ELSE");
      con.query("SELECT Disease_Name, drank, dnum_of_cases, id, No_of_cases FROM diseases", function(err, diseaseDetails){
        if(err){console.log("Error in alerts.js SELECT drank" + err);return callback(NULL);};
        let allDiseaseStr = JSON.stringify(diseaseDetails);
        console.log("allDisease",allDiseaseStr.length);
        return allDisease;

      })
    }catch(e){
        console.log(e);
    }
  }
}
