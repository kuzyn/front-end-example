evtApp.controller('datatableCtrl', function($scope, selectedDate, localdata) {
  $scope.jsonData = {};
  $scope.filteredData = {};

  $scope.filter = {
    rowStart: 0,
    rowStop: 10,
    orderKey: 'id'
  };

  $scope.chartData = {
    dataPoints: 0,
    sampleSize: 0,
    labels: [],
    series: [],
    prices: [],
    pricesAvg: []
  };

  //TEMP
  $scope.dataChart = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    series: ['Series A', 'Series B'],
    data: [
      [65, 59, 80, 81, 56, 55, 40],
      [28, 48, 40, 19, 86, 27, 90]
    ]
  };
  //TEMP

  localdata.fetch().then(function(response) {
    $scope.jsonData = response;
  });

  $scope.selectedDate = selectedDate.get();

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
    $scope.selectedDate = selectedDate.reset();
  }

  function addRows(number) {
    if (!number) {
    } else {
      $scope.filter.rowStop += number;
    }
  }

});
