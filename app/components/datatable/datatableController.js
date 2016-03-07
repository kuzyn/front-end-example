evtApp.controller('datatableCtrl', function($scope, selectedDate) {
  $scope.rowLimit = 10;
  $scope.orderKey = 'id';
  $scope.date = selectedDate;

  $scope.orderBy = orderBy;
  $scope.addRows = addRows;

  function orderBy(key) {
    if ($scope.orderKey === key) {
      $scope.orderKey = '-' + key;
    } else {
      $scope.orderKey = key;
    }
  }

  function addRows(number) {
    if (!number) {
      $scope.rowLimit = 10;
      $scope.orderKey = 'id';
      $scope.date = {
        start: undefined,
        end: undefined
      };
    } else {
      $scope.rowLimit += number;
    }
  }

});
