(function(){
var evtApp = angular.module('evtApp', []);

evtApp.run(function($rootScope, localdata){
    localdata.fetch().then(function(data) {
      $rootScope.data = data;
    });
});

evtApp.factory('localdata', function($timeout, $http) {
    var request = {
        fetch: function() {
            return $timeout(function() {
                return $http.get('./app/data/data.json').then(function(response) {
                    return response.data;
                });
            }, 30);
        }
    };
    return request;
});
})();
