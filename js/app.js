angular.module('angularRouting', ['ngRoute'])
    .constant('appConfig', {
        routes: [
            {
                path: '/home',
                controller: 'HomepageController',
                templateUrl: '/templates/homepage.html',
                requireLogin: false
            }, {
                path: '/login',
                controller: 'LoginController',
                templateUrl: '/templates/login.html',
                requireLogin: false,
                resolve: ['authenticationService', '$q', function(authenticationService, $q) {
                    console.log('Login resolved to :', !authenticationService.getUserAuthenticated());
                    if(authenticationService.getUserAuthenticated()){
                        return $q.reject('REDIRECT_HOME');
                    } else {
                        return $q.resolve();
                    }
                }]
            }, {
                path: '/secure-page',
                controller: 'SecurePageController',
                templateUrl: '/templates/secure-page.html',
                requireLogin: true,
                resolve: ['authenticationService', function(authenticationService) {
                    return authenticationService.getUserData();
                }]
            }
        ]
    })
    .config(['$routeProvider', 'appConfig', '$httpProvider', function($routeProvider, appConfig, $httpProvider) {
        var i, route, routeObject;

        $httpProvider.defaults.cache = false;

        for (i = 0; i < appConfig.routes.length; i++) {
            route = appConfig.routes[i];
            routeObject = {
                controller: route.controller,
                templateUrl: route.templateUrl
            };

            if (angular.isDefined(route.resolve)) {
                routeObject.resolve = route.resolve;
            }

            $routeProvider.when(route.path, routeObject);
        }

        $routeProvider.otherwise({
            redirectTo: '/home'
        })
    }])
    .run(['authenticationService', '$rootScope', '$location', 'loadingService', function(authenticationService, $rootScope, $location, loadingService) {
        $rootScope.$on('$locationChangeSuccess', function() {
            console.log('$locationChangeSuccess');
            authenticationService.abortPreviousRequests();
            loadingService.startLoading();
        });

        $rootScope.$on('$locationChangeError', function() {
            console.log('$locationChangeError');
            loadingService.stopLoading();
        });

        $rootScope.$on("$routeChangeError", function(event, current, previous, eventObj) {
            console.log('$routeChangeError');
            loadingService.stopLoading();
            if (eventObj === 'AUTH_REQUIRED') {
                $location.path("/login");
            } else if(eventObj === 'REDIRECT_HOME'){
                $location.path("/home");
            }
        });

        $rootScope.$on("$routeChangeSuccess", function(event, current, previous, eventObj) {
            console.log('$routeChangeSuccess');
            loadingService.stopLoading();
        });
    }]);