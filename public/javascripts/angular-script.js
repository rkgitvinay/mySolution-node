var app = 	angular.module("myApp", [])
			.controller('loginCtrl', function($scope,$http,$window){
				$scope.formData = {};
				$scope.login = function(){
					$http({
						method 	: 'POST',
						url		: '/api/login',
						data    : $scope.formData, 
						headers : { 'Content-Type': 'application/json' } 
					})
					.success(function(data){
						if(data.status== 'success'){
							$window.location.href = '/home';
						}else{							
   							$scope.loginError = true;
   							$scope.err_msg = data.message;							
						}
					})
				};	
			})
			.controller('registerCtrl',function($scope, $http, $window){
				$scope.formData = {};
				$scope.register = function(){
					$http({
						method 	: 'POST',
						url		: '/api/register',
						data    : $scope.formData, 
						headers : { 'Content-Type': 'application/json' } 
					})
					.success(function(data){
						if(data.status== 'success'){
							$window.location.href = '/login';
						}
					})
				};	
			})
			.controller('logoutCtrl',function($scope,$http,$window){
				$scope.name = 'test';
				$scope.logout = function(){
					$http({
						method 	: 'POST',
						url		: '/api/logout',												
					})
					.success(function(data){
						if(data.status== 'success'){
							$window.location.href = '/';
						}
					})
				};
			})	