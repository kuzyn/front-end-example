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
        out.push(row);
      }
    });
    return out;

  };
});

evtApp.controller('datatableCtrl', function($scope, selectedDate, localdata) {
  $scope.jsonData = {};
  $scope.filteredData = {};

  $scope.filter = {
    rowStart: 0,
    rowStop: 10,
    orderKey: 'id'
  };

  //TEMP
  // $scope.dataChart = {
  //   dataPoints: 0,
  //   sampleSize: 0,
  //   labels: ["January", "February", "March", "April", "May", "June", "July"],
  //   series: ['Series A', 'Series B'],
  //   data: [
  //     [65, 59, 80, 81, 56, 55, 40],
  //     [28, 48, 40, 19, 86, 27, 90]
  //   ]
  // };
  //TEMP

  localdata.fetch().then(function(response) {
    $scope.jsonData = response;
  });

  $scope.selectedDate = selectedDate;

  $scope.orderBy = orderBy;
  $scope.addRows = addRows;
  $scope.resetFilters = resetFilters;

  // $scope.$watch(function () {
  //   $scope.filteredData = $scope.$eval("jsonData | orderBy:filter.orderKey | filterDateRange:selectedDate.start:selectedDate.end");
  // });


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
    $scope.selectedDate = {
      start: undefined,
      end: undefined
    };
    updateDataChart();
  }

  function resetDataChart() {
    console.log("reset");
    $scope.dataChart = {
      dataPoints: 0,
      sampleSize: 0,
      labels: [],
      series: ['Average Price', 'Median Price'],
      data: [
        [],
        []
      ]
    };
  }

  function updateDataChart() {
    var dataObj = $scope.dataChart;
    resetDataChart();

    angular.forEach($scope.jsonData, function(row) {
      if (dataObj.labels.indexOf(row.status) === -1) {
        dataObj.labels.push(row.status);
      } else {

      }
    });

  }

// {"id":1,"city":"Neftegorsk","start_date":"4/13/2013","end_date":"5/18/2013","price":"55.82","status":"Seldom","color":"#fd4e19"}

  function addRows(number) {
    if (!number) {
    } else {
      $scope.filter.rowStop += number;
    }
    updateDataChart();
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
    scope.onClick = onClick;
    function onClick() {
      console.log(scope.dataChart);
    }
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
