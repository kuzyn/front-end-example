evtApp.directive('chartDir', function() {
  return {
        restrict: 'E',
        templateUrl: './app/components/chart/chartView.html',
        controller: 'chartCtrl'
    };
});
