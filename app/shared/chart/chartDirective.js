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
