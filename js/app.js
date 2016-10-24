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
                requireLogin: false
            }, {
                path: '/secure-page',
                controller: 'SecurePageController',
                templateUrl: '/templates/secure-page.html',
                requireLogin: true,
                resolve: ['authenticationService', function (authenticationService) {
                    return authenticationService.getUserData();
                }]
            }
        ]
    })
    .config(['$routeProvider', 'appConfig', '$httpProvider', function ($routeProvider, appConfig, $httpProvider) {
        var i, route, routeObject;

        $httpProvider.defaults.cache = false;

        for (i = 0; i < appConfig.routes.length; i++) {
            route = appConfig.routes[i];
            routeObject = {
                controller: route.controller,
                templateUrl: route.templateUrl,
                cache: false
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
    .run(['authenticationService', '$rootScope', function(authenticationService, $rootScope){
        $rootScope.$on('$locationChangeSuccess', function(){
            console.log('Location event fired');
            authenticationService.abortPreviousRequests();
        });
    }]);