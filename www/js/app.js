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

  ionic.Platform.fullScreen();
 
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
});

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
    //console.log(gameCards);
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


'use strict';
/* Memory Game Models and Business Logic */

function Tile(title) {
  this.title = title;
  this.flipped = false;
}

Tile.prototype.flip = function() {
  this.flipped = !this.flipped;
}

function Game(tileNames) {
  var tileDeck = makeDeck(tileNames);

  var firstPick, secondPick = undefined;

  this.grid = makeGrid(tileDeck);
  this.message = Game.MESSAGE_CLICK;
  this.unmatchedPairs = tileNames.length;

  this.flipTile = function(tile) {
    if (tile.flipped) {
      return;
    }

    tile.flip();

    if (!firstPick || secondPick) {
      if (secondPick) {
        firstPick.flip();
        secondPick.flip();
        firstPick = secondPick = undefined;
      }

      firstPick = tile;
      this.message = Game.MESSAGE_ONE_MORE;

    } else {

      if (firstPick.title === tile.title) {
        this.unmatchedPairs--;
        this.message = (this.unmatchedPairs > 0) ? Game.MESSAGE_MATCH : Game.MESSAGE_WON;
        firstPick = secondPick = undefined;
      } else {
        secondPick = tile;
        this.message = Game.MESSAGE_MISS;
        //setTimeout(unflip, 500);
      }
    }
  }

  
  function unflip(){
    firstPick.flip();
    secondPick.flip();
    firstPick = secondPick = undefined;
  }
}


Game.MESSAGE_CLICK = 'Click on a tile.';
Game.MESSAGE_ONE_MORE = 'Pick one more card.'
Game.MESSAGE_MISS = 'Try again.';
Game.MESSAGE_MATCH = 'Good job! Keep going.';
Game.MESSAGE_WON = 'You win!';



/* Create an array with two of each tileName in it */
function makeDeck(tileNames) {
  var tileDeck = [];
  tileNames.forEach(function(name) {
    tileDeck.push(new Tile(name));
    tileDeck.push(new Tile(name));
  });

  return tileDeck;
}


function makeGrid(tileDeck) {

  var gridDimensionX = 4,
      gridDimensionY = 4,
      grid = [];
 
  if (tileDeck.length === 30){
    gridDimensionX = 5;
    gridDimensionY = 6;
  }

  if (tileDeck.length === 20){
    gridDimensionX = 5;
    gridDimensionY = 4;
  }

  for (var row = 0; row < gridDimensionY; row++) {
    grid[row] = [];
    for (var col = 0; col < gridDimensionX; col++) {
        grid[row][col] = removeRandomTile(tileDeck);
    }
  }
  return grid;
}


function removeRandomTile(tileDeck) {
  var i = Math.floor(Math.random()*tileDeck.length);
  return tileDeck.splice(i, 1)[0];
}

