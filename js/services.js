/**
 * Created by ionel.cucu on 24.10.2016.
 */
angular
    .module('angularRouting')
    .service('authenticationService', [
        'appConfig', '$http', '$q', '$location', '$timeout',
        function (appConfig, $http, $q, $location, $timeout) {
            this.isUserAuthenticated = false;
            this.pendingPromises = [];

            this.userDataPromise = $q.defer();

            this.setUserAuthenticated = function (value) {
                this.isUserAuthenticated = value;
            };

            this.getUserAuthenticated = function () {
                return this.isUserAuthenticated;
            };

            this.getRequireLoginForPage = function (page) {
                var index, route;
                for (index in appConfig.routes) {
                    route = appConfig.routes[index];
                    if (route.path === page) {
                        return route.requireLogin;
                    }
                }

                return false;
            };

            this.getUserData = function () {
                var self = this;
                var newPromise = $q.defer();

                this.pendingPromises.push(newPromise);

                $http({
                    method: 'get',
                    url: '/user-data.txt',
                    cache: false,
                    timeout: newPromise.promise
                }).then(
                    function (response) {
                        console.log('Request done!');
                        if (response.data.isLoggedIn) {
                            self.userDataPromise.resolve();
                        } else {
                            self.userDataPromise.reject();
                            $location.path('/login');
                        }
                    }, function () {
                        self.userDataPromise.reject();
                        $location.path('/login');
                    });

                return this.userDataPromise.promise;
            };

            this.abortPreviousRequests = function () {
                var i;
                for (i = 0; i < this.pendingPromises.length; i++) {
                    console.log(this.pendingPromises[i]);
                    this.pendingPromises[i].resolve();
                    console.log('Promise aborted');
                }
                this.pendingPromises = [];
            };
        }]);