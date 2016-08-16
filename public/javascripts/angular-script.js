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
		            .when("/suggestions",{
		            	templateUrl: "partials/suggestions.html"	
		            })
		            .when("/posts",{
		            	templateUrl: "partials/posts.html"	
		            })
		            .when("/followings",{
		            	templateUrl: "partials/followings.html"	
		            })
		            .when("/followers",{
		            	templateUrl: "partials/followers.html"	
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
					$rootScope.resetCommentModal = '';
					var url = '/post/getPostDetail/'+postId;
					$http.get(url).
                	then(function(response) {
                		var result = response.data;
                    	$rootScope.postDetail = result.postData;
                    	$rootScope.commentDetail = result.comments;                    	
                	});
				}

			});

			app.controller('loginUserDetails', function($scope,$http,$rootScope){
				$http.get("/user/getUserDetails").
                	then(function(response) {
                    	$scope.userInfo = response.data;
                    	$rootScope.username = response.data.first_name;
                    	$rootScope.notifications =  response.data.notifications;
                    	$rootScope.posts =  response.data.posts;
                    	$rootScope.following =  response.data.following;
                    	$rootScope.followers =  response.data.followers;
                });
			});

			app.controller('commentCtrl',function($scope,$http){				
				$scope.showCommentDiv = false;
				$scope.doComment = function(postId){
					$http({
						method 	: 'POST',
						url		: '/post/doComment/'+postId,
						data    : $scope.formData, 
						headers : { 'Content-Type': 'application/json' } 
					})
					.then(function(response){
						$scope.formData = null;												
						$scope.newComment = response.data;
						$scope.showCommentDiv = true;										
						$scope.noCommentDiv = true;
					})
					
				};
			});

			app.controller('suggestionCtrl', function($scope,$http,$rootScope){
				$http.get("/user/getUserSuggestions").
                	then(function(response) {
                    	$scope.userSuggestions = response.data;                    	
                });                                
                $scope.follow = function(userId, $index){                	
                	$http({
						method 	: 'POST',
						url		: '/user/dofollow',
						data    : {userId:userId},
						headers : { 'Content-Type': 'application/json' } 
					})
					.then(function(response){							
						$scope.follow[$index] = true;						
						$rootScope.following = $rootScope.following + 1;
					})
                }

                 $scope.unFollow = function(userId,$index){                	
                	$http({
						method 	: 'POST',
						url		: '/user/unfollow',
						data    : {userId:userId},
						headers : { 'Content-Type': 'application/json' } 
					})
					.then(function(response){													
						$rootScope.following = $rootScope.following - 1;
						$scope.follow[$index] = false;
					});
                }
			});

			app.controller('notificationCtrl', function($scope,$http,$rootScope){
				$http.get("/user/getNotifications").
                	then(function(response) {
                    	$scope.userNotifications = response.data;  
                    	$rootScope.notifications = 0;                  	
                });                                                
			});
			
			app.controller('getMyPostsCtrl', function($scope,$http){
				$http.get("/post/getMyPostList").
                	then(function(response) {
                    	$scope.myPostList = response.data;
                });
			});

			app.controller('getFollowings', function($scope,$http,$rootScope){
				$http.get("/user/getFollowingsList").
                	then(function(response) {
                    	$scope.myFollowingsList = response.data;
                });

               	$scope.follow = function(userId, $index){                	
                	$http({
						method 	: 'POST',
						url		: '/user/dofollow',
						data    : {userId:userId},
						headers : { 'Content-Type': 'application/json' } 
					})
					.then(function(response){							
						$scope.follow[$index] = false;						
						$rootScope.following = $rootScope.following + 1;
					})
                }

                 $scope.unFollow = function(userId,$index){                	
                	$http({
						method 	: 'POST',
						url		: '/user/unfollow',
						data    : {userId:userId},
						headers : { 'Content-Type': 'application/json' } 
					})
					.then(function(response){													
						$rootScope.following = $rootScope.following - 1;
						$scope.follow[$index] = true;
					});
                }

			});


			app.controller('getMyFollowers', function($scope,$http,$rootScope){
				$http.get("/user/getFollowersList").
                	then(function(response) {
                    	$scope.myFollowersList = response.data;
                });

                $scope.follow = function(userId, $index){                	
                	$http({
						method 	: 'POST',
						url		: '/user/dofollow',
						data    : {userId:userId},
						headers : { 'Content-Type': 'application/json' } 
					})
					.then(function(response){							
						//$scope.follow[$index] = false;						
						$rootScope.following = $rootScope.following + 1;
					})
                }

                 $scope.unFollow = function(userId,$index){                	
                	$http({
						method 	: 'POST',
						url		: '/user/unfollow',
						data    : {userId:userId},
						headers : { 'Content-Type': 'application/json' } 
					})
					.then(function(response){													
						$rootScope.following = $rootScope.following - 1;
						//$scope.follow[$index] = true;
					});
                }


                
			});

			