var app = angular.module('pmoApp', []);




app.controller('userCtrl', function($scope , $rootScope,$http,setUser) {
   
   $rootScope.currentUser={
   "Name":angular.element('#Name').val(),
    "ID":angular.element('#ID').val()
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
        .post('/addTimecard',{ "Exists":$scope.exists,"WeekID":$scope.weekYear,"user":$rootScope.currentUser,"projects":$rootScope.projects})
        .success(function(data){
          console.log('in posting..'+$scope.weekYear+'...exis'+$scope.exists+'....'+$rootScope.projects[0].temp);
            //what to do here? it's up to you and the data you write from server.
        })
        .error(function(data){
            console.log('Error: ' + data);
        });
      };

});

app.controller('loginCtrl', function($scope , $rootScope,$http,setUser) {

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
            $scope.EmpID = [];
            for(var i=1;i<$scope.users.length;i++){
              $scope.userNames.push($scope.users[i].Name);
              $scope.EmpID.push($scope.users[i].EmpID);
            }
            
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });



        
$scope.setuser=setUser.set($rootScope.currentUser);

});


app.service('setUser', function () {
        this.property="";

        this.get= function(){
          console.log('getting...'+JSON.stringify(property));
        return property;
    };  
      this.set= function(value){
        property=value;
        console.log('setting...'+JSON.stringify(property));
    };  


    });




