// GAMEBOARD OBJECT
const gameboard = (() => {
    const grid = [
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
    ];

    function occupyTile(pos, player) {
        if (grid[pos] == undefined && gameManager.checkForWin() == false) {
            grid[pos] = player;
            gameManager.endTurn();
            uiController.updateDisplay();
        };
    };
    function getBoardState() {
        return grid;
    };
    function resetBoardState() {
        grid.fill(undefined);
        uiController.updateDisplay();
    };

    return { occupyTile, getBoardState, resetBoardState };
})();


// PLAYER OBJECT
const player = (() => {

    function createPlayer(name) {
        // name methods
        const getName = () => name;
        function setName(str) {
            // validation prevents nameplates from becoming unclickable
            if (str) name = str;
            uiController.updateDisplay();
        };
        // score methods
        let score = 0;
        const getScore = () => score;
        function incrementScore() {
            score++;
        };
        
        return { getName, setName, getScore, incrementScore };
    };

    return { 1: createPlayer("player1"), 2: createPlayer("player2"), };
})();


// GAMEFLOW OBJECT
const gameManager = (() => {
    let currentPlayer;

    function getCurrentPlayer() {
        // assign random starting player if needed
        if (currentPlayer == undefined) {
            Math.random() >= 0.5 ? currentPlayer = player[1] : currentPlayer = player[2];
        };
        return currentPlayer;
    };

    function endTurn() {
        if (checkForWin() == true) {
            console.log(`${currentPlayer.getName()} wins!`);
            return;
        } else if (checkForTie() == true) {
            console.log("Its a tie!");
            return;
        };
        // toggle turns
        currentPlayer == player[1] ? currentPlayer = player[2] : currentPlayer = player[1];
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

        // get all tiles owned by current player
        let ownedTiles = [];
        gameboard.getBoardState().forEach((tile, index) => {
            if (tile == currentPlayer) {
                ownedTiles.push(index);
            };
        });

        // compare against possible win-conditions
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

    return { getCurrentPlayer, endTurn, startNewGame, checkForWin };
})();

// UI OBJECT
const uiController = (() => {
    const displayedTiles = document.querySelectorAll(".gameboard-tile");
    const playerNameCntrs = document.querySelectorAll(".player-name-cntr");
    const restartBtn = document.querySelector("button");

    // handle user input of game
    displayedTiles.forEach((tile) => {
        tile.addEventListener("click", (e) => {
            let pos = e.target.id;
            gameboard.occupyTile(pos, gameManager.getCurrentPlayer());
        });
    });

    restartBtn.addEventListener('click', () => {
        gameManager.startNewGame();
    });

    // handle user input for nameplates
    playerNameCntrs.forEach((cntr) => {
        const nameplate = cntr.querySelector("div");
        const input = cntr.querySelector("input");
        const img = cntr.querySelector("img");

        // clickable nameplates
        nameplate.addEventListener('click', () => {
            input.textContent = nameplate.textContent;
            nameplate.style.display = "none";
            img.style.display = "none";
            input.style.display = "block";
            input.focus();
        });

        // submit name edits
        input.addEventListener('focusout', () => submitField());
        input.addEventListener('keydown', (e) => {
            if (e.key == "Enter") submitField();
        });

        function submitField() {
            const num = cntr.dataset.playerNumber;

            player[num].setName(input.value);
            input.style.display = "none";
            nameplate.style.display = "block";
            img.style.display = "block";
        };
    });

    // sync DOM with gamestate
    function updateDisplay() {
        gameboard.getBoardState().forEach((value, pos) => {
            if (value == player[1]) {
                displayedTiles[pos].classList.add("player1");
            } else if (value == player[2]) {
                displayedTiles[pos].classList.add("player2");
            } else {
                displayedTiles[pos].classList.remove("player1");
                displayedTiles[pos].classList.remove("player2");
            };
        });
        // sync DOM with player names
        playerNameCntrs.forEach((cntr) => {
            const nameplate = cntr.querySelector("div");
            const num = cntr.dataset.playerNumber;

            nameplate.textContent = player[num].getName();
        });
    };
    return { updateDisplay };
})();