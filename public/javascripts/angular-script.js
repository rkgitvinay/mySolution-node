var app = 	angular.module("myApp", ['ngRoute']);

			app.config(function($routeProvider,$locationProvider) {
		        $routeProvider
		            .when("/", {
		                templateUrl: "partials/timeline.html",                
		                
		            })
		            .when("/notification", {
		                // controller: "NewContactController",
		                templateUrl: "partials/notifications.html"
		            })
		            .when("/messages", {
		                //controller: "EditContactController",
		                templateUrl: "partials/messages.html"
		            })
		            .otherwise({
		                redirectTo: "/"
		            })

		            //$locationProvider.html5Mode(true);
		    })


			app.controller('loginCtrl', function($scope,$http,$window){
				$scope.formData = {};
				$scope.login = function(){
					$http({
						method 	: 'POST',
						url		: '/user/login',
						data    : $scope.formData, 
						headers : { 'Content-Type': 'application/json' } 
					})
					.success(function(data){
						if(data.status== 'success'){
							$window.location.href = '/';
						}else{							
   							$scope.loginError = true;
   							$scope.err_msg = data.message;							
						}
					})
				};	
			});

			app.controller('registerCtrl',function($scope, $http, $window){
				$scope.formData = {};
				$scope.register = function(){
					$http({
						method 	: 'POST',
						url		: '/user/register',
						data    : $scope.formData, 
						headers : { 'Content-Type': 'application/json' } 
					})
					.success(function(data){
						if(data.status== 'success'){
							$window.location.href = '/login';
						}
					})
				};	
			});

			app.controller('logoutCtrl',function($scope,$http,$window){				
				$scope.logout = function(){
					$http({
						method 	: 'POST',
						url		: '/user/logout',												
					})
					.success(function(data){
						if(data.status== 'success'){
							$window.location.href = '/';
						}
					})
				};
			});		

			app.controller('doPostCtrl', function($scope, $rootScope,$http){												
				$scope.doPost = function(){
					$http({
						method 	: 'POST',
						url		: '/post/doPost',
						data    : $scope.formData, 
						headers : { 'Content-Type': 'application/json' } 
					})
					.success(function(data, status, headers, config){
						$scope.formData = null;												
						$rootScope.postData = data.postData;
						$rootScope.showDiv = true;
						$rootScope.myLike = 0;
					})
					
				};
				
			});

			app.controller('getAllPostCtrl', function($rootScope,$http){
				$http.get("/post/getPostList").
                	then(function(response) {
                    	$rootScope.postList = response.data;
                });
			});

			app.controller('postCtrl', function($scope,$http,$rootScope){								
                $scope.myLike = 0;
				$scope.postLike = function(postId){
					$http({
						method	: 'POST',
						url 	: '/post/postLike',
						data 	: {postId : postId},
						headers : { 'Content-Type': 'application/json' } 	
					})
					.success(function(response){
						if(response.status == 'liked'){
							$scope.category = postId;
							$scope.myLike = $scope.myLike + 1;
							$scope.myStyle = {'color':'red'};
							$scope.postData.total_like = $scope.postData.total_like +1;
						}else
						{
							$scope.category = false;
							$scope.myLike = $scope.myLike - 1;
							$scope.myStyle = {'color':'#8A8887'};
							$scope.postData.total_like = $scope.postData.total_like - 1;	
						}
						
						
					})				
					
				}

				$scope.getPostDetail = function(postId){
					var url = "/post/getPostDetail/" + postId;
					$http.get(url).
                	then(function(response) {
                    	$rootScope.postDetail = response.data;
                	});
				}				
			});

			app.controller('loginUserDetails', function($scope,$http){
				$http.get("/user/getUserDetails").
                	then(function(response) {
                    	$scope.userInfo = response.data;
                });
			});

			

			