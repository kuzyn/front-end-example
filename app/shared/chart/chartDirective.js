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
