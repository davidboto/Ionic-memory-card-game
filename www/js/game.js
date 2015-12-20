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

