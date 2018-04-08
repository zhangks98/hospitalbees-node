const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "chiri",
    password: "123456",
    database: "application"
});
var getArray = [];


module.exports.generateAlerts = function (callback) {
    try {
        con.query("SELECT Disease_Name, drank, dnum_of_cases, id, No_of_cases FROM diseases", function (err, alerts) {
            if (err) {
                console.log("Error in alerts.js SELECT drank" + err);
                return callback(NULL);
            }
            var cnt = 0;
            drank_result = [];
            for (cnt; cnt < 5; cnt++) {
                if (alerts[cnt].drank > 0 && alerts[cnt].drank < 6) {
                    if (alerts[cnt].dnum_of_cases >= 0) {
                        drank_result.push(alerts[cnt].Disease_Name + " moved up by " + alerts[cnt].drank + " position(s), coming to " + alerts[cnt].id + " and observed an increase of " + alerts[cnt].dnum_of_cases + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
                    }
                    else {
                        drank_result.push(alerts[cnt].Disease_Name + " moved up by " + alerts[cnt].drank + " position(s), coming to " + alerts[cnt].id + " and observed a decrease of " + Math.abs(alerts[cnt].dnum_of_cases) + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
                    }
                }
                else if (alerts[cnt].drank === 0) {
                    if (alerts[cnt].dnum_of_cases >= 0) {
                        drank_result.push(alerts[cnt].Disease_Name + " stayed at position " + alerts[cnt].id + " and observed an increase of " + alerts[cnt].dnum_of_cases + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
                    }
                    else {
                        drank_result.push(alerts[cnt].Disease_Name + " stayed at position " + alerts[cnt].id + " and observed a decrease of " + Math.abs(alerts[cnt].dnum_of_cases) + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
                    }
                }
                else if (alerts[cnt].drank < 0) {
                    if (alerts[cnt].dnum_of_cases >= 0) {
                        drank_result.push(alerts[cnt].Disease_Name + " moved down by " + Math.abs(alerts[cnt].drank) + " position(s), reaching position " + alerts[cnt].id + " and observed an increase of " + alerts[cnt].dnum_of_cases + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
                    }
                    else {
                        drank_result.push(alerts[cnt].Disease_Name + " moved down by " + Math.abs(alerts[cnt].drank) + " position(s), reaching position " + alerts[cnt].id + " and observed a decrease of " + Math.abs(alerts[cnt].dnum_of_cases) + " cases from last week totalling " + alerts[cnt].No_of_cases + " cases this week.");
                    }
                }
                else if (alerts[cnt].drank === 6) {
                    drank_result.push(alerts[cnt].Disease_Name + " is a new entry into the list at position " + alerts[cnt].id + " with " + alerts[cnt].No_of_cases + " cases this week.")
                }
            }
            getArray = drank_result;
            //callback(drank_result);
        })
    } catch (e) {
        console.log(e);
    }
}


module.export.getAlerts = function () {
    if (getArray.length > 0) {
      return getArray;
    }
    con.end(); // how about the next connection?
}
