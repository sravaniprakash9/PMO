var app = angular.module('pmoApp', []);


app.directive('numbersOnly', function () {
    return {
        require: 'ngModel',
        link: function (scope, element, attr, ngModelCtrl) {
            function fromUser(text) {
                if (text) {
                    var transformedInput = text.replace(/[^0-9]/g, '');

                    if (transformedInput !== text) {
                        ngModelCtrl.$setViewValue(transformedInput);
                        ngModelCtrl.$render();
                    }
                    return transformedInput;
                }
                return undefined;
            }            
            ngModelCtrl.$parsers.push(fromUser);
        }
    };
});

app.directive('showButton', ['webNotification', function (webNotification) {

    return {
        restrict: 'C',
        template: 'Show Notification',
        link: function (scope, element) {
            element.on('click', function onClick() {
                webNotification.showNotification('Example Notification', {
                    body: 'Notification Text...',
                    icon: '',
                    onClick: function onNotificationClicked() {
                        window.alert('Notification clicked.');
                    },
                    autoClose: 4000 //auto close the notification after 2 seconds (you manually close it via hide function)
                }, function onShow(error, hide) {
                    if (error) {
                        window.alert('Unable to show notification: ' + error.message);
                    } else {
                        console.log('Notification Shown.');

                        setTimeout(function hideNotification() {
                            console.log('Hiding notification....');
                            hide(); //manually close the notification (or let the autoClose close it)
                        }, 5000);
                    }
                });
            });
        }
    };
}]);





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
    $scope.fromDB=[{}];
    $scope.exists=0;
    $scope.userinDB=0;
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
                         $scope.userinDB=1;
                         $scope.fromDB=resData[i].Timecard;
                          /*for(var j=0;j<resData[i].Timecard.length;j++){*/

                           /* if(resData[i].Timecard.length>1){
                                $scope.exists=2;
                            }*/
                            /*if(resData[i].Timecard[j].weekID==moment().format(weekYear)){
                                $scope.userData=resData[i].Timecard[j].ProjectHours;
                                c_time=c_time+1;
                            }
                          }*/
                           
                      }
                    }

                    

                    
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
            console.log('j....'+JSON.stringify($rootScope.projects[j]));
           if(weekStart.day(i).format('ddd')=='Sun' || weekStart.day(i).format('ddd')=='Sat'){
             $rootScope.projects[j].bool[i]=true;
             $scope.temp_arr[i]='';
           }
           else{
             $rootScope.projects[j].bool[i]=false;
             $scope.temp_arr[i]='';
           }
     
      }
        
       


        var weekcount=0;
         $rootScope.projects[j].InputValue.push($scope.temp_arr);
         /*if(count==0){*/
            for(var d=0;d<$scope.fromDB.length;d++){
              if($scope.fromDB[d].weekID==$scope.weekYear){
                $scope.userData=$scope.fromDB[d].ProjectHours;
                console.log('from db...'+JSON.stringify($scope.userData));
                  weekcount=weekcount+1;
                  $scope.exists=2;

              }
              else{
                if($scope.userinDB==0){
                    $scope.exists=0;
                }
                else{
                  $scope.exists=1;
                }
                 
              }
            }
         //$rootScope.projects[j].temp=$rootScope.projects[j].InputValue[count];
       if(weekcount>0){
          for(var i=0;i<$scope.userData.length;i++){
               if($scope.userData[i].project==$rootScope.projects[j].name){
               /*for(var j=0;j<$scope.userData[i].Hours.length;j++){
                if($scope.userData[i].Hours[j]==null || $scope.userData[i].Hours[j]==" " ){
                    $scope.userData[i].Hours[j]=0;
                }
               } */
                for(var h=0;h<$scope.userData[i].Hours.length;h++){
                    if($scope.userData[i].Hours[h]==""){
                          $scope.userData[i].Hours[h]=0;
                    }
                }
                
                  $rootScope.projects[j].temp=$scope.userData[i].Hours; 
               }
          }
        }
        else{
          $rootScope.projects[j].temp=[0,0,0,0,0,0,0];
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
   alert('Submitted successfully');
        console.log('please');
        console.log('submiting here,,.....'+JSON.stringify($rootScope.projects));
         $scope.master=angular.copy($rootScope.projects);
         for(var j=0;j<$rootScope.projects.length;j++){
          for(var i=0;i<$rootScope.projects[j].temp.length;i++){
            if($rootScope.projects[j].temp==null && $rootScope.projects[j].temp==" "){
                        $rootScope.projects[j].temp=0;
            }
          }
            

         $rootScope.projects[j].dayHours.push({'day':$scope.today_full,'Hours':$rootScope.projects[j].temp});
          }

          console.log('submiting after,,.....'+JSON.stringify($rootScope.projects));
        
        

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

app.controller('loginCtrl', function($scope ,$interval,$rootScope,$http) {

$scope.cUser={
  "name":"",
  "ID":""
}

$rootScope.currentUser={
  "name":"",
  "ID":"",
  "Value":""
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

        $scope.ReportSubmit=function(){
          console.log("Entered reportr"+$rootScope.currentUser.Value);
            if($rootScope.currentUser.Value=="Sravani-1637"){
              return true;
            }
            else{
              return false;
            }
        }




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

                     /*console.log('length Timecard...'+$scope.allUsers[i].Timecard.length);*/

                      for(var x=0;x<$scope.allUsers[i].Timecard.length;x++){
                          console.log('weekhere.....'+$scope.allUsers[i].Timecard[x].weekID);
                          $scope.userProj=$scope.allUsers[i].Timecard[x].ProjectHours;
                          $scope.tempweek=$scope.allUsers[i].Timecard[x].weekID;
                          $scope.tempDates=$scope.allUsers[i].Timecard[x].Dates;

                          for(var k=1;k<6;k++){
                              var temp=0;
                              for(var j=0;j<$scope.userProj.length;j++){
                                if($scope.userProj[j].Hours[k]!=null){
                                temp=temp+parseInt($scope.userProj[j].Hours[k]);
                                }
                              }
                               $scope.TotalHours.push(temp);
                           }
                               $scope.userDetails.Hours.push({"WeekID":$scope.tempweek,
                                "Dates":$scope.tempDates,
                                "Total":$scope.TotalHours});
                     /* $scope.userDetails.temp=$scope.TotalHours;*/
                        $scope.TotalHours=[];
                      }

              
                /*console.log('userDetails...'+JSON.stringify($scope.userDetails));*/
           //console.log('final...'+'Name,...'+$scope.allUsers[i].UserName+'...Hours'+$scope.TotalHours+'len.'+$scope.TotalHours.length);
            $scope.finalUsers.push($scope.userDetails);
             /*console.log('Final...'+JSON.stringify($scope.finalUsers));*/
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
      $scope.months=(currentDate).format(monthFormat);

      /*console.log('in functiom'+JSON.stringify($scope.allUsers));*/
      var total=[0,0,0,0,0];
      var arr=[];
      $scope.TotalHours=[];
      $scope.copy_of_final=[];
      var bool=0;
      for(var i=0;i<$scope.finalUsers.length;i++){
              for(var j=0;j<$scope.finalUsers[i].Hours.length;j++){
                    if($scope.finalUsers[i].Hours[j].WeekID==$scope.weekYear){
                        bool=bool+1;
                        $scope.finalUsers[i].temp=$scope.finalUsers[i].Hours[j].Total;
                        
                  }

              }
              if(bool==0){
                arr.push(i);
                //delete $scope.finalUsers[i];
                /*$scope.finalUsers.splice(i,1);
                console.log('removing'+$scope.finalUsers[i].Name);
                console.log('final'+JSON.stringify($scope.finalUsers));*/
                  $scope.finalUsers[i].temp=total;
                  //$scope.finalUsers.splice(i,1)
                   console.log('final'+JSON.stringify($scope.finalUsers[i]));
              }
              /*else{
                $scope.copy_of_final.push($scope.finalUsers[i]);
              }*/
              console.log(' inside...'+JSON.stringify($scope.finalUsers[i]));
            }
            /*$scope.finalUsers=angular.copy($scope.copy_of_final);
            console.log('after copyini...'+JSON.stringify($scope.copy_of_final));*/
            //$scope.copy_of_final.copy($scope.finalUsers);
           /* for(var i=0;i<$scope.finalUsers.length;i++){
              $scope.finalUsers.splice(arr[i],1);
              console.log(' splicing...'+JSON.stringify($scope.finalUsers[arr[i]]));
            }
            console.log('after splicing...'+JSON.stringify($scope.finalUsers));
*/
      var daily_max=8*$scope.finalUsers.length;
      var weekly_max=daily_max*5;
      var monthly_max=weekly_max*4;
      console.log('daily max...'+daily_max);
      console.log('weekly max...'+weekly_max);
      console.log('monthly_max ...'+monthly_max);
      var weekly_total=0;
      


      for(var j=0;j<5;j++){
          var daily_total=0;
          for(var i=0;i<$scope.finalUsers.length;i++){
            daily_total=daily_total+$scope.finalUsers[i].temp[j];
         }
         weekly_total=weekly_total+daily_total;
         daily_total=daily_total*(100/daily_max);
         console.log('daily percentage...'+daily_total);
         $scope.TotalHours.push(daily_total);
      }
      console.log('weekly total..'+weekly_total);
      $scope.weekly_percent=weekly_total*(100/weekly_max);
      console.log('total hours...'+$scope.TotalHours);
       console.log('weekly hours...'+$scope.weekly_percent);
      $scope.monthly_percent=(weekly_total*4)*(100/monthly_max);



    }



     $scope.nextWeek = function(){
    count=count+1;
    console.log('count...'+count);
    setCurrentDate(currentDate.add(7,'days'),count);
    //$scope.months=(currentDate.add(1,'M')).format(monthFormat);
      //console.log('next month...'+$scope.months);
    };

  

    $scope.prevWeek = function(){
      //countPrev=0;
      count=count-1;

      //$scope.PrevInd.push(count);
      setCurrentDate(currentDate.subtract(7,'days'),count);
      //$scope.months=(currentDate.add(-1,'M')).format(monthFormat);
      //console.log('prev month...'+$scope.months);
    };

});







