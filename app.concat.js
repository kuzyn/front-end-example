// module
var evtApp = angular.module('evtApp', ['txx.diacritics', 'chart.js']);

// INIT
evtApp.run(function($rootScope, $rootElement, localdata) {
  $rootScope.appName = $rootElement.attr('ng-app');
  localdata.fetch().then(function(response) {
    $rootScope.jsonData = response;
  });
});


// FACTORIES
evtApp.factory('localdata', function($timeout, $http, removeDiacritics) {
  var promise = {
    fetch: function() {
      return $timeout(function() {
        return $http.get('./app/data/data.json').then(function(response) {
          return parseJson(response.data);
        });
      }, 30);
    }
  };
  return promise;

  // parse helper
  function parseJson(data) {
    angular.forEach(data, function(row) { // we parse our dates & floats
      if (!row.city.charAt(0).match(/\w/)) {
        var splitString = row.city.match(/(.)(.+)/);
        row.city = removeDiacritics.replace(splitString[1]) + splitString[2]; // only remove the diacritic from the leading char
      }
      row.price = parseFloat(row.price).toFixed(2);
      row.start_date = Date.parse(row.start_date);
      row.end_date = Date.parse(row.end_date);
    });
    return data;
  }
});


// FILTERS
evtApp.filter('sanitizeTitle', function() {
  return function(input) {
    var letter = input.charAt(0).toUpperCase();
    var out = [];

    for (var i = 0; i < input.length; i++) {

      if (i === 0) {
        out.push(letter);
      } else {
        out.push(input[i]);
      }

    }
    return out.join('').replace('_', ' ');
  };
});

evtApp.controller('chartController', function($scope) {
  $scope.labels = ["January", "February", "March", "April", "May", "June", "July"];
  $scope.series = ['Series A', 'Series B'];
  $scope.data = [
    [65, 59, 80, 81, 56, 55, 40],
    [28, 48, 40, 19, 86, 27, 90]
  ];
  $scope.onClick = onClick;

  function onClick(points, evt) {
    console.log(points, evt);
  }
});

evtApp.directive('evtChart', function() {
  return {
        restrict: 'E',
        templateUrl: './app/components/chart/chartView.html',
        controller: 'chartController'
    };
});

evtApp.controller('tableController', function($scope) {
  $scope.rowLimit = 10;
  $scope.orderKey = 'id';
  $scope.date = {
    start: Date.parse("4/13/2013"),
    end: Date.parse("3/2/2014")
  };
  $scope.orderBy = orderBy;
  $scope.addRows = addRows;

  function orderBy(key) {
    if ($scope.orderKey === key) {
      $scope.orderKey = '-' + key;
    } else {
      $scope.orderKey = key;
    }
  }

  function addRows(number) {
    if (!number) {
      $scope.rowLimit = 10;
      $scope.orderKey = 'id';
    } else {
      $scope.rowLimit += number;
    }
  }
  
});

evtApp.directive('evtDatatable', function() {
  return {
    restrict: 'E',
    templateUrl: './app/components/datatable/datatableView.html',
    controller: 'tableController'
  };
});

evtApp.directive('evtDatepicker', function() {
  return {
    restrict: 'E',
    templateUrl: './app/shared/datepicker/datepickerView.html',
    scope: {},
    controller: function() {
      console.log("picker-booma!");
    }
  };
});
