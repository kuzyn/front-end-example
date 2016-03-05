var evtApp = angular.module('evtApp', ['txx.diacritics']);
evtApp.run(function(){
});

// Set up the cache ‘myCache’
evtApp.factory('myCache', function($cacheFactory) {
 return $cacheFactory('myData');
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

evtApp.controller('tableController', function($scope, myCache, localdata, removeDiacritics){
  $scope.rowLimit = 10;
  $scope.orderKey = 'id';

  $scope.orderBy = function(key) {
    if ($scope.orderKey === key) {
      $scope.orderKey = '-'+key;
    } else {
      $scope.orderKey = key;
    }
  };

  $scope.addRows = function(number) {
    if (!number) {
      $scope.rowLimit = 10;
    } else {
      $scope.rowLimit += number;
    }
  };


  var cache = myCache.get('data');

  if (myCache.get('data')) { // If there’s something in the cache, use it!
    $scope.jsonData = cache;
  }
  else { // Otherwise, let’s generate a new instance
    localdata.fetch().then(function(response) {
      angular.forEach(response, function (row) { // we parse our dates & floats
        if (!row.city.charAt(0).match(/\w/)) {
          var splitString = row.city.match(/(.)(.+)/);
          row.city = removeDiacritics.replace(splitString[1]) + splitString[2]; // only remove the diacritic from the leading char
        }
        row.price = parseFloat(row.price).toFixed(2);
        row.start_date = Date.parse(row.start_date);
        row.end_date = Date.parse(row.end_date);
      });
      myCache.put('data', response);
      $scope.jsonData = myCache.get('data');
    });
  }
});

// // Displays data on page
// myApp.controller('myController', ['$scope', 'myCache',
//
// function ($scope, myCache) {
//   var cache = myCache.get('myData');
//
//   if (cache) { // If there’s something in the cache, use it!
//     $scope.variable = cache;
//   }
//   else { // Otherwise, let’s generate a new instance
//     myCache.put(‘myData’, 'This is cached data!');
//     $scope.variable = myCache.get('myData');
//   }
// }
//
// ]);

evtApp.directive('datatable', function() {
  return {
        restrict: 'E',
        templateUrl: './app/components/datatable/datatableView.html',
        controller: 'tableController'
    };
});
