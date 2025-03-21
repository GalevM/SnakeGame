const canvasHtml = document.getElementById('gameCanvas') as HTMLCanvasElement;
const canvas = canvasHtml.getContext('2d');
const gridSize = 25;
const canvasSize = 600;
const appleImage = new Image();
appleImage.src = './images/apple.webp';

const snakeHeadUp = new Image();
const snakeHeadDown = new Image();
const snakeHeadLeft = new Image();
const snakeHeadRight = new Image();
const snakeBody = new Image();

snakeHeadUp.src = './images/snake-head-up.png';
snakeHeadDown.src = './images/snake-head-down.png';
snakeHeadLeft.src = './images/snake-head-left.png';
snakeHeadRight.src = './images/snake-head-right.png';
snakeBody.src = './images/snake-body.png';

let snakeText = 'right';

const newGameBtn = document.getElementById("newGameBtn") as HTMLButtonElement;
const buttonContainer = document.getElementById("buttonContainer") as HTMLElement;

function showImage(): void {
    const img = new Image();
    img.src = './images/front-page.webp';
    img.onload = () => { canvas?.drawImage(img, 0, 0); }
}

interface Position {
    x: number;
    y: number;
}

let snake: Position[] = [
    { x: 10, y: 8 },
];

let food: Position = {
    x: Math.floor(Math.random() * (gridSize - 1)),
    y: Math.floor(Math.random() * (gridSize - 1)),
};
let dx: number = 0;
let dy: number = 0;
let score: number = 0;

let gameLoop: number | undefined;

function handleKeyPress(e: KeyboardEvent): void {
    if (gameLoop === undefined) {
        gameLoop = window.setInterval(updateGame, 120 - score);
    }

    const key = e.key;
    if (key === "ArrowUp" && dy !== 1) {
        dx = 0;
        dy = -1;
        snakeText = 'up';
    }
    else if (key === "ArrowDown" && dy !== -1) {
        dx = 0;
        dy = 1;
        snakeText = 'down';
    }
    else if (key === "ArrowLeft" && dx !== 1) {
        dx = -1;
        dy = 0;
        snakeText = 'left';
    }
    else if (key === "ArrowRight" && dx !== -1) {
        dx = 1;
        dy = 0;
        snakeText = 'right';
    }
}

function updateGame(): void {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    
    if (head.x < 0 || head.x >= gridSize -1 || head.y < 0 || head.y >= gridSize - 1) {
        gameOver();
        return;
    }

    for(let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return;
        }
    }

    snake.unshift(head);

    // if (!canvas) {
    //     throw new Error('Canvas not found');
    // }

    if (head.x === food.x && head.y === food.y) {
        score += 3;
        generateFood();
    } else {
        snake.pop();
    }

    canvas?.clearRect(0, 0, canvasSize, canvasSize);
    drawSnake();
    drawFood();
}

function drawSnake(): void {
    // if (!canvas) {
    //     throw new Error('Canvas not found');
    // }

    snake.forEach((segment, index) => {
        let img: HTMLImageElement;

        if (index === 0) {
            if (snakeText === 'up') {
                img = snakeHeadUp;
            } else if (snakeText === 'down') {
                img = snakeHeadDown;
            } else if (snakeText === 'left') {
                img = snakeHeadLeft;
            } else {
                img = snakeHeadRight;
            }
        } else {
            img = snakeBody;
        }

        canvas?.drawImage(img, segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function gameOver(): void {
    if (!canvas) {
        throw new Error('Canvas not found');
    }
    
    clearInterval(gameLoop);
    canvas?.clearRect(0, 0, canvasSize, canvasSize);
    
    canvas.fillStyle = "white";
    canvas.font = "30px Arial";
    canvas.fillText("Game Over", 230, 260);
    canvas.fillText(`Score: ${score / 3}`, 240, 300);

    showNewGameButton();
}

function generateFood(): void {
    food = {
        x: Math.floor(Math.random() * (gridSize - 1)),
        y: Math.floor(Math.random() * (gridSize - 1)),
    };
}

function drawFood(): void {
    // if (!canvas) {
    //     throw new Error('Canvas not found');
    // }

    canvas?.drawImage(appleImage, food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function showNewGameButton(): void {
    buttonContainer.style.display = 'block';
    buttonContainer.style.left = `${canvasHtml.offsetLeft + 240}px`;  
    buttonContainer.style.top = `${canvasHtml.offsetTop + 340}px`; 
}

function startNewGame(): void {
    snake = [
        { x: 10, y: 8 },
    ];
    food = {
        x: Math.floor(Math.random() * (gridSize - 1)),
        y: Math.floor(Math.random() * (gridSize - 1)),
    };
    dx = 0;
    dy = 0;
    score = 0;

    drawSnake();
    drawFood();
    gameLoop = undefined;
    buttonContainer.style.display = 'none';
    showImage();
}

showImage();
document.addEventListener('keydown', handleKeyPress);
newGameBtn.addEventListener("click", startNewGame);
