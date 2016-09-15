var app = angular.module('pmoApp', []);




app.controller('userCtrl', function($scope , $rootScope,$http) {
   var res=angular.element('#Name').val();
   var values=res.split("-");
   $rootScope.currentUser={
   "Name":values[0],
    "ID":values[1]
   };
   
    console.log('passed..'+JSON.stringify($rootScope.currentUser));
    var currentDate,
    next,
    count,
    countPrev,
    weekStart,
    weekEnd,
    monthFormat='MMM',
    yearFormat='YYYY',
    shortWeekFormat = 'ddd D';
    fullWeekFormat='YYYY-MM-DD'
    weekYear='YYYY-WW'
    $scope.dateArray=[];
    $scope.projectHours={};
    $scope.master = [{}];
    $scope.userData=[];
    var cur='now';
    $scope.exists=0;
    $scope.days=[0,1,2,3,4,5,6];
    $scope.test="test.....";
   $scope.options = [{id: 1, name: 'Opened','disabled': false}, {id: 2, name: 'In progress','disabled': false}, {id: 3, name: 'Completed','disabled': false}, {id: 4, name: 'Closed','disabled': true}];
   $rootScope.projects =[]; 
    var c_time=0;
      $http.get('/projects')
        .success(function(data) {
            $rootScope.projects = data;
            console.log('in controller..'+JSON.stringify($rootScope.projects[1]));
            
                      $http.get('/timecard')
                .success(function(data) {
                    var resData = data;
                    console.log('from db11...'+JSON.stringify(resData));

                    for(var i=0;i<resData.length;i++){
                      if(resData[i].UserID==$rootScope.currentUser.ID){
                         $scope.exists=1;
                          for(var j=0;j<resData[i].Timecard.length;j++){
                            if(resData[i].Timecard[j].weekID==moment().format(weekYear)){
                                $scope.userData=resData[i].Timecard[j].ProjectHours;
                                c_time=c_time+1;
                            }
                          }
                           
                      }
                    }

                    

                    console.log('from db...'+JSON.stringify($scope.userData));
                    setCurrentDate(moment(),0);
                })
                .error(function(data) {
                    console.log('Error: ' + data);
                });

            setCurrentDate(moment(),0);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });


    function setCurrentDate(aMoment,c){
      count=c;
      currentDate = aMoment,
      weekStart = currentDate.clone().startOf('week'),
      weekEnd = currentDate.clone().endOf('week'),
      $scope.month=currentDate.format(monthFormat);
      $scope.year=currentDate.format(yearFormat);
      $scope.weekYear=currentDate.format(weekYear);
      $scope.today=[weekStart.day(0).format(shortWeekFormat),weekStart.day(1).format(shortWeekFormat),weekStart.day(2).format(shortWeekFormat),weekStart.day(3).format(shortWeekFormat),weekStart.day(4).format(shortWeekFormat),weekStart.day(5).format(shortWeekFormat),weekStart.day(6).format(shortWeekFormat)];
      $scope.today_full=[weekStart.day(0).format(fullWeekFormat),weekStart.day(1).format(fullWeekFormat),weekStart.day(2).format(fullWeekFormat),weekStart.day(3).format(fullWeekFormat),weekStart.day(4).format(fullWeekFormat),weekStart.day(5).format(fullWeekFormat),weekStart.day(6).format(fullWeekFormat)];
      $scope.temp_arr=[];
      
      $scope.PrevInd=[];
      $scope.temp_obj={};
      for(var j=0;j<$rootScope.projects.length;j++){
        
       for(var i=0;i<$scope.days.length;i++){
            $scope.temp_arr=[];
            /*console.log('j....'+JSON.stringify($rootScope.projects[j]));*/
           if(moment($scope.today_full[i]).isAfter($rootScope.projects[j].endDate) || moment($scope.today_full[i]).isBefore($rootScope.projects[j].startDate) || weekStart.day(i).format('ddd')=='Sun' || weekStart.day(i).format('ddd')=='Sat'){
             $rootScope.projects[j].bool[i]=true;
             $scope.temp_arr[i]='';
           }
           else{
             $rootScope.projects[j].bool[i]=false;
             $scope.temp_arr[i]='';
           }
     
      }
        
       



         $rootScope.projects[j].InputValue.push($scope.temp_arr);
         if(count==0){
         //$rootScope.projects[j].temp=$rootScope.projects[j].InputValue[count];
          for(var i=0;i<$scope.userData.length;i++){
               if($scope.userData[i].project==$rootScope.projects[j].name){
                  $rootScope.projects[j].temp=$scope.userData[i].Hours; 
               }
          }
        }
        else{
          $rootScope.projects[j].temp=[];
        }
         
        console.log('count...'+count);
         console.log('value....\n'+j+'...'+$rootScope.projects[j].temp);
     
     }

      if(!$scope.$$phase) {
         $scope.$apply();
    }

    }

    $scope.nextWeek = function(){
    count=count+1;
    cur='next';
    console.log('count...'+count);
    setCurrentDate(currentDate.add(7,'days'),count);
    };

  

    $scope.prevWeek = function(){
      countPrev=0;
      count=count-1;
      cur='prev';

      $scope.PrevInd.push(count);
      setCurrentDate(currentDate.subtract(7,'days'),count);
    };

      $scope.submit = function () {
        console.log('please');
         $scope.master=angular.copy($rootScope.projects);
         for(var j=0;j<$rootScope.projects.length;j++){
         $rootScope.projects[j].dayHours.push({'day':$scope.today_full,'Hours':$rootScope.projects[j].temp});
          }
          console.log('here,........'+JSON.stringify($scope.projects,null,3));
        
        

         $http
        .post('/addTimecard',{ "Exists":$scope.exists,"WeekID":$scope.weekYear,"user":$rootScope.currentUser,"projects":$rootScope.projects,'Dates':$scope.today_full})
        .success(function(data){
          console.log('in posting..'+$scope.weekYear+'...exis'+$scope.exists+'....'+$rootScope.projects[0].temp);
            //what to do here? it's up to you and the data you write from server.
        })
        .error(function(data){
            console.log('Error: ' + data);
        });
      };

});

