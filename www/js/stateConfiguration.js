app.config(function($stateProvider, $urlRouterProvider) {
    
    $stateProvider.state('login', {
		url: '/login',
		templateUrl: 'templates/login.html',
		controller: 'LogIn'
	});
    $stateProvider.state('register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'Register'
    });
    //Provides the side menu and more information. Can't be accessed without a child view and controller
    $stateProvider.state('home', {
        url: '/home',
        abstract: true,
        templateUrl: 'templates/home.html',
        controller: 'Home'
    });
	$stateProvider.state('home.dashboard', {
		url: '/dashboard',
        views: {
            'menuContent': {
                templateUrl: 'templates/dashboard.html',
                controller: 'Dashboard'
            }
        }
	});

    $stateProvider.state('home.post', {
        url: '/posts/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/post.html',
                controller: 'Post'
            }
        }
    });

    //Provides the page with the list of pets in adoption
    $stateProvider.state('home.adoptions', {
        url: '/adoptions',
        views: {
            'menuContent': {
                templateUrl: 'templates/adoptions.html',
                controller: 'Adoptions'
            }
        }
    });

    //Provdies the page with information about a specific pet in adoption
    $stateProvider.state('home.adoption', {
        url: '/adoptions/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/adoption.html',
                controller: 'Adoption'
            }
        }
    });
    //Provides the page with the list of events
    $stateProvider.state('home.events', {
        url: '/events',
        views: {
            'menuContent': {
                templateUrl: 'templates/events.html',
                controller: 'Events'
            }
        }
    });
    //Provides the page with information about a specific event
    $stateProvider.state('home.event', {
        url: '/events/:id',
        views: {
            'menuContent': {
                templateUrl: 'templates/event.html',
                controller: 'Event'
            }
        }
    });
	
	$stateProvider.state('home.profile', {
		url: '/profile/:username',
        views: {
            'menuContent': {
                params: {'username': null},
                templateUrl: 'templates/profile.html',
                controller: 'Profile'
            }
        }
	});

	$stateProvider.state('photo', {
		url: '/photo',
		templateUrl: 'templates/photo.html',
		controller: 'Photo'
	});
	
    $stateProvider.state('firstSteps', {
        url: '/firstSteps',
        templateUrl: 'templates/firstSteps.html',
    });
    
    //Default page to be loaded
    $urlRouterProvider.otherwise('/login');
    
});