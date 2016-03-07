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
      var start_date = Date.parse(row.start_date);
      var end_date = Date.parse(row.end_date);

      if (!row.city.charAt(0).match(/\w/)) {
        var splitString = row.city.match(/(.)(.+)/);
        row.city = removeDiacritics.replace(splitString[1]) + splitString[2]; // only remove the diacritic from the leading char
      }

      if (start_date > end_date) {
        row.start_date = end_date;
        row.end_date = start_date;
      } else {
        row.start_date = start_date;
        row.end_date = end_date;
      }

      row.price = parseFloat(row.price).toFixed(2);
    });
    return data;
  }
});

evtApp.factory('selectedDate', function () {
    var data = {
      start: undefined,
      end: undefined
    };
    return data;
});

evtApp.factory('selectedDate', function () {
    var data = {
      start: undefined,
      end: undefined
    };
    return data;
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

evtApp.filter('filterDateRange', function() {
  return function(input, start, end) {
    var out = [];
    var pickerStart = Date.parse(start);
    var pickerEnd = Date.parse(end);

    if (angular.isUndefined(start) || angular.isUndefined(end)) {
      return input;
    }

    angular.forEach(input, function(row) {
      if (row.start_date >= pickerStart && row.end_date <= pickerEnd) {
        out.push(row)
      }
    });
    return out

  };
});

evtApp.controller('chartCtrl', function($scope) {
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

evtApp.directive('chartDir', function() {
  return {
        restrict: 'E',
        templateUrl: './app/components/chart/chartView.html',
        controller: 'chartCtrl'
    };
});

evtApp.directive('datepickerDir', function() {
  return {
    restrict: 'E',
    templateUrl: './app/shared/datepicker/datepickerView.html'
  };
});

evtApp.controller('datatableCtrl', function($scope, selectedDate) {
  $scope.rowLimit = 10;
  $scope.orderKey = 'id';
  $scope.date = selectedDate;

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
      $scope.date = {
        start: undefined,
        end: undefined
      };
    } else {
      $scope.rowLimit += number;
    }
  }

});

evtApp.directive('datatableDir', function() {
  return {
    restrict: 'E',
    templateUrl: './app/components/datatable/datatableView.html',
    controller: 'datatableCtrl'
  };
});
