(function () {
    var module = angular.module('Chat');

    module.controller('LoginController', function ($scope, $rootScope, $socket, $location) {
        $scope.error = false;
        $scope.login = function (user) {
            $socket.emit("login", user);
        }
        $socket.on("loginSuccess", function (user) {
            $location.path("/chat");
            $rootScope.user = user;
        });
        $socket.on("loginFailure", function () {
            $scope.error = true;
        });

    });

    module.controller('MainController', function ($scope, $rootScope, $socket) {
       
        $scope.messages = [];
     
       $socket.on("updateUsers", function(users){
        $rootScope.users = users;
       });

       $scope.sendMessage = function(message){
        if(!message) return;
        $socket.emit("newMessage", message);
        $scope.message ="";
       };

       $socket.on("newMessage", function(message){
        $scope.messages.push(message);
       });

     });

    module.directive("ngEnter", function(){
        return function(scope, element, attrs){
            element.on("keypress", function(evt){
                if(evt.which === 13){
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter);
                    });
                }
            });
        }
    });

    module.config(function ($routeProvider, $locationProvider) {
        $routeProvider.when('/', {
            templateUrl: 'login',
            controller: 'LoginController'
        }).when('/chat', {
            templateUrl: 'chat-box',
            controller: 'MainController'
        }).
            otherwise({
                redirectTo: '/chat'
            });
        $locationProvider.html5Mode(true);
    });

})();
