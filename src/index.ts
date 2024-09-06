import "./styles.css";

function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth - 6; // 6px is total border width 3px left + 3px right
    canvas.height = window.innerHeight - 6;
    gameLoop().then();
}

function toggleFullscreen() {
    // TODO: Handle this

    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch((err) => {
            alert(
                `Error attempting to enable fullscreen mode: ${err.message} (${err.name})`,
            );
        });
    } else {
        document.exitFullscreen();
    }
}

function drawElements(canvas: HTMLCanvasElement) {
    let ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 150, 150);
}

class Position {
    x: number = 50;
    y: number = 50;
}

class Player {
    position: Position = new Position();
    step = 1;

    moveUp() {
        this.position.y += this.step;
    }

    moveLeft() {
        this.position.x -= this.step;
    }

    moveRight() {
        this.position.x += this.step;
    }

    moveDown() {
        this.position.y -= this.step;
    }

    updatePosition() {
        if (movingDirection.up) {
            this.moveUp();
        }

        if (movingDirection.left) {
            this.moveLeft();
        }

        if (movingDirection.right) {
            this.moveRight();
        }

        if (movingDirection.down) {
            this.moveDown();
        }
    }

    draw() {
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        let ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.arc(
            this.position.x,
            canvas.height - player.position.y,
            4,
            0,
            Math.PI * 2,
            false,
        );
        ctx.fillStyle = "#00FF00";
        ctx.fill();
    }
}

const player = new Player();
const movingDirection = { up: false, left: false, right: false, down: false };

function keyDownHandler(event: KeyboardEvent) {
    switch (event.key) {
        case "O":
            toggleFullscreen();
            break;

        case "W":
        case "w":
            movingDirection.up = true;
            break;

        case "A":
        case "a":
            movingDirection.left = true;
            break;

        case "D":
        case "d":
            movingDirection.right = true;
            break;

        case "S":
        case "s":
            movingDirection.down = true;
            break;
    }
    if (event.key === "O") {
        toggleFullscreen();
    }
}

function keyUpHandler(event: KeyboardEvent) {
    switch (event.key) {
        case "W":
        case "w":
            movingDirection.up = false;
            break;

        case "A":
        case "a":
            movingDirection.left = false;
            break;

        case "D":
        case "d":
            movingDirection.right = false;
            break;

        case "S":
        case "s":
            movingDirection.down = false;
            break;
    }
}

function clearCanvas() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    let ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function render() {
    clearCanvas();
    player.draw();
}

// 20 tps
function tick() {
    player.updatePosition();
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function gameLoop() {
    while (true) {
        render();
        tick();
        await delay(5);
    }
}

function main() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
    window.addEventListener("resize", () => {
        resizeCanvas(canvas);
    });

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    resizeCanvas(canvas);
}

main();
