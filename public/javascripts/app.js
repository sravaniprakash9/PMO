var app = angular.module('Home', ['ngRoute']);

app.config([$routeProvider, function($routeProvider) {
    $routeProvider.
      when('/home', { 
        templateUrl: 'partials/home.html', 
        controller:  home 
      }).
      otherwise({ 
        redirectTo: '/index' 
      });
  }]);