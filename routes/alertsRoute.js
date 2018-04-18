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
            res.status(3000).json(htmlresponse.error('NOT FOUND', 'POST /Alerts - denied entry'));
            return
          }
          res.json(result);
        });
      });

module.exports = router;
