var evtApp = angular.module('evtApp', []);

evtApp.run(function($rootScope){
  // $rootScope.data = JSON.parse('app/components/data/data.json');
  $rootScope.data = {
    "hello": "world",
    "foo": 0,
    "bar": true
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

evtApp.controller('tableController', function(){
});

evtApp.directive('datatable', function() {
  return {
        restrict: 'E',
        template: '<p>datatable!</p>',
        scope: {},
        controller: function() {
          console.log("datatable-booma!");
        }
    };
});

evtApp.directive('datepicker', function() {
  return {
        restrict: 'E',
        templateUrl: 'app/shared/datepicker/datepickerView.html',
        scope: {},
        controller: function() {
          console.log("picker-booma!");
        }
    };
});
