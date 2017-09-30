/*
*
* GENERAL FUNCTION
*
*/

// Random Int Generator
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive
}

/*
*
* CREATE IMAGES USED
*
*/


// 8 icons From Maki font set, must be used as a class and prefaced by maki-
const ICONS = [
  'aboveground-rail',
  'art-gallery',
  'basketball',
  'cafe',
  'cinema',
  'fire-station',
  'library',
  'skiing'
];

const STAR = "maki-religious-jewish";

// Populates iconArray with icons in proper format
function createIconArray() {
  let iconArray = [];

  for (let icon of ICONS) {
    iconArray.push(`maki-${icon}`);
    iconArray.push(`maki-${icon}`);
  }

  return iconArray;
}

/*
*
* POPULATE CELLS
*
*/

// Populates each tile with random icon from array
function populateTiles() {
  // Gathers list of tiles
  let tileList = $('.tile');
  let iconArray = createIconArray();

  // sets toPopulate = number of tiles
  let toPopulate = tileList.length;

  tileList.each(function () {
    // Creates randomNum from 0 to toPopulate
    let randomNum = randomInt(0, toPopulate);
    // Draws random icon from Array
    let drawnIcon = iconArray.splice(randomNum, 1);

    // Adds Icon as div / class to selected tile
    $( this ).html(`<div class="${drawnIcon} logo hidden"></div>`);

    // Places icon in back of array, draws from 0 - toPopulate-1
    iconArray.push(drawnIcon);
    toPopulate--;
  });
}

populateTiles();

/*
*
* GAME TIMER
*
*/

const Timer = {
  startTime: 0,
  endTime: 0,

  startTimer() {
    let curDate = new Date();
    let curTime = curDate.getTime();

    this.startTime = curTime;
  },

  endTimer() {
    let endDate = new Date();
    let endTime = endDate.getTime();

    this.endTime = endTime;
  },

  calculateTime() {
    let timeInSeconds = Math.floor((this.endTime - this.startTime) / 1000);

    let seconds = 0,
        minutes = 0,
        totalTime = '';

    if (timeInSeconds > 60) {
      minutes = Math.floor(timeInSeconds / 60);
      seconds = timeInSeconds % 60;
      totalTime = `${minutes} Minutes and ${seconds} Seconds`;
    } else {
      totalTime = `${timeInSeconds} Seconds`;
    }

    return totalTime;
  }
}

// Starts timer initially when program loads
Timer.startTimer();

/*
*
* TILE FUNCTIONS
*
*/

// Functions for the tiles - select tile, check for match, etc
const Tile = {
  selected: '',

  resetSelected() {
    this.selected = '';
  },

  toggleHidden(tile) {
    $(tile).toggleClass('hidden');
  },

  // Checks if there is another tile currently selected
  hasSelected(clickedTile) {
    // If no other tile selected, sets last clicked to "selected" and reveals
    if (this.selected === '') {
      this.selected = clickedTile;
      Tile.toggleHidden(clickedTile);
      return false;
    }
    // If another tile is selected, returns true
    return true;
  },

  // Checks if same tile clicked on twice
  doubleClick(clickedTile) {
    // If same tile, hides and resets selected. No move penalty
    if (clickedTile.is(Tile.selected)) {
      Tile.toggleHidden(clickedTile);
      Tile.resetSelected();
      return true;
    }
    // If different tile, returns false
    return false;
  },

  // Checks if second tile a match with currently selected
  checkMatch(clickedTile) {
    // Check for doubleclicks
    if (!Tile.doubleClick(clickedTile)) {
      // Displays second tile
      //TODO: Count as move
      Tile.toggleHidden(clickedTile);

      // Takes class containing Icon names from tiles
      let selectedIcon = Tile.selected.find('div').attr('class');
      let clickedIcon = clickedTile.find('div').attr('class');

      if (clickedIcon === selectedIcon) {
        Tile.selected.addClass('matched');
        clickedTile.addClass('matched');
        Tile.selected = '';
      } else {
        window.setTimeout(function() {
          Tile.toggleHidden(Tile.selected);
          Tile.toggleHidden(clickedTile);
          Tile.selected = '';
        }, 500);
      }
      Game.updateMoves();
      //Delay makes tile.selected malfunction
      // Tile.selected = '';
    };
  }
};

$('td.tile').click(function() {
  let clickedTile = $(this);

  //Checks if another tile selected, if so, tests for match
  if (!clickedTile.hasClass('matched') && Tile.hasSelected(clickedTile)) {
    Tile.checkMatch(clickedTile)
  };
  // if (!currentTile.hasClass('matched')) {
  //   currentTile.toggleClass("hidden");
  //   matchTest(currentTile);
  // }
});

const Game = {
  moveCount: 0,
  moveLoc: $('#num_moves'),

  resetTiles() {
    let tiles = $('td.tile');
    tiles.each(function() {
      $(this).attr('class','tile hidden');
    });
  },

  updateStars() {
    let twoStars = 15,
      oneStar = 18,
      noStars = 21;

    if (this.moveCount === twoStars ||
        this.moveCount === oneStar ||
        this.moveCount === noStars) {
      let lastStar = $('ul#star_cont li.full').last();
      lastStar.toggleClass('full');
    }
  },

  resetStars() {
    $('#star_cont li').each(function() {
      $( this ).attr('class', `full ${STAR}`)
    })
  },

  checkWin() {
    let numTiles = $('td.tile').length;
    let numMatch = $('td.matched').length;

    if (numMatch === numTiles) {
      Game.toggleWinScreen();
    }
  },

  updateMoves() {
    Game.checkWin();
    this.moveCount++;
    Game.updateStars();
    this.moveLoc.text(`${this.moveCount} Moves`);
  },

  resetMoves() {
    this.moveCount = 0;
    this.moveLoc.text(`${this.moveCount} Moves`);
  },

  reset() {
    Game.resetTiles();
    Game.resetMoves();
    Game.resetStars();
    Tile.resetSelected();
    populateTiles();
    Timer.startTimer();
  },

  toggleWinScreen() {
    Timer.endTimer();
    let winTime = Timer.calculateTime();
    let starsLeft = $('ul#star_cont li.full').length;

    $('#game_wrapper').toggleClass('hide');
    $('#win_screen').toggleClass('hide');

    $('#win_moves').html(Game.moveCount);
    $('#win_stars').html(starsLeft);
    $('#win_time').html(winTime);
  }
};

//TODO: Change reset back
$('#reset').click(Game.toggleWinScreen);
$('#play_again').click(function() {
  Game.reset();
  Game.toggleWinScreen();
});

// Fix this mess below:
//
// let selected = '';
//
// function matchTest(tile) {
//   // If no cell currently selected, sets selected to current tile
//   if (selected === '') {
//     selected = tile;
//   } else {
//     // If same cell clicked on twice, hides the cell
//     if (tile.is(selected)) {
//       // Why does toggleClass not work with tile?
//       // tile.toggleClass("hidden");
//       tile.addClass("hidden");
//       selected = '';
//     } else {
//       // If selected and different tile, checks whether their icons are equal
//       let selectedIcon = selected.find('div');
//       let tileIcon = tile.find('div');
//
//       if (selectedIcon.attr('class') === tileIcon.attr('class')) {
//         tile.addClass("matched");
//         selected.addClass("matched");
//         selected = '';
//         //Confirm match
//       } else {
//         //No match - reveal next, show nomatch effect, hide
//         window.setTimeout(function() {
//           tile.addClass("hidden");
//           selected.addClass("hidden");
//           selected = '';
//         }, 500)
//       }
//     }
//   }
// }
