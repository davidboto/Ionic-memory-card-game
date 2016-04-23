/* App Controllers */


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