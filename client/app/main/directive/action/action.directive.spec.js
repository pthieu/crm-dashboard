'use strict';

describe('Directive: action', function () {

  // load the directive's module and view
  beforeEach(module('crmDashboardApp'));
  beforeEach(module('app/main/directive/action/action.html'));

  var element, scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<action></action>');
    element = $compile(element)(scope);
    scope.$apply();
    expect(element.text()).toBe('this is the action directive');
  }));
});