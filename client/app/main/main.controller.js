// client/app/main.controller.js
 
'use strict';
 
angular.module('crmDashboardApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $scope.newComment = '';

    // Grab the initial set of available comments
    $http.get('/api/comments').success(function(comments) {
      $scope.comments = comments;
 
      // Update array with any new or deleted items pushed from the socket
      socket.syncUpdates('comment', $scope.comments, function(event, comment, comments) {
        // This callback is fired after the comments array is updated by the socket listeners
 
        // sort the array every time its modified
        comments.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a>b ? -1 : a<b ? 1 : 0;
        });
      });
    });
 
    // Clean up listeners when the controller is destroyed
    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('comment');
      socket.unsyncUpdates('action');
    });
 
    // Use our rest api to post a new comment
    $scope.addComment = function() {
      $http.post('/api/comments', { content: $scope.newComment });
      $scope.newComment = '';
    };


    // Grab the initial set of available comments
    $http.get('/api/actions').success(function(actions) {
      $scope.actions = actions;
 
      // Update array with any new or deleted items pushed from the socket
      socket.syncUpdates('action', $scope.actions, function(event, action, actions) {
        console.log([event, action, actions]); // TODO: remove this, jshint does not like unused variables
        // This callback is fired after the actions array is updated by the socket listeners
      });
    });

    $scope.addAction = function() {
      $http.post('/api/actions', {
        title: $scope.newActionTitle,
        description: $scope.newActionDescription,
        duration_type: $scope.newActionDurationType,
        type: $scope.newActionType.value
      });
      $scope.newComment = '';
    };
    $scope.options = {
      type: [
        {'value': 1, 'text': 'Time Since'},
        // {'value': 2, 'text': 'Time Until'},
        {'value': 3, 'text': 'Countup'}
        // {'value': 4, 'text': 'Countdown'}
    ]};
    $scope.newActionType = $scope.options.type[0];
  });
