evtApp.directive('chart', function() {
  return {
        restrict: 'E',
        template: '<p>chart!</p>',
        scope: {},
        controller: function() {
          console.log("chart-booma!");
        }
    };
});
