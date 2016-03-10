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
