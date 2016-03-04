var evtApp = angular.module('evtApp', []);

evtApp.run(function(){
});

// Set up the cache ‘myCache’
evtApp.factory('myCache', function($cacheFactory) {
 return $cacheFactory('myData');
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
