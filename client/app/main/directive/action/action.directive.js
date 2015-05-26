'use strict';

angular.module('crmDashboardApp')
  .directive('actionDirective', function($http, $interval, $timeout, RecursionHelper, $compile) {
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
          scope.edit_mode = false;
          scope.newChild_mode = false;
          scope.actionNode_expanded = true;
          scope.options = {
            type: [
              {'value': 1, 'text': 'Time Since'},
              // {'value': 2, 'text': 'Time Until'},
              {'value': 3, 'text': 'Count'}
              // {'value': 4, 'text': 'Countdown'}
          ]};
          scope.newActionType = scope.options.type[0];

          // Utility function to see if child exists within array
          scope.childExists = function (_id, _list) {
            var exists = (_.findIndex(_list, function (_action) {
              return _action._id === _id;
            }) >= 0); // Returns true if index found (>=0), else -1
            return exists;
          };

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
          scope.findAction = function(_id, _list, _cb) {
            scope.actionNode = _.findWhere(_list, {
              _id: _id
            });
          };
          scope.findAction(scope.actionId, scope.actionList)

          scope.addChildAction = function (_action) {
            $http.post('/api/actions/'+_action._id, {
              title: scope.newActionTitle
            });

            // Reset view
            scope.newActionTitle = '' // Clear input
            scope.edit_mode = false;
            scope.show_action_options = false;
          };

          // For changing fields of actionNode
          scope.editActionNode = function (_action) {
            var title = scope.newActionTitle;

            $http.patch('/api/actions/'+_action._id, {
              'title': title
            });

            // Reset view
            scope.newActionTitle = '' // Clear input
            scope.edit_mode = false;
            scope.newChild_mode = false;
            scope.show_action_options = false;
          };

          // For reset/incrementing actionNode.content
          scope.updateActionNode = function (_action) {
            var id = _action._id;
            $http.put('/api/actions', {
              'id': id
            });
          };

          scope.disableAllOptions = function (event) {
            event.stopPropagation();

            scope.show_action_options = false;
            scope.edit_mode = false;
            scope.newChild_mode = false;
            scope.newActionTitle = '';
          };

          scope.enableEditMode = function (event) {
            event.stopPropagation();

            scope.edit_mode = !scope.edit_mode;
            scope.newChild_mode=false;
            scope.newActionTitle = scope.actionNode.title;
          };
          scope.enableNewChildMode = function () {
            scope.newActionTitle = '';
            scope.newChild_mode = !scope.newChild_mode;
            scope.edit_mode = false;
          };

          // Switch case for type of action, we want to show different types of information for each
          switch(scope.actionNode.type){
            case 1:
              // This is for root-level initial load
              // Declare and initialize self-invoking function
              (function calculateTimeSince() {
                scope.content = moment(scope.actionNode.content).fromNow(true); // moment.js will handle output format depending on length of time passed
                // scope.content = moment().diff(scope.actionNode.content, 'days') // will always output in days
                scope.actionNode_content_to_date = moment(scope.actionNode.content).format('ddd DD/MM/YYYY h:mm a');
                // Below timeout is a recursive algorithm and will keep calling calculateTimeSince() until we stop it.
                // Purpose of this is to update the text of the timed actionNodes every minute (because text will change depending on how long it's been)
                $timeout(calculateTimeSince, 60*1000); // we use $timeout because it syncs the view with the model and updates with $apply. setTimeout will not work here.
              })();
              scope.update_actionNode_text = 'Reset';
              break;
            case 3:
              scope.content = scope.actionNode.content;
              scope.update_actionNode_text = 'Increment';
              break;
          }

          // Set up a watcher for nest_level>0 to update scope.content with scope.actionNode.content whenever that gets changed
          // For some reason, the nested elements don't update when socket is called
          if (scope.actionNode.nest_level>0){
            scope.$watch(function () {
              return scope.actionList;
            }, function (n,o) {
              scope.findAction(scope.actionId, scope.actionList);
              switch(scope.actionNode.type){
                case 1:
                  scope.content = moment(scope.actionNode.content).fromNow(true);
                  scope.actionNode_content_to_date = moment(scope.actionNode.content).format('ddd DD/MM/YYYY h:mm a');
                  break;
                case 3:
                  scope.content = scope.actionNode.content;
                  break;
              }
            }, true);
          }

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
