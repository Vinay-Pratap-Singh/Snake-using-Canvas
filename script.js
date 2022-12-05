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
  }
];

// creating the snake food object
let snakeFood = {
  x: Math.floor(Math.random() * width-20),
  y: Math.floor(Math.random() * height-20),
};

// creating the default direction for snake movement
const direction = {
  x: 0,
  y: 0,
};

// checking the time of game start
let startTime = new Date().getTime();
// for handling the speed of snake
const frameSpeed = 1;
// creating the game loop for running the game
const gameLoop = () => {
  window.requestAnimationFrame(() => {
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
  window.requestAnimationFrame(gameLoop);
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
}

// rendering the snake body on the canvas board
const updateGameBoard = () => {
    // clearing the game board before updating the board
    context.clearRect(0, 0, width, height);

    // rendering the snake over the board
    snakeBody.map((element) => {
        context.fillStyle = "red";
        context.fillRect(element.x, element.y, 20, 20);
    })

    // rendering the snake food on the board
    context.fillStyle = "green";
    context.fillRect(snakeFood.x, snakeFood.y, 20, 20);
}

// rendering the food on the canvas board
const generateRandomFood = () => {
    const x = Math.floor(Math.random() * width-20);
    const y = Math.floor(Math.random() * height-20);
    snakeFood.x = x;
    snakeFood.y = y;

    // checking that the food is not on snake body or wall
    checkFoodLocation();
}

// checking that the food is on snake body, wall or not
const checkFoodLocation = () => {
    // checking that the food is on a location which is multiple of 20
    if (snakeFood.x % 20 !== 0 || snakeFood.y % 20 !== 0) {
        generateRandomFood();
        return;
    }
    
    // checking that the food is on the body or not
    for (let i = 1; i < snakeBody.length; i++){
        if (element.x === snakeFood.x && element.y === snakeFood.y) {
            // again generate food if it was on snake body
            generateRandomFood();
            return;
        }
    }
}

// function for moving the snake over the canvas
const moveSnake = () => {
    for (let i = snakeBody.length - 2; i > 0; i--){
        snakeBody[i + 1] = {...snakeBody[i]};
    }

    // setting the head position
    snakeBody[0].x += direction.x;
    snakeBody[0].y += direction.y;   
}

// checking that the food is eaten by the snake or not
const checkEatenFood = () => {
    if (snakeBody[0].x === snakeFood.x && snakeBody[0].y === snakeFood.y) {
        // move the food to new location
        generateRandomFood();
        
        // increasing the snake body
        snakeBody.push({ x: snakeFood.x, y: snakeFood.y });
    }
}

// checking that the snake had hitted the wall or not

// checking that the snake had eaten his own body or not

// function for changing the direction value
const changeDirection = (key) => { 
    switch (key.key) {
        case "ArrowUp":
            direction.y = -20;
            direction.x = 0;
            break;
        case "ArrowDown":
            direction.y = 20;
            direction.x = 0;
            break;
        case "ArrowLeft":
            direction.x = -20;
            direction.y = 0;
            break;
        case "ArrowRight":
            direction.x = 20;
            direction.y = 0;
            break;
    }
}

// adding the global event listner for getting the snake direction from the user using arrow keys
window.addEventListener("keyup", changeDirection);