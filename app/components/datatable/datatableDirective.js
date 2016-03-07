evtApp.directive('datatableDir', function() {
  return {
    restrict: 'E',
    templateUrl: './app/components/datatable/datatableView.html',
    controller: 'datatableCtrl'
  };
});
