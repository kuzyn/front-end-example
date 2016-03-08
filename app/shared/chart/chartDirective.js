evtApp.directive('chartDir', function() {

  function link(scope, element, attrs) {
    scope.onClick = onClick;
    function onClick() {
      console.log(scope.dataChart);
    }
  }

  return {
    restrict: 'E',
    templateUrl: './app/shared/chart/chartView.html',
    link: link
  };
});
