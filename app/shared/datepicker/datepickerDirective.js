evtApp.directive('datepickerDir', function($timeout) {

  function link(scope, element, attrs) {
    scope.resetDate = resetDate;
    function resetDate() {
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
