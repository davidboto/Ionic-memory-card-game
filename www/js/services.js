/* App Services */


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
