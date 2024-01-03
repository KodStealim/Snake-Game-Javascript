const board_border = "white";
const board_background = "#eee";
const snake_col = "#333";
const snake_border = "darkblue";
var direction = "right";
var pause = false;

let snake = [
    { x: 200, y: 200 },
    { x: 190, y: 200 },
    { x: 180, y: 200 },
    { x: 170, y: 200 },
    { x: 160, y: 200 },
];

let score = 0;
let changing_direction = false;
let dx = 10;
let dy = 0;
let food_x;
let food_y;

const snakeboard = document.querySelector("#gameCanvas");
const ctx = snakeboard.getContext("2d");

// For starting game
startGame();

// Generate food
gen_food();

document.addEventListener("keydown", changeDirection);

function startGame() {
    if (has_game_ended()) {
        document.getElementById("redo").style.display = "inline-block";
        return;
    }
    changing_direction = false;

    if (pause) {
        return;
    }

    setTimeout(() => {
        clearCanvas();
        drawFood();
        move();
        drawSnake();
        startGame();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = board_background;
    ctx.strokeStyle = board_border;
    ctx.fillRect(0, 0, snakeboard.width, snakeboard.height);
    ctx.strokeRect(0, 0, snakeboard.width, snakeboard.height);
}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawSnakePart(snakePart) {
    ctx.fillStyle = snake_col;
    ctx.strokestyle = snake_border;
    ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
    ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function move() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    const has_eaten_food = snake[0].x === food_x && snake[0].y === food_y;
    if (has_eaten_food) {
        score += 10;
        document.getElementById("score").innerHTML = score;
        gen_food();
    } else {
        snake.pop();
    }
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const UP_KEY = 38;
    const RIGHT_KEY = 39;
    const DOWN_KEY = 40;
    const PAUSE = 13;

    const keyPressed = event.keyCode;

    if (has_game_ended() && keyPressed === PAUSE) {
        restart();
    } else if (keyPressed === PAUSE) {
        pauseGame();
    }

    if (changing_direction) return;
    changing_direction = true;

    if (keyPressed === LEFT_KEY && direction != "right") {
        dx = -10;
        dy = 0;
        direction = "left";
    }

    if (keyPressed === RIGHT_KEY && direction != "left") {
        dx = 10;
        dy = 0;
        direction = "right";
    }

    if (keyPressed === UP_KEY && direction != "down") {
        dx = 0;
        dy = -10;
        direction = "up";
    }
    if (keyPressed === DOWN_KEY && direction != "up") {
        dx = 0;
        dy = 10;
        direction = "down"
    }
}

function has_game_ended() {
    for (let i = 4; i < snake.length; i++) {
        const has_collided = snake[i].x === snake[0].x && snake[i].y === snake[0].y;
        if (has_collided) return true;
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > snakeboard.width - 10;
    const hitTopWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > snakeboard.head - 10;

    return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function random_food(min, max) {
    return Math.round((Math.random() * (max - min) + min) / 10) * 10;
}

function gen_food() {
    food_x = random_food(0, snakeboard.width - 10);
    food_y = random_food(0, snakeboard.height - 10);
    snake.forEach(function has_snake_eaten_food(part) {
        const has_eaten = part.x == food_x && part.y == food_y;
        if (has_eaten) gen_food();
    });
}

function drawFood() {
    ctx.fillStyle = "#ff3f91";
    ctx.strokeStyle = "";
    ctx.fillRect(food_x, food_y, 10, 10);
    ctx.strokeRect(food_x, food_y, 10, 10);
}

function restart() {
    score = 0;
    document.getElementById("score").innerHTML = score;
    direction = "right";
    dx = 10;
    dy = 0;
    changing_direction = false;
    snake = [
        { x: 200, y: 200 },
        { x: 190, y: 200 },
        { x: 180, y: 200 },
        { x: 170, y: 200 },
        { x: 160, y: 200 },
    ];
    document.getElementById("redo").style.display = "none";
    pause = false;
    document.getElementById("pause").innerText = "Pause";
    startGame();
    gen_food();
}

function pauseGame() {
    pause = !pause;
    if (pause) {
        document.getElementById("pause").innerText = "Unpause";
    } else {
        document.getElementById("pause").innerText = "Pause";
        startGame();
    }

}