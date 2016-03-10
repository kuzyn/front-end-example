evtApp.controller('datatableCtrl', function($scope, selectedDate, localdata) {
  // $scope.jsonData = {};
  // $scope.filteredData = {};

  // fetch our data and expose it
  localdata.fetch().then(function(response) {
    $scope.jsonData = response;
  });

  $scope.getSelectedDate = getSelectedDate;
  $scope.resetSelectedDate = resetSelectedDate;

  // get our datepicker dates
  function getSelectedDate() {
    return selectedDate.get();
  }

  // reset our datepicker dates
  function resetSelectedDate() {
    return selectedDate.reset();
  }

});
