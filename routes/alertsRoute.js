const express = require('express');
const alerts = require('../alerts/alerts')

//USER ROUTES FOR OUR API
//==================================================================================================================================================
var router = express.Router();  //get an instance of the express Router
//==================================================================================================================================================

router.route('/')
      .get(function (req, res){
        alerts.getAlerts(function(err,result){
          if(err){
            res.status(500).json(htmlresponse.error('NOT FOUND', 'GET /Alerts - denied entry'));
            return;
          }
          res.json(result);
        });
      });

module.exports = router;
