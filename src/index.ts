import "./styles.css";

function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth - 6; // 6px is total border width 3px left + 3px right
    canvas.height = window.innerHeight - 6;
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

class Position {
    x: number = 50;
    y: number = 50;
}

class Player {
    position: Position = new Position();
    step = 5;

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
        let radius = 25;
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        let ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.arc(
            this.position.x,
            canvas.height - player.position.y,
            radius,
            0,
            Math.PI * 2,
            false,
        );
        ctx.fillStyle = "#000000";
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FF0000";
        ctx.stroke();
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

let debug_text1 = "";
function debug1(text: string) {
    debug_text1 = text;
}

let debug_text2 = "";
function debug2(text: string) {
    debug_text2 = text;
}

function drawElements() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    let ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.font = "25px Arial";
    ctx.fillText(debug_text1, 10, 25);
    ctx.fillText(debug_text2, 10, 55);
}

let render_old = window.performance.now();
function render(extrapolation: number) {
    // TODO: Handle extrapolated position

    let render_current = window.performance.now();
    let render_elapsed = (render_current - render_old) / 1000;
    render_old = render_current;

    let fps = Math.round(1 / render_elapsed);
    debug1(`FPS: ${fps}`);

    clearCanvas();
    drawElements();
    player.draw();
}

let tick_old = window.performance.now();
function tick() {
    let tick_current = window.performance.now();
    let tick_elapsed = (tick_current - tick_old) / 1000;
    tick_old = tick_current;

    let tps = Math.round(1 / tick_elapsed);
    debug2(`TPS: ${tps}`);

    player.updatePosition();
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let previous = window.performance.now();
let lag = 0.0;
async function gameLoop() {
    const TPS = 20;
    const MS_PER_TICK = (1 / TPS) * 1000;

    let current = window.performance.now();
    let elapsed = current - previous;
    previous = current;
    lag += elapsed;

    while (lag >= MS_PER_TICK) {
        tick();
        lag -= MS_PER_TICK;
    }

    render(lag / MS_PER_TICK);
    window.requestAnimationFrame(gameLoop);
}

function main() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
    window.addEventListener("resize", () => {
        resizeCanvas(canvas);
    });

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    resizeCanvas(canvas);

    window.requestAnimationFrame(gameLoop);
}

window.onload = main;
