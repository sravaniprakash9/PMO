var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {  
	 var db = req.db;
        var collection = db.get('usercollection');
        collection.find({},{},function(e,docs){
         res.render('userlist', {
            projects: docs
        });
    });
    
});

router.post('/index', function(req, res) {
	console.log('passing..name'+req.body.Name+'......ID'+req.body.EmpID);
	 res.render('index', { Title:'Here..', Name:req.body.Name, ID: req.body.EmpID });

});

router.post('/report', function(req, res) {
	console.log('report here');
	 res.render('report', { Title:'Report of Employees'});

});

router.get('/report', function(req, res) {
	var db = req.db;
    var collection = db.get('Timecard_test');
	 collection.find({},{},function(e,docs){
         res.send(docs);
    });

});



router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('Users');
    collection.find({},{},function(e,docs){
         res.send(docs);
    });
});





 router.get('/projects', function(req, res) {
           
           var db = req.db;
    var collection = db.get('Projects');
    collection.find({},{},function(e,docs){
    	
         res.send(docs);
         
    });
    });


router.get('/timecard', function(req, res) {
    var db = req.db;
    var collection = db.get('Timecard_test');
    collection.find({},{},function(e,docs){
         res.send(docs);
    });
});

 
router.post('/addTimecard', function(req,res,next) {
    console.log('Entered.....');
    var db = req.db;
    var collection = db.get('Timecard_test');
    var weekID=req.body.WeekID;
    var temp1=[{}];
    var temp2={};
    var user=req.body.user;
    var projects=req.body.projects;
    var dates=req.body.Dates;
    var Hours=req.body.Hours;
    var exists=req.body.Exists;
 
 for(var i=0;i<projects.length;i++){
    	temp1[i]={
    		"project":projects[i].name,
    		"Hours":projects[i].temp,
    		"Status":projects[i].Status
    	};
    	
    }

     if(exists=="0"){
     	 console.log('inserting...'+JSON.stringify(temp1));
     		collection.insert({
    	"UserID":user.ID,
    	"UserName":user.Name,
    	"Timecard":[{
    		"weekID":weekID,
             "Dates":dates,
             "ProjectHours":temp1

    	}]
    	
        
    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
            console.log(err);
        }
        else {
            res.send("Tjdfsbghvfkjhbg.");
        }
    });
     }


     else if(exists=="2")
     {
            console.log('updating...'+JSON.stringify(temp1));
        
        collection.update({"UserID":user.ID,"Timecard.weekID":weekID},{$set:{"Timecard.$.ProjectHours":temp1
            }

    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
            console.log(err);
        }
        else {
            res.send("Tjdfsbghvfkjhbg.");
        }
    });
     	
     }
     else{

 console.log('pushing...'+JSON.stringify(temp1));
        
        collection.update({"UserID":user.ID},{$push: { "Timecard":{ "Dates":dates,"weekID":weekID,"ProjectHours":temp1 } }

    }, function (err, doc) {
        if (err) {
            res.send("There was a problem adding the information to the database.");
            console.log(err);
        }
        else {
            res.send("Tjdfsbghvfkjhbg.");
        }
    });


        

     }
    
});

 




/* POST to Add User Service */
/*router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var userName = req.body.username;
    var userEmail = req.body.useremail;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "username" : userName,
        "email"    : userEmail
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});
*/

module.exports = router;
