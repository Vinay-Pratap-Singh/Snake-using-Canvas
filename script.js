// getting the canvas board
const canvas = document.getElementById("gameBoard");

// width and height of the canvas board
const width = 500;
const height = 500;

// setting the height and width of canvas board
canvas.height = height;
canvas.width = width;

// creating the game context
const context = canvas.getContext("2d");

// creating snake body array for storing the snake body
// default head location is stored
let snakeBody = [
  {
    x: 0,
    y: 0,
  },
];

// creating the snake food object
let snakeFood = {
  x: Math.floor(Math.random() * width - 20),
  y: Math.floor(Math.random() * height - 20),
};

// creating the default direction for snake movement
let direction = {
  x: 0,
  y: 0,
};

// getting the current score element
const score = document.getElementById("currentScore");
let currentScore = 0;

// getting the current level element
const level = document.getElementById("currentLevel");
let currentLevel = 1;

// creating the array for storing the criteria to complete the level and the number of wall blocks per level
const levelData = [
  {
    block: 0,
    score: 3,
  },
  {
    block: 5,
    score: 3,
  },
  {
    block: 10,
    score: 3,
  },
  {
    block: 15,
    score: 3,
  },
  {
    block: 20,
    score: 3,
  },
];

// storing the random location of blocks for rendering on the board
let totalWallBlock = [];

// storing the windows animation frame id to stop the game
let runGameLoop = true;

// adding the global event listner for getting the snake direction from the user using arrow keys
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "ArrowUp":
      if (direction.y !== 20) {
        direction.y = -20;
        direction.x = 0;
      }
      break;
    case "ArrowDown":
      if (direction.y !== -20) {
        direction.y = 20;
        direction.x = 0;
      }
      break;
    case "ArrowLeft":
      if (direction.x !== 20) {
        direction.x = -20;
        direction.y = 0;
      }
      break;
    case "ArrowRight":
      if (direction.x !== -20) {
        direction.x = 20;
        direction.y = 0;
      }
      break;
  }
});

// checking the time of game start
let startTime = new Date().getTime();
// for handling the speed of snake
const frameSpeed = 5;
// creating the game loop for running the game
const gameLoop = () => {
  runGameLoop = window.requestAnimationFrame(() => {
    const currentTime = new Date().getTime();
    const difference = currentTime - startTime;
    if (difference > 1000 / frameSpeed) {
      startTime = currentTime;

      // updating the game variable
      updateGameVariables();

      // rendering the snake and food on board
      updateGameBoard();
    }
  });
  runGameLoop = window.requestAnimationFrame(gameLoop);
};
// running the game loop function
gameLoop();

// function to update the variables of game
const updateGameVariables = () => {
  // checking the food location on first go
  checkFoodLocation();

  // moving the snake body
  moveSnake();

  // check that the food is eaten by snake or not
  checkEatenFood();

  // checking that the user has won the level or not
  wonGame();

  // checking that the game had end or not
  gameEnd();
};

// rendering the snake body on the canvas board
const updateGameBoard = () => {
  // clearing the game board before updating the board
  context.clearRect(0, 0, width, height);

  // rendering the snake over the board
  snakeBody.map((element) => {
    context.fillStyle = "blue";
    context.fillRect(element.x, element.y, 20, 20);
  });

  // rendering the snake food on the board
  context.fillStyle = "green";
  context.fillRect(snakeFood.x, snakeFood.y, 20, 20);

  // rendering the wall block on the board
  totalWallBlock.map((element) => {
    context.fillStyle = "red";
    context.fillRect(element.x, element.y, 20, 20);
  });

  // updating the game score on board
  if (currentScore < 10) {
    score.innerText = "0" + currentScore;
  } else {
    score.innerText = currentScore;
  }

  // updating the game level on board
  if (currentLevel < 10) {
    level.innerText = "0" + currentLevel;
  } else {
    level.innerText = currentLevel;
  }
};

// rendering the food on the canvas board
const generateRandomFood = () => {
  const x = Math.floor(Math.random() * width - 20);
  const y = Math.floor(Math.random() * height - 20);
  snakeFood.x = x;
  snakeFood.y = y;

  // checking that the food is not on snake body or wall
  checkFoodLocation();
};

