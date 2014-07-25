(function () {
    var module = angular.module("Services");
    module.factory("$socket", function ($rootScope) {
        var socket = io();
        return {
            on: function (evtName, callback) {
                socket.on(evtName, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        callback.apply(socket, args);
                    });
                });
            },
            emit: function (evtName, data, callback) {
                socket.emit(evtName, data, function () {
                    var args = arguments;
                    $rootScope.$apply(function () {
                        if (callback)
                            callback.apply(socket, args);
                    });
                });
            }
        };
    });
})();