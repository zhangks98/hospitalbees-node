var Request = require("request");
const mysql = require('mysql');
var _ = require('lodash');


var database = mysql.createConnection({
    host: "localhost",
    user: "chiri",
    password: "123456",
    database: "application"
});

var allDisease = [];
//console.log(getDifference("2018-W09","2018-W10"));
var updateDisease = (callback) => {
    var finalDisease = [];
    Request.get({
        url: "https://data.gov.sg/api/action/datastore_search?resource_id=ef7e44f1-9b14-4680-a60a-37d2c9dda390&sort=epi_week desc, no._of_cases desc&limit=5",
        json: true
    }, (error, response, body) => {
        if (error) {
            return console.dir(error);
        }
        // var data = body.split('{"epi_week": ');
        // var length = data.length;
        //console.log(data[5]);
        var value = body.result.records[0];
        //var arrData = data[2].split(',');
        //console.log(value["no._of_cases"]);
        var week = value.epi_week;
        var cnt = 0;
        var rankArray = [];
        for (cnt = 0; cnt < 5; cnt++) {
            finalDisease.push(body.result.records[cnt].disease);
        }
        //console.log(finalDisease);

        //  console.log(finalDisease);
        //  console.log(prop[0].Dname);
        //  console.log(finalDisease[0]);
        // console.log(finalDisease.indexOf(prop[0].Dname));

        try {
            database.query("SELECT Week as week_num, Disease_Name as Dname, No_of_cases as num_occ, ID as rank from diseases", function (err, prop) {
                if (err) {
                    console.log("Error happens in api.js changeDiseases week_num" + err);
                    return callback(0, null);
                }
                //console.log(getDifference("2017-W51","2017-W52"));
                if (getDifference(prop[prop.length - 1].week_num, week)) {
                    for (cnt = 0; cnt < 5; cnt++) {
                        if (finalDisease.includes(prop[cnt].Dname)) {
                            var new_rank = finalDisease.indexOf(prop[cnt].Dname);
                            var old_rank = cnt;
                            rankArray.push(new_rank);
                            //console.log("prop2 is " + prop[0].num_occ);
                            var delta = old_rank - new_rank;
                            var old_num_of_cases = prop[cnt].num_occ;
                            var new_num_of_cases = body.result.records[new_rank]["no._of_cases"];
                            //var week = arrData[0];
                            var dnum = new_num_of_cases - old_num_of_cases;
                            var disease = finalDisease[new_rank];

                            database.query("Update diseases set Week = '" + week + "', Disease_Name = '" + disease + "', No_of_cases = '" + new_num_of_cases + "', drank = '" + delta + "', dnum_of_cases = '" + dnum + "'Where ID = " + (new_rank + 1) + "", function (err, result) {
                                if (err) {
                                    console.log("Error happens in api.js changeDiseases INSERT. " + err);
                                    return callback(0, 1);
                                }
                                // return callback(1, 1);
                                console.log("Has Difference");
                                console.log(result);
                            })
                        }
                    }
                    var diffArr = [0, 1, 2, 3, 4].filter(function (x) {
                        return rankArray.indexOf(x) < 0
                    });
                    //console.log("DiffArray is " + diffArr);
                    while (diffArr.length > 0) {
                        new_rank = diffArr.pop();
                        var new_num_of_cases = body.result.records[new_rank]["no._of_cases"];
                        var disease = finalDisease[new_rank];
                        var delta = 6;
                        var dnum = 100000;

                        database.query("Update diseases set Week = '" + week + "', Disease_Name = '" + disease + "', No_of_cases = '" + new_num_of_cases + "', drank = '" + delta + "', dnum_of_cases = '" + dnum + "'Where ID = " + (new_rank + 1) + "", function (err, result) {
                            if (err) {
                                console.log("Error happens in api.js changeDiseases INSERT. " + err);
                                return callback(0, 1);
                            }
                            console.log("Has Difference");
                            console.log(result);
                        })
                    }
                    return callback(1, 1);
                }
                return callback(1, 0);
            })
        } catch (e) {
            console.log(e);
        }
    });
}

function callback(a, b) {
    if (!a)
        console.log("Error 404. Please try again!")
    else if (a && !b) {
        console.log("The databse is already updated!")
        try {
            console.log("The list of diseases are: " + finalDisease);
            database.end();
        }
        catch (e) {
            console.log(e);
        }
    }
    else {
        console.log("The database has been updated successfully!")
        try {
            console.log("The list of diseases are: " + finalDisease);
            database.end();
        }
        catch (e) {
            console.log(e);
        }
    }
}

function getDifference(a, b) {
    // TODO: handle year difference
    if (typeof a === 'number')
        a = a.toString();
    if (typeof b === 'number')
        b = b.toString();
    a_year = a.slice(0, 4);
    b_year = b.slice(0, 4);
    a_wk = a.slice(6);
    b_wk = b.slice(6);
    //console.log(a_year);
    //console.log(b_year);
    if (a_year.localeCompare(b_year) === -1) {
        return 1;
    }
    else if (a_year.localeCompare(b_year) === 0) {
        if (a_wk.localeCompare(b_wk) === -1)
            return 1;
        else {
            return 0;
        }
    }
    else {
        return 0;
    }
}

var changeDiseases = function (database, week, callback) {
    // console.log(week);
    //
    // try{
    //   database.query("SELECT Week as week_num from diseases", function(err,week_num){
    //       if(err) {console.log("Error happens in api.js changeDiseases week_num" + err); return callback(0,null);};
    //       console.log(getDifference("2017-W51","2017-W52"));
    //       if(getDifference(week_num[week_num.length-1],week)>=1){
    //         for(cnt;cnt<6;cnt++){
    //           var arrData = data[cnt].split(',');
    //           //var week = arrData[0];
    //           var disease = arrData[2].replace('"disease": ','').trim();
    //           var num_of_cases = parseInt(arrData[3].replace('"no._of_cases": ','').slice(2,-2));
    //           //console.log(arrData,disease,num_of_cases);
    //           database.query("INSERT INTO diseases VALUES ('" + week + "', '" + disease + "', '" + num_of_cases + "')", function(err, result){
    //             if(err) {console.log("Error happens in api.js changeDiseases INSERT. " + err); return callback(0,1);};
    //             return callback(1,1);
    //           });
    //         }
    //       }
    //       return callback(1,0);
    //
    //   })
    // } catch(e){
    //   console.log(e);
    // }
}
