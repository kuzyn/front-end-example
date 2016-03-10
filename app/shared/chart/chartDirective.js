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

    scope.$watchCollection('filter.rowStop', function(newValue, oldValue) {
      if (!angular.isUndefined(newValue) && !angular.isUndefined(scope.filteredData) && newValue !== oldValue) {
        var filteredData = scope.filteredData.slice(scope.filter.rowStart, scope.filter.rowStop);
        resetChart();
        $timeout(function() {
          scope.dataChart = populateChart(filteredData);
        })
      }
    });

    scope.$watchCollection('filteredData', function(newValue, oldValue) {
      var filteredData = [];

      if (!angular.isUndefined(newValue) && angular.isObject(newValue)) {
        filteredData = scope.filteredData.slice(scope.filter.rowStart, scope.filter.rowStop);
        resetChart();
        $timeout(function() {
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
