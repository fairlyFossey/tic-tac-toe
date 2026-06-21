// gameboard object
const gameboard = (() => {
    let grid = [
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
    ];

    function occupyTile(pos, player) {
        if (grid[pos] == undefined) {
            grid[pos] = player;
            // call gameflow-endturn method
        }
    }
    function getBoardState() {
        return grid;
    }
    function resetBoardState() {
        grid = grid.map((tile) => tile = undefined);
    }

    return { occupyTile, getBoardState, resetBoardState }
})();

// playerX and playerO objects
    // create a player name variable
        // create a setter method for player name
    // create a player score variable
        // increment score method

// gameflow object
    // turn manager
        // create a current-turn variable
        // create an end-turn method that checks for win/stalemate and then toggles the current turn variable
        // create a method to randomize the value of current turn variable to determine starting player
    // start new game
        // call the gameboard-reset method
        // call current-turn-randomizer method
        // call to update display
    // update display


    