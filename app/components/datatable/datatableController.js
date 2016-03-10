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
