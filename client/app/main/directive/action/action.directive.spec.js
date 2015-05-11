'use strict';

describe('Directive: action', function () {

  // load the directive's module and view
  beforeEach(module('crmDashboardApp'));
  beforeEach(module('app/main/directive/action/action.directive.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<action-directive></action-directive>');
    element = $compile(element)(scope);
    scope.$apply();
    // Matching general structure of the directive
    expect(element.html()).toMatch(/<header([\s\S]*?<p){8}[\s\S]*?<form[\s\S]*?<\/form>/i);
  }));
});