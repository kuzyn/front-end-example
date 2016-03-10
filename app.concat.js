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



  localdata.fetch().then(function(response) {
    $scope.jsonData = response;
  });


  $scope.getSelectedDate = getSelectedDate;
  $scope.resetSelectedDate = resetSelectedDate;

  function getSelectedDate() {
    return selectedDate.get();
  }

  function resetSelectedDate() {
    return selectedDate.reset();
  }

  // $scope.orderBy = orderBy;
  // $scope.addRows = addRows;
  // $scope.resetFilters = resetFilters;
  // $scope.getFilteredData = getFilteredData;

  // $scope.$watch(function () {
  //   $scope.filteredData = $scope.$eval('jsonData | orderBy:filter.orderKey | filterDateRange:selectedDate.start:selectedDate.end | limitTo:filter.rowStop:filter.rowStart');
  // });

  // function getFilteredData() {
  //     return $scope.filteredData.slice($scope.filter.rowStart, $scope.filter.rowStop);
  // }



});

evtApp.directive('datatableDir', function() {

  function link(scope, element, attrs) {

    scope.orderBy = orderBy;
    scope.resetFilters = resetFilters;
    scope.addRows = addRows;
    scope.selectedDate = scope.getSelectedDate();

    scope.filter = {
      rowStart: 0,
      rowStop: 10,
      orderKey: 'id'
    };

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

evtApp.directive('chartDir', function($timeout) {

  function link(scope, element, attrs) {
    scope.dataChart = {
      labels: [],
      series: ['Price', 'Number of days'],
      data: [
        [],
        [],
      ]
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
    //
    scope.$watchCollection('filter.rowStop', function(newValue, oldValue) {
      if ( !angular.isUndefined(newValue) && !angular.isUndefined(scope.filteredData) && newValue !== oldValue) {
      var filteredData = scope.filteredData.slice(scope.filter.rowStart, scope.filter.rowStop);
      resetChart();
      $timeout(function(){
      scope.dataChart = populateChart(filteredData);
    })
      }
    });

    scope.$watchCollection('filteredData', function(newValue, oldValue) {
      var filteredData = [];

      if ( !angular.isUndefined(newValue) && angular.isObject(newValue)) {
        filteredData = scope.filteredData.slice(scope.filter.rowStart, scope.filter.rowStop);
        resetChart();
        $timeout(function(){
          scope.dataChart = populateChart(filteredData);
        })
      }
    });

    function populateChart(data) {
      var holder = angular.copy(scope.dataChart)
      angular.forEach(data, function(item) {
      holder.labels.push(item.city);
      holder.data[0].push(item.price);
      holder.data[1].push(Math.floor((item.end_date - item.start_date) / 86400000));
      });
      return holder;
    }

    function resetChart() {
      scope.dataChart = {
        labels: [],
        series: ['Price', 'Number of days'],
        data: [
          [],
          [],
        ]
      };
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
    scope.resetState = resetState;
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
