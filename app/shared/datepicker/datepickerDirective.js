evtApp.directive('datepicker', function() {
  return {
        restrict: 'E',
        templateUrl: './app/shared/datepicker/datepickerView.html',
        scope: {},
        controller: function() {
          console.log("picker-booma!");
        }
    };
});
