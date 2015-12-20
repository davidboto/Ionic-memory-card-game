'use strict';
/* App Controllers */

var memoryGameApp = angular.module('memoryGameApp', ['ionic','LocalStorageModule']);

memoryGameApp.run(function($ionicPlatform, CacheService) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
 

  if(CacheService.get('numCards') === null){
    CacheService.set('numCards', 10);
  };

  if(CacheService.get('gameCards') === null){
    CacheService.set('gameCards', 'm3');
  };



});

memoryGameApp.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider

  .state('gameBoard', {
    url: '/gameBoard',
    cache: false,
    templateUrl: 'templates/gameBoard.html',
    controller: 'GameCtrl'
  })
  
  .state('gameLevel', {
    url: '/gameLevel',
    templateUrl: 'templates/gameLevel.html',
    controller: 'GameCtrl'
  })

  .state('gameCards', {
    url: '/gameCards',
    templateUrl: 'templates/gameCards.html',
    controller: 'GameCtrl'
  })

  .state('initial', {
    url: '/',
    cache: false,
    templateUrl: 'templates/main.html',
    controller: 'MainCtrl'
  })

  $urlRouterProvider.otherwise("/");
})

memoryGameApp.factory('game', function(CacheService) {

  var tileNamesAvailables = ['a','b','c','d','e','f','g','h','i','j','k','l','m','o','p','q','r','s','t'];

  return {
    newGame: function() {
      console.log('function newGame called!');
      var i = 0,
          tileNames = [],
          numCards = CacheService.get('numCards');

      for (i = 0; i < numCards; i++) {
        console.log(tileNamesAvailables[i]);
        tileNames.push(tileNamesAvailables[i]);
      }
      return new Game(tileNames);
    }
  };
});

memoryGameApp.factory('CacheService', [
  'localStorageService',

  function (localStorageService) {
    var CacheService = {
      get: function (key) {
        return localStorageService.get(key)
      },
      set: function (key, value) {
        localStorageService.set(key, value)
      },
    }
    return CacheService
  }
]);


memoryGameApp.controller('GameCtrl', function GameCtrl($scope, $state, game, CacheService) {
  $scope.cardSize = (window.innerWidth) / 5.5;
  $scope.numPairs = CacheService.get('numCards');
  $scope.gameCards = CacheService.get('gameCards');
  $scope.game = game.newGame();

  $scope.setNumberPairs = function(numCards){
    CacheService.set('numCards', numCards);
    //console.log('setting number of cards: ' + numCards);
    $scope.game = game.newGame();
    $state.go('initial');
  }

  $scope.setGameCards = function(gameCards){
    CacheService.set('gameCards', gameCards);
    console.log(gameCards);
    $scope.game = game.newGame();
    $state.go('initial');
  }

});


memoryGameApp.controller('MainCtrl', function MainCtrl($scope, $state, game, CacheService) {
  $scope.numPairs = CacheService.get('numCards');
  $scope.startGame = function(){
    $state.go('gameBoard', {}, { reload: true });    
  }

  $scope.gameOptions = function(){
    $state.go('gameLevel');
  }

  $scope.gameCards = function(){
    $state.go('gameCards');
  }



});

//usages:
//- in the repeater as: <mg-card tile="tile"></mg-card>
//- card currently being matched as: <mg-card tile="game.firstPick"></mg-card>

memoryGameApp.directive('mgCard', function() {
  return {
    restrict: 'E',
    // instead of inlining the template string here, one could use templateUrl: 'mg-card.html'
    // and then either create a mg-card.html file with the content or add
    // <script type="text/ng-template" id="mg-card.html">.. template here.. </script> element to
    // index.html
    template: '<div class="container">' +
                '<div class="carde" ng-class="{flipped: tile.flipped}">' +
                  '<img class="front" ng-src="img/back.png">' +
                  '<img class="back" ng-src="img/{{tile.title}}.png">' +
                '</div>' +
              '</div>',
    scope: {
      tile: '='
    }
  }
});
