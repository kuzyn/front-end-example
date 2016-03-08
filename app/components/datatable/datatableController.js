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
