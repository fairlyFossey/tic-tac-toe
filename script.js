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
            // call gameflow-nextPlayersTurn method
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
const gameManager = (() => {
    let currentPlayer;

    function getCurrentPlayer() {
        const p1 = "player1";
        const p2 = "player2";
        // set starting player if needed
        if (currentPlayer == undefined) {
            Math.random() >= 0.5 ? currentPlayer = p1 : currentPlayer = p2;
        };
        return currentPlayer;
    };

    function endTurn() {
        if (checkForWin() == true) {
            console.log(`${currentPlayer} wins!`);
            return;
        } else if (checkForTie() == true) {
            console.log("Its a tie!");
            return;
        };

        currentPlayer = p1 ? currentPlayer = p2 : currentPlayer = p1;
    };

    function checkForWin() {
        const winConditions = [
            // rows
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            // columns
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            // diagonals
            [0, 4, 8], [2, 4, 6]
        ];

        // get index of all tiles owned by current player
        let ownedTiles = [];
        gameboard.getBoardState().forEach((tile, index) => {
            if (tile == currentPlayer) {
                ownedTiles.push(index);
            };
        });

        // compare player owned tiles against win-conditions
        for (const winCon of winConditions) {
            if (ownedTiles.includes(winCon[0])
                && ownedTiles.includes(winCon[1])
                && ownedTiles.includes(winCon[2])) {
                return true;
            };
        };
        return false;
    };

    function checkForTie() {
        const tileHasToken = (tile) => tile != undefined;

        if (gameboard.getBoardState().every(tileHasToken)) {
            if (checkForWin() == false) {
                return true;
            };
        };
        return false;
    };

    function startNewGame() {
        gameboard.resetBoardState();
        currentPlayer = undefined;
        // placeholder for call to update display
    };

    // update display method

    return { getCurrentPlayer, endTurn, startNewGame, };
})();