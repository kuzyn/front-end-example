// module
var evtApp = angular.module('evtApp', ['txx.diacritics', 'chart.js']);

// INIT
evtApp.run(function($rootScope, $rootElement) {
  $rootScope.appName = $rootElement.attr('ng-app');
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
      stop: undefined
    };

    return {

      reset: function() {
        data.start = undefined;
        data.end = undefined;
        return data;
      },

      set: function(start, end) {
        data.start = start;
        data.end = end;
        return data;
      },

      get: function() {
        return data;
      }
    };
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
        out.push(row);
      }
    });
    return out;

  };
});

evtApp.controller('datatableCtrl', function($scope, selectedDate, localdata) {
  // $scope.jsonData = {};
  // $scope.filteredData = {};

  $scope.filter = {
    rowStart: 0,
    rowStop: 10,
    orderKey: 'id'
  };

  localdata.fetch().then(function(response) {
    $scope.jsonData = response;
  });

  $scope.selectedDate = selectedDate.get();

  $scope.orderBy = orderBy;
  $scope.addRows = addRows;
  $scope.resetFilters = resetFilters;
  // $scope.getFilteredData = getFilteredData;

  // $scope.$watch(function () {
  //   $scope.filteredData = $scope.$eval('jsonData | orderBy:filter.orderKey | filterDateRange:selectedDate.start:selectedDate.end | limitTo:filter.rowStop:filter.rowStart');
  // });

  // function getFilteredData() {
  //     return $scope.filteredData.slice($scope.filter.rowStart, $scope.filter.rowStop);
  // }

  function orderBy(key) {
    if ($scope.filter.orderKey === key) {
      $scope.filter.orderKey = '-' + key;
    } else {
      $scope.filter.orderKey = key;
    }
  }

  function resetFilters() {
    $scope.filter = {
      rowStart: 0,
      rowStop: 10,
      orderKey: 'id'
    };
    $scope.selectedDate = selectedDate.reset();
  }

  function addRows(number) {
    if (!number) {
    } else {
      $scope.filter.rowStop += number;
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

evtApp.directive('chartDir', function() {

  function link(scope, element, attrs) {
    scope.dataChart = {
      labels: [],
      series: ['Price', 'Number of days'],
      data: [
        [],
        [],
      ],
      colours: []
    };
    //TEMP
    // scope.dataChart = {
    //   labels: ["January", "February", "March", "April", "May", "June", "July"],
    //   series: ['Series A', 'Series B'],
    //   data: [
    //     [65, 59, 80, 81, 56, 55, 40],
    //     [28, 48, 40, 19, 86, 27, 90]
    //   ]
    // };
    // {"id":1,"city":"Neftegorsk","start_date":"4/13/2013","end_date":"5/18/2013","price":"55.82","status":"Seldom","color":"#fd4e19"}
    //TEMP

    scope.$watchCollection('filteredData', function(newValue, oldValue) {
      if (angular.isObject(scope.filteredData)) {
        // console.log(scope.filteredData.slice(scope.filter.rowStart, scope.filter.rowStop));
        angular.forEach(scope.filteredData.slice(scope.filter.rowStart, scope.filter.rowStop), function(item) {
          scope.dataChart.labels.push(item.city);
          scope.dataChart.data[0].push(item.price);
          scope.dataChart.data[1].push(Math.floor((item.end_date - item.start_date) / 86400000));
        });
        console.log(scope.dataChart)
      }
    });

  }

  return {
    restrict: 'E',
    templateUrl: './app/shared/chart/chartView.html',
    link: link
  };
});

evtApp.directive('datepickerDir', function($timeout) {

  function link(scope, element, attrs) {
    scope.resetDate = resetDate;
    function resetDate() {
      $timeout(function() {
        scope.resetFilters();
      });
    }
  }

  return {
    restrict: 'E',
    templateUrl: './app/shared/datepicker/datepickerView.html',
    link: link
  };
});
