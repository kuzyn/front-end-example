evtApp.directive('datatableDir', function() {

  function link(scope, element, attrs) {

    scope.selectedDate = scope.getSelectedDate();
    scope.filter = {
      rowStart: 0,
      rowStop: 10,
      orderKey: 'id'
    };

    // expose our functions
    scope.orderBy = orderBy;
    scope.resetFilters = resetFilters;
    scope.addRows = addRows;

    function orderBy(key) {
      if (scope.filter.orderKey === key) {
        scope.filter.orderKey = '-' + key;
      } else {
        scope.filter.orderKey = key;
      }
    }

    function resetFilters() {
      scope.filter = {
        rowStart: 0,
        rowStop: 10,
        orderKey: 'id'
      };
      scope.selectedDate = scope.resetSelectedDate();
    }

    function addRows(number) {
      scope.filter.rowStop += number;
    }
  }

  return {
    restrict: 'E',
    templateUrl: './app/components/datatable/datatableView.html',
    controller: 'datatableCtrl',
    link: link
  };
});
