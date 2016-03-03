var evtApp = angular.module('evtApp', []);

evtApp.run(function($rootScope, localdata){
    localdata.fetch().then(function(data) {
      $rootScope.data = data;
    });
});

evtApp.factory('localdata', function($timeout, $http) {
    var request = {
        fetch: function() {
            return $timeout(function() {
                return $http.get('./app/data/data.json').then(function(response) {
                    return response.data;
                });
            }, 30);
        }
    };
    return request;
});

evtApp.directive('datepicker', function() {
  return {
        restrict: 'E',
        templateUrl: './app/shared/datepicker/datepickerView.html',
        scope: {},
        controller: function() {
          console.log("picker-booma!");
        }
    };
});

evtApp.controller('chartController', function(){
});

evtApp.directive('chart', function() {
  return {
        restrict: 'E',
        template: '<p>chart!</p>',
        scope: {},
        controller: function() {
          console.log("chart-booma!");
        }
    };
});

evtApp.controller('tableController', function($rootScope, $scope){
  $scope.data = $rootScope.data;
  $scope.rowLimit = 10;
});

evtApp.directive('datatable', function() {
  return {
        restrict: 'E',
        templateUrl: './app/components/datatable/datatableView.html',
        controller: 'tableController'
    };
});