// checking that the food is on snake body, wall or not
const checkFoodLocation = () => {
  // checking that the food is on a location which is multiple of 20
  if (snakeFood.x % 20 !== 0 || snakeFood.y % 20 !== 0) {
    generateRandomFood();
    return
  }

  // checking that the food is on the body or not
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeBody[i].x === snakeFood.x && snakeBody[i].y === snakeFood.y) {
      // again generate food if it was on snake body
      generateRandomFood();
      return
    }
  }
};

// function for moving the snake over the canvas
const moveSnake = () => {
  for (let i = snakeBody.length - 2; i >= 0; i--) {
    snakeBody[i + 1] = { ...snakeBody[i] };
  }

  // setting the head position
  snakeBody[0].x += direction.x;
  snakeBody[0].y += direction.y;
};

// checking that the food is eaten by the snake or not
const checkEatenFood = () => {
  if (snakeBody[0].x === snakeFood.x && snakeBody[0].y === snakeFood.y) {
    // increasing the snake body
    snakeBody.push({ x: snakeFood.x, y: snakeFood.y });
    
    // move the food to new location
    generateRandomFood();

    totalWallBlock = [];

    // generate random blocks for snake
    for (let i = 0; i < levelData[currentLevel - 1].block; i++) {
      generateRandomBlock();
    }

    // updating the score of the user
    currentScore++;
  }
};

// checking that the snake had hit the wall or his own body
const gameEnd = () => {
  // checking that the snake had hit the wall or not
  if (
    snakeBody[0].x < 0 ||
    snakeBody[0].y < 0 ||
    snakeBody[0].x > width ||
    snakeBody[0].y > height
  ) {
    alert("Game End");
    window.cancelAnimationFrame(runGameLoop);
  }

  // checking that the snake had hit his own body or not
  for (let i = 1; i < snakeBody.length - 1; i++) {
    if (
      snakeBody[i].x === snakeBody[0].x &&
      snakeBody[i].y === snakeBody[0].y
    ) {
      alert("Game End");
      window.cancelAnimationFrame(runGameLoop);
    }
  }

  // checking that the snake had hit the wall blocks of canvas
  for (let i = 0; i < totalWallBlock.length; i++) {
    if (
      snakeBody[0].x === totalWallBlock[i].x &&
      snakeBody[0].y === totalWallBlock[i].y
    ) {
      alert("Game End");
      window.cancelAnimationFrame(runGameLoop);
    }
  }
};

// function to generate the random blocks for snake dificulty
const generateRandomBlock = () => {
  // generating the random values for block position
  const x = Math.floor(Math.random() * width - 20);
  const y = Math.floor(Math.random() * height - 20);

  // checking the position of block is on snake body, snake food or not a multiple of 20
  checkBlockPosition(x, y);
};

// function for checking the location of random blocks
const checkBlockPosition = (x, y) => {
  // checking that the block is on a location which is multiple of 20
  if (x % 20 !== 0 || y % 20 !== 0) {
    generateRandomBlock();
    return;
  }

  // checking that the block is on the snake food or not
  if (snakeFood.x === x && snakeFood.y === y) {
    generateRandomBlock();
    return;
  }

  // checcking that the block matched from its array elements or not
  for (let i = 0; i < totalWallBlock; i++) {
    if (totalWallBlock[i].x === x && totalWallBlock[i].y === y) {
      // again generate the location
      generateRandomBlock();
      return;
    }
  }

  // checking that the food is on the snake body or not
  for (let i = 1; i < snakeBody.length; i++) {
    if (snakeBody[i].x === x && snakeBody[i].y === y) {
      // again generate block if it was on snake body
      generateRandomBlock();
      return;
    }
  }

  // if the co-ordinates are unique, pushing them in array
  totalWallBlock.push({ x, y });
};

// function to check that user has won the game or not
const wonGame = () => {
  if (levelData[currentLevel - 1].score === currentScore) {
    // stopping the game loop
    window.cancelAnimationFrame(runGameLoop);

    alert("Won this level");

    // increasing the game level
    currentLevel++;

    // reseting the current score
    currentScore = 0;

    // reseting the snake body
    snakeBody = [
      {
        x: 0,
        y: 0,
      },
    ];

    direction = {
      x: 0,
      y: 0,
    };

    // checking that the user had completed all the levels or not
    if (currentLevel > 10) {
      alert("You had sucessfully completed all the game levels")
      currentLevel = 1;
    }

    // starting the new level of game
    gameLoop();
  }
};
