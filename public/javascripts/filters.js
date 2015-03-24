var taskFilters = angular.module('taskFilters', []);
taskFilters.filter('isDeadline', function(){
    return function(ISODate){
        return Date.parse(ISODate) < Date.now();
    }
});