app.controller('loginCtrl', function($scope , $rootScope,$http) {

$scope.cUser={
  "name":"",
  "ID":""
}

$rootScope.currentUser={
  "name":"",
  "ID":""
};

      
  $http.get('/userlist')
        .success(function(data) {
            $scope.users = data;
            console.log('in user controller..'+JSON.stringify(data));
            $scope.userNames = [];
            $scope.values=[]
            $scope.EmpID = [];
            for(var i=1;i<$scope.users.length;i++){
              $scope.userNames.push($scope.users[i].Name);
              $scope.EmpID.push($scope.users[i].EmpID);
              $scope.values.push($scope.users[i].Name+'-'+$scope.users[i].EmpID);
            }
            
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });




});

app.controller('reportCtrl', function($scope , $rootScope,$http) {
 var currentDate,
    next,
    count,
    countPrev,
    weekStart,
    weekEnd,
    monthFormat='MMM',
    yearFormat='YYYY',
    shortWeekFormat = 'ddd D',
    fullWeekFormat='YYYY-MM-DD',
    weekYear='YYYY-WW';

      
  $http.get('/report')
        .success(function(data) {
            $scope.allUsers = data;
            console.log('receiving..'+JSON.stringify($scope.allUsers));
            $scope.finalUsers=[];
            $scope.userProj=[{}];
            $scope.TotalHours=[];
            //$scope.temp=[];
            $scope.cumulativeHours=[];
            for(var i=0;i<$scope.allUsers.length;i++){

              $scope.userDetails = {
                "Name":$scope.allUsers[i].UserName,
                "ID":$scope.allUsers[i].UserID,
                "Hours":[],
                "temp":[]
              
            };

 
              for(var j=0;j<$scope.allUsers[i].Timecard.length;j++){
                     
                      $scope.userProj=$scope.allUsers[i].Timecard[j].ProjectHours;
                      console.log('userProj...'+JSON.stringify($scope.userProj));
                      for(var k=1;k<6;k++){
                      var temp=0;
                      for(var j=0;j<$scope.userProj.length;j++){
                        if($scope.userProj[j].Hours[k]!=null){
                        temp=temp+parseInt($scope.userProj[j].Hours[k]);
                    }
                  }
                   $scope.TotalHours.push(temp);
                   
              }
                    console.log('total..'+$scope.TotalHours);
                    console.log('j...'+$scope.allUsers[i].Timecard.length);
                      $scope.userDetails.Hours.push({"WeekID":$scope.allUsers[i].Timecard[0].weekID,
                  "Dates":$scope.allUsers[i].Timecard[0].Dates,
                  "Total":$scope.TotalHours});
                      $scope.userDetails.temp=$scope.TotalHours;
                      console.log('userDetails...'+JSON.stringify($scope.userDetails));
                      $scope.TotalHours=[];
              }

              
                
           //console.log('final...'+'Name,...'+$scope.allUsers[i].UserName+'...Hours'+$scope.TotalHours+'len.'+$scope.TotalHours.length);
            $scope.finalUsers.push($scope.userDetails);
             console.log('Final...'+JSON.stringify($scope.finalUsers));
            }
             setCurrentDate(moment(),0);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });



    function setCurrentDate(aMoment,c){
      count=c;
      currentDate = aMoment,
      weekStart = currentDate.clone().startOf('week'),
      weekEnd = currentDate.clone().endOf('week'),
      $scope.month=currentDate.format(monthFormat);
      $scope.year=currentDate.format(yearFormat);
      $scope.weekYear=currentDate.format(weekYear);
      $scope.today=[weekStart.day(0).format(shortWeekFormat),weekStart.day(1).format(shortWeekFormat),weekStart.day(2).format(shortWeekFormat),weekStart.day(3).format(shortWeekFormat),weekStart.day(4).format(shortWeekFormat),weekStart.day(5).format(shortWeekFormat),weekStart.day(6).format(shortWeekFormat)];
      $scope.today_full=[weekStart.day(0).format(fullWeekFormat),weekStart.day(1).format(fullWeekFormat),weekStart.day(2).format(fullWeekFormat),weekStart.day(3).format(fullWeekFormat),weekStart.day(4).format(fullWeekFormat),weekStart.day(5).format(fullWeekFormat),weekStart.day(6).format(fullWeekFormat)];
      

    }

     $scope.nextWeek = function(){
    count=count+1;
    console.log('count...'+count);
    setCurrentDate(currentDate.add(7,'days'),count);
    };

  

    $scope.prevWeek = function(){
      //countPrev=0;
      count=count-1;

      //$scope.PrevInd.push(count);
      setCurrentDate(currentDate.subtract(7,'days'),count);
    };




});






