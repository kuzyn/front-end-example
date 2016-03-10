evtApp.directive('datepickerDir', function($timeout) {

  function link(scope, element, attrs) {
    scope.resetState = resetState;

    // link our controller 'resetFilters' function
    function resetState() {
      $timeout(function() {
        scope.resetFilters();
      });
    }
  }

  return {
    restrict: 'E',
    templateUrl: './app/shared/datepicker/datepickerView.html',
    link: link
  };
});
