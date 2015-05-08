'use strict';

angular.module('crmDashboardApp')
  .directive('actionDirective', function ($http) {
    return {
      scope: {
        action: '='
      },
      templateUrl: 'app/main/directive/action/action.directive.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.deleteAction = function (_action) {
            var id = _action._id
            debugger
            $http.delete('/api/actions', {data: {'id':id}});
        };
      }
    };
  });