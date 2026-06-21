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
        };
    };
    function getBoardState() {
        return grid;
    };
    function resetBoardState() {
        grid.fill(undefined);
    };

    return { occupyTile, getBoardState, resetBoardState };
})();


// player factory function
function createPlayer(name) {
    const getName = () => name;

    let score = 0;
    const getScore = () => score;
    function incrementScore() {
        score++;
    };
  
    return { getName, getScore, incrementScore };
};


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


    