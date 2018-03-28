/**
 * Created by Валера on 06.03.2018.
 */
var signInApp =  angular.module('SignInApp', ["ngRoute"]);

signInApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl : "/Login/signIn.htm"
        })
        .when("/signUp", {
            templateUrl : "/Login/signUp.htm"
        })
});

signInApp.controller('signIn', function($scope, $http) {
    $scope.signin = function () {
        $http.post("/signin", {
            email:  $scope.name,
            password: $scope.pass
        }).then(function(response) {

           if(response.data=='success'){
               redirect($http);
           }
        });
    }
});

signInApp.controller('signUp', function($scope, $http) {
    $scope.signup = function () {
        $http.post("/signup", {
            name: $scope.name,
            email:  $scope.email,
            password: $scope.pass
        }).then(function(response) {
            console.log(response.data);
        });
    }
});

function redirect(http){
   http.get('/home').then(window.location.assign('http://localhost:7777/home'));
}