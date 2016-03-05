evtApp.directive('evtChart', function() {
  return {
        restrict: 'E',
        templateUrl: './app/components/chart/chartView.html',
        controller: 'chartController'
    };
});
