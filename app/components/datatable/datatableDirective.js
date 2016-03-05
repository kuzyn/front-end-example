evtApp.directive('evtDatatable', function() {
  return {
    restrict: 'E',
    templateUrl: './app/components/datatable/datatableView.html',
    controller: 'tableController'
  };
});
