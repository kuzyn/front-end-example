evtApp.controller('datatableCtrl', function($scope) {
  $scope.rowLimit = 10;
  $scope.orderKey = 'id';
  $scope.date = {
    start: Date.parse("4/13/2013"),
    end: Date.parse("3/2/2014")
  };
  $scope.fromDate;
  $scope.toDate;
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
    } else {
      $scope.rowLimit += number;
    }
  }

});
