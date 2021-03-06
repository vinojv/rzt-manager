/**
*   Initialize the app
*   angular plugins - UI router, Rest angular, angular file upload, anf ng-storge
**/
angular.module("rbook", [
     "ui.router",
     "restangular",
     "angularFileUpload",
     "ngStorage"
     ])
/*
*   Configures routes and rest angular
*
*   The app has 3 states
        - login -> login service, urls: /html/login.html
        - employees -> list of employees, urls: /html/employees.html
        - employee -> add/edit employees, urls: /employees/{mode}
*
*/
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        'RestangularProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider, RestangularProvider) {
            console.log("config");

            RestangularProvider.setBaseUrl('/');
            RestangularProvider.setDefaultHeaders({
                "Content-Type": "application/json"
            });

            $urlRouterProvider.when("/", "/");

//            $locationProvider.html5Mode(true);

            $stateProvider
                .state("login", {
                    url: "/",
                    templateUrl: "/html/login.html",
                    controller: "LoginController as Login"
                })

            .state("employees", {
                url: "/employees",
                templateUrl: "/html/employees.html",
                controller: "EmployeeListController as empCtr",
                resolve: {
                    employees: ["Service", function (service) {
                        return service.getEmployees().then(function (data) {
                            return data;
                        }, function (err) {
                            console.log("error")
                            return []
                        });
                    }]

                }
            })

            .state("employee", {
                url: "/employees/{mode}",
                templateUrl: "/html/add-employee.html",
                controller: "AddEmployeeController as forms"
            });

    }])
    .run(["$state",
      "Restangular",
      "$localStorage",
       function($state, Restangular, $localStorage){
        Restangular.setErrorInterceptor(function (response, deferred, responseHandler) {
            console.log("Restangular error intercepted", response);

            if (response.status == 403) {
                $localStorage.$reset();
                $state.go('login');
                return false; //error handled
            }

            return true; // error not handled
        });
    }])
/**
*   Main controller for rbook
*   Initially goes to employee state
**/
    .controller("RBookController", [
      "$scope",
      "$state",
       function (scope, $state) {
            $state.go("employees");
      }])
