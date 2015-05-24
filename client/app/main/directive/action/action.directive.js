'use strict';

angular.module('crmDashboardApp')
  .directive('actionDirective', function($http, $interval, $timeout, RecursionHelper) {
    return {
      scope: {
        actionId: '=', // html:action-node, js:actionNode
        actionList: '='
      },
      templateUrl: 'app/main/directive/action/action.directive.html',
      replace: true,
      restrict: 'E',
      compile: function(element) {
        return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn) {
          scope.deleteAction = function(e, _action) {
            e.stopPropagation();

            var id = _action._id;
            $http.delete('/api/actions', {
              data: {
                'id': id
              },
              headers: {
                'Content-Type': 'application/json;charset=utf-8'
              } // we need to do this if we want to send params, otherwise we need to do traditional REST in URL
            });
          };
          // GETS for API -- TODO: do we need to finish getAction? we already have entire list of actions
          // scope.getAction = function (_id) {
          //   var id = _id;
          //   $http.get('/api/actions', {'id':id}).success(function (a,b,c) {
          //   });
          // };
          // Find for already called action list
          scope.findAction = function(_id, _list) {
            scope.actionNode = _.findWhere(_list, {
              _id: _id
            });
          };
          scope.findAction(scope.actionId, scope.actionList);

          // Switch case for type of action, we want to show different types of information for each
          switch(scope.actionNode.type){
            case 1:
              // Declare and initialize self-invoking function
              (function calculateTimeSince() {
                scope.content = moment(scope.actionNode.content).fromNow(true); // moment.js will handle output format depending on length of time passed
                // scope.content = moment().diff(scope.actionNode.content, 'days') // will always output in days
                // Below timeout is a recursive algorithm and will keep calling calculateTimeSince() until we stop it
                $timeout(calculateTimeSince, 1000); // we use $timeout because it syncs the view with the model and updates with $apply. setTimeout will not work here.
              })();
              break;
            case 3:
              scope.content = scope.actionNode.content;
              break;
          }
          scope.newChildAction = function(e) {
            e.stopPropagation();
          };

          // BEGIN datepicker logic
          scope.today = function() {
            scope.dt = new Date();
          };
          scope.today();

          scope.clear = function() {
            scope.dt = null;
          };

          // Disable weekend selection
          scope.disabled = function(date, mode) {
            return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6));
          };

          scope.toggleMin = function() {
            scope.minDate = scope.minDate ? null : new Date();
          };
          scope.toggleMin();

          scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();

            scope.opened = true;
          };

          scope.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
          };

          scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
          scope.format = scope.formats[0];

          var tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          var afterTomorrow = new Date();
          afterTomorrow.setDate(tomorrow.getDate() + 2);
          scope.events = [{
            date: tomorrow,
            status: 'full'
          }, {
            date: afterTomorrow,
            status: 'partially'
          }];

          scope.getDayClass = function(date, mode) {
            if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0, 0, 0, 0);

              for (var i = 0; i < scope.events.length; i++) {
                var currentDay = new Date(scope.events[i].date).setHours(0, 0, 0, 0);

                if (dayToCheck === currentDay) {
                  return scope.events[i].status;
                }
              }
            }
            return '';
          };
          // END datepicker logic
        });
      }
    };
  });
