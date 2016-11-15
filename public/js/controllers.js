/**
 * Created by ionel.cucu on 24.10.2016.
 */
angular
    .module('angularRouting')
    .controller('HomepageController', ['$scope', function ($scope) {
        console.log('HomepageController initialized!');
    }])
    .controller('LoginController', ['$scope', function ($scope) {
        console.log('LoginController initialized!');
    }])
    .controller('SecurePageController', ['$scope', function ($scope) {
        console.log('SecurePageController initialized!');
    }]);