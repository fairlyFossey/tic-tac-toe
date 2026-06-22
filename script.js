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
            gameManager.endTurn();
            uiController.updateBoard();
        };
    };
    function getBoardState() {
        return grid;
    };
    function resetBoardState() {
        grid.fill(undefined);
        uiController.updateBoard();
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
    const p1 = "player1";
    const p2 = "player2";

    function getCurrentPlayer() {
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

        currentPlayer == p1 ? currentPlayer = p2 : currentPlayer = p1;
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
    };

    return { getCurrentPlayer, endTurn, startNewGame, };
})();


const uiController = (() => {
    function updateBoard() {
        let displayedTiles = document.querySelectorAll(".gameboard-tile");

        // iterate through game board checking values
        gameboard.getBoardState().forEach((value, pos) => {
            // assign corresponding classes via DOM 
            if (value == "player1" || value == "player2") {
                displayedTiles[pos].classList.add(value);
            } else {
                displayedTiles[pos].classList.remove("player1");
                displayedTiles[pos].classList.remove("player2");
            };
        });
    };
    return { updateBoard };
})();