'use strict';

angular.module('crmDashboardApp')
  .directive('actionDirective', function ($http, RecursionHelper) {
    return {
      scope: {
        actionId: '=', // html:action-node, js:actionNode
        actionList: '='
      },
      templateUrl: 'app/main/directive/action/action.directive.html',
      restrict: 'E',
      compile: function (element) {
        return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
          scope.deleteAction = function (_action) {
            var id = _action._id;
            $http.delete('/api/actions', {
                data: {'id':id},
                headers: {"Content-Type": "application/json;charset=utf-8"} // we need to do this if we want to send params, otherwise we need to do traditional REST in URL
              });
          };
          // GETS for API -- TODO: do we need to finish getAction? we already have entire list of actions
          // scope.getAction = function (_id) {
          //   var id = _id;
          //   $http.get('/api/actions', {'id':id}).success(function (a,b,c) {
          //   });
          // };
          // Find for already called action list
          scope.findAction = function (_id, _list) {
            scope.actionNode = _.findWhere(_list, {_id:_id})
          };

          scope.findAction(scope.actionId, scope.actionList);
        });
      }
    };
  });