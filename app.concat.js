/////////
// APP //
/////////

// create our app module
var evtApp = angular.module('evtApp', ['txx.diacritics', 'chart.js']);

// init a global parameter
evtApp.run(function($rootScope, $rootElement) {
  $rootScope.appName = $rootElement.attr('ng-app');
});


///////////////
// FACTORIES //
///////////////

/**
 * $http get our local data file and return a promise
 * @return {object} data obj with a fetch command (which returns a promise)
 */
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

  // parse helper function
  function parseJson(data) {
    angular.forEach(data, function(row) { // we parse our dates & floats
      var start_date = Date.parse(row.start_date);
      var end_date = Date.parse(row.end_date);

      if (!row.city.charAt(0).match(/\w/)) {
        // only remove the diacritic from the leading char
        var splitString = row.city.match(/(.)(.+)/);
        row.city = removeDiacritics.replace(splitString[1]) + splitString[2];
      }

      // switch the date if end > start to make it more intellegible
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

/**
 * Makes our selectedDate available to any ctrl/dir through injection
 * @return {object} data object with get,set & reset function
 */
evtApp.factory('selectedDate', function() {

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


/////////////
// FILTERS //
/////////////

/**
 * Filter to remove '_' and capitalize table titles
 * @return {string} the sanitized title ('start_date' => 'Start date')
 */
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

/**
 * Return our input if if falls between our date picker range
 * @return {object} our input that are not filtered out
 */
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

evtApp.directive('chartDir', function($timeout) {

  function link(scope, element, attrs) {
    scope.dataChart = resetChart();

    // reset & redraw our chart
    function redrawChart(newdata) {
      $timeout(function() {
        scope.dataChart = resetChart();
        scope.dataChart = populateChart(newdata);
      });
    }

    // return a populated object with our chart data
    function populateChart(data) {
      var chartDataObj = angular.copy(scope.dataChart);
      angular.forEach(data, function(item) {
        chartDataObj.labels.push(item.city);
        chartDataObj.data[0].push(item.price);
        chartDataObj.data[1].push(Math.floor((item.end_date - item.start_date) / 86400000));
      });
      return chartDataObj;
    }

    // return a resetted chart
    function resetChart() {
      return {
        labels: [],
        series: ['Price', 'Number of days'],
        data: [
          [],
          [],
        ]
      };
    }

    /////////////
    // WATCHES //
    /////////////

    // watch our filter values and redraw our graph if it changes
    scope.$watchCollection('filter', function(newValue, oldValue) {
      if (!angular.isUndefined(newValue) && !angular.isUndefined(scope.filteredData) && newValue !== oldValue) {
        var filteredData = scope.filteredData.slice(scope.filter.rowStart, scope.filter.rowStop);
        redrawChart(filteredData);
      }
    });

    // watch our filtered data and redraw if it changes
    scope.$watchCollection('filteredData', function(newValue, oldValue) {
      if (!angular.isUndefined(newValue) && angular.isObject(newValue) && newValue !== oldValue) {
        var filteredData = scope.filteredData.slice(scope.filter.rowStart, scope.filter.rowStop);
        redrawChart(filteredData);
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
    scope.resetState = resetState;

    // link our controller 'resetFilters' function
    function resetState() {
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

evtApp.controller('datatableCtrl', function($scope, selectedDate, localdata) {
  // $scope.jsonData = {};
  // $scope.filteredData = {};

  // fetch our data and expose it
  localdata.fetch().then(function(response) {
    $scope.jsonData = response;
  });

  $scope.getSelectedDate = getSelectedDate;
  $scope.resetSelectedDate = resetSelectedDate;

  // get our datepicker dates
  function getSelectedDate() {
    return selectedDate.get();
  }

  // reset our datepicker dates
  function resetSelectedDate() {
    return selectedDate.reset();
  }

});

evtApp.directive('datatableDir', function() {

  function link(scope, element, attrs) {

    scope.selectedDate = scope.getSelectedDate();
    scope.filter = {
      rowStart: 0,
      rowStop: 10,
      orderKey: 'id'
    };

    // expose our functions
    scope.orderBy = orderBy;
    scope.resetFilters = resetFilters;
    scope.addRows = addRows;

    function orderBy(key) {
      if (scope.filter.orderKey === key) {
        scope.filter.orderKey = '-' + key;
      } else {
        scope.filter.orderKey = key;
      }
    }

    function resetFilters() {
      scope.filter = {
        rowStart: 0,
        rowStop: 10,
        orderKey: 'id'
      };
      scope.selectedDate = scope.resetSelectedDate();
    }

    function addRows(number) {
      scope.filter.rowStop += number;
    }
  }

  return {
    restrict: 'E',
    templateUrl: './app/components/datatable/datatableView.html',
    controller: 'datatableCtrl',
    link: link
  };
});
