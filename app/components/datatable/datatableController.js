evtApp.controller('tableController', function($scope, myCache, localdata, removeDiacritics){
  $scope.rowLimit = 10;
  $scope.orderKey = 'id';

  $scope.orderBy = function(key) {
    if ($scope.orderKey === key) {
      $scope.orderKey = '-'+key;
    } else {
      $scope.orderKey = key;
    }
  };

  $scope.addRows = function(number) {
    if (!number) {
      $scope.rowLimit = 10;
    } else {
      $scope.rowLimit += number;
    }
  };


  var cache = myCache.get('data');

  if (myCache.get('data')) { // If there’s something in the cache, use it!
    $scope.jsonData = cache;
  }
  else { // Otherwise, let’s generate a new instance
    localdata.fetch().then(function(response) {
      angular.forEach(response, function (row) { // we parse our dates & floats
        row.city = removeDiacritics.replace(row.city);
        row.price = parseFloat(row.price).toFixed(2);
        row.start_date = Date.parse(row.start_date);
        row.end_date = Date.parse(row.end_date);
      });
      myCache.put('data', response);
      $scope.jsonData = myCache.get('data');
    });
  }
});

// // Displays data on page
// myApp.controller('myController', ['$scope', 'myCache',
//
// function ($scope, myCache) {
//   var cache = myCache.get('myData');
//
//   if (cache) { // If there’s something in the cache, use it!
//     $scope.variable = cache;
//   }
//   else { // Otherwise, let’s generate a new instance
//     myCache.put(‘myData’, 'This is cached data!');
//     $scope.variable = myCache.get('myData');
//   }
// }
//
// ]);
