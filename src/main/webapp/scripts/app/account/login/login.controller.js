'use strict';

angular.module('apqdApp')
    .controller('LoginController', function ($rootScope, $scope, $state, $timeout, Auth, MailBoxService,
     FacebookService, AuthenticationErrorService) {
        $scope.user = {};
        $scope.errors = {};

        $scope.rememberMe = true;
        $timeout(function (){angular.element('[ng-model="username"]').focus();});
        $scope.login = function (event) {
            event.preventDefault();
            Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            }).then(function () {
                MailBoxService.connect();

                AuthenticationErrorService.resetAuthenticationError();
                if ($rootScope.previousStateName === 'register') {
                    $state.go('home');
                } else {
                    $rootScope.back();
                }
            }).catch(function () {
                AuthenticationErrorService.setAuthenticationError();
            });
        };

        $scope.isAuthenticationError = function() {
            return AuthenticationErrorService.getAuthenticationError();
        };

        FacebookService.init();
    });
