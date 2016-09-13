var app = angular.module('Home', ['ngRoute']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider,
     $urlRouterProvider) {
   $stateProvider
     .state('/', {
       url: '/',
       templateUrl: 'home.html',
       controller: 'home'
     });
   $urlRouterProvider.otherwise('/');
$state.go('/');
 }]);