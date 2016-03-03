evtApp.directive('datatable', function() {
  return {
        restrict: 'E',
        template: '<p>datatable!{{data[0]}}</p>',
        controller: 'tableController'
    };
});
