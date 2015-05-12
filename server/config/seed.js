/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var Thing = require('../api/thing/thing.model');
var User = require('../api/user/user.model');
var Action = require('../api/action/action.model');

// Thing.find({}).remove(function() {
//   Thing.create({
//     name : 'Development Tools',
//     info : 'Integration with popular tools such as Bower, Grunt, Karma, Mocha, JSHint, Node Inspector, Livereload, Protractor, Jade, Stylus, Sass, CoffeeScript, and Less.'
//   }, {
//     name : 'Server and Client integration',
//     info : 'Built with a powerful and fun stack: MongoDB, Express, AngularJS, and Node.'
//   }, {
//     name : 'Smart Build System',
//     info : 'Build system ignores `spec` files, allowing you to keep tests alongside code. Automatic injection of scripts and styles into your index.html'
//   },  {
//     name : 'Modular Structure',
//     info : 'Best practice client and server structures allow for more code reusability and maximum scalability'
//   },  {
//     name : 'Optimized Build',
//     info : 'Build process packs up your templates as a single JavaScript payload, minifies your scripts/css/images, and rewrites asset names for caching.'
//   },{
//     name : 'Deployment Ready',
//     info : 'Easily deploy your app to Heroku or Openshift with the heroku and openshift subgenerators'
//   });
// });

// User.find({}).remove(function() {
//   User.create({
//     provider: 'local',
//     name: 'Anonymous',
//     email: 'test@test.com',
//     password: 'test'
//   }, {
//     provider: 'local',
//     role: 'admin',
//     name: 'Admin',
//     email: 'admin@admin.com',
//     password: 'admin'
//   }, function() {
//       console.log('finished populating users');
//     }
//   );
// });

Action.find({}).remove(function () {
  Action.create({
    _id: '000000000000000000000001',
    title: 'Test action title',
    description: 'Test action description',
    content: 1430712335028,
    children:['000000000000000000000002', '000000000000000000000003'],
    nest_level: 0,
    duration_type: 2,
    type: 1,
    active: true
  });
  Action.create({
    _id: '000000000000000000000002',
    title: 'Test action child 1',
    description: 'Test action child description',
    content: 1430712335028,
    nest_level: 1,
    duration_type: 2,
    type: 1,
    active: true
  });
  Action.create({
    _id: '000000000000000000000003',
    title: 'Test action child 1',
    description: 'Test action child description',
    content: 1430712335028,
    nest_level: 1,
    duration_type: 2,
    type: 1,
    active: true
  });
});
// Action.create({
//   title: 'Test child action title',
//   description: 'Test child action description',
//   content: 1430712335028,
//   duration_type: 2,
//   type: 1,
//   active: true
// });