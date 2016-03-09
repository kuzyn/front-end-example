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
