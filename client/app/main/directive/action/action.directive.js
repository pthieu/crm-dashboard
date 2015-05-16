'use strict';

angular.module('crmDashboardApp')
  .directive('actionDirective', function ($http, $interval, $timeout, RecursionHelper) {
    return {
      scope: {
        actionId: '=', // html:action-node, js:actionNode
        actionList: '='
      },
      templateUrl: 'app/main/directive/action/action.directive.html',
      replace: true,
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

          // Declare and initialize self-invoking function
          (function calculateTimeSince(){
            scope.fromNow = moment(scope.actionNode.content).fromNow(true); // moment.js will handle output format depending on length of time passed
            // scope.fromNow = moment().diff(scope.actionNode.content, 'days') // will always output in days
            $timeout(calculateTimeSince, 1000); // we use $timeout because it syncs the view with the model and updates with $apply. setTimeout will not work here.
          })();
        });
      }
    };
  });