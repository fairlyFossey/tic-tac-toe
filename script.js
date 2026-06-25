// GAMEBOARD OBJECT
const gameboard = (() => {
    const grid = [
        undefined, undefined, undefined,
        undefined, undefined, undefined,
        undefined, undefined, undefined,
    ];

    function occupyTile(pos, player) {
        if (grid[pos] == undefined) {
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
    let currentPlayer = getRandomPlayer();

    function getRandomPlayer() {
        return (Math.random() >= 0.5 ? player[1] : player[2]);
    }

    const getCurrentPlayer = () => currentPlayer;


    function endTurn() {
        if (checkForWin() == true) {
            currentPlayer.incrementScore();
            console.log(`${currentPlayer.getName()} wins! \n${currentPlayer.getName()}'s score is now: ${currentPlayer.getScore()}`);
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
        currentPlayer = getRandomPlayer();
    };

    return { getCurrentPlayer, endTurn, startNewGame, };
})();

// UI OBJECT
const uiController = (() => {
    const displayedTiles = document.querySelectorAll(".gameboard__tile");
    const scoreboards = document.querySelectorAll(".scoreboard");
    const scoreDisplays = document.querySelectorAll(".scoreboard__score");
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
    scoreboards.forEach((scoreboard) => {
        const nameplate = scoreboard.querySelector(".scoreboard__nameplate");
        const input = scoreboard.querySelector(".scoreboard__input");
        const icon = scoreboard.querySelector(".scoreboard__icon");

        // clickable nameplates
        nameplate.addEventListener('click', () => {
            input.textContent = nameplate.textContent;
            nameplate.style.display = "none";
            icon.style.display = "none";
            input.style.display = "block";
            input.focus();
        });

        // submit name edits
        input.addEventListener('focusout', () => submitField());
        input.addEventListener('keydown', (e) => {
            if (e.key == "Enter") submitField();
        });

        function submitField() {
            const num = scoreboard.dataset.playerNumber;

            player[num].setName(input.value);
            input.style.display = "none";
            nameplate.style.display = "block";
            icon.style.display = "block";
        };
    });

    // sync DOM with gamestate
    function updateDisplay() {
        gameboard.getBoardState().forEach((value, pos) => {
            if (value == player[1]) {
                displayedTiles[pos].classList.add("gameboard__tile--selected-p1");
            } else if (value == player[2]) {
                displayedTiles[pos].classList.add("gameboard__tile--selected-p2");
            } else {
                displayedTiles[pos].classList.remove("gameboard__tile--selected-p1");
                displayedTiles[pos].classList.remove("gameboard__tile--selected-p2");
            };
        });
        // sync DOM with player names
        scoreboards.forEach((scoreboard) => {
            const nameplate = scoreboard.querySelector(".scoreboard__nameplate");
            const num = scoreboard.dataset.playerNumber;

            nameplate.textContent = player[num].getName();
        });
        // sync DOM with player scores
        scoreDisplays.forEach((display) => {
            const num = display.dataset.playerNumber;

            display.textContent = player[num].getScore();
        });
    };
    return { updateDisplay };
})();