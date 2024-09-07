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

class Camera {
    position: Position = new Position();
}

class Position {
    x: number = 0.0;
    y: number = 0.0;
}

class Velocity {
    x: number = 0;
    y: number = 0;

    decay(rate_of_change: number) {
        if (this.x > 0) {
            let new_x = this.x - rate_of_change;
            this.x = new_x >= 0 ? new_x : 0;
        }

        if (this.x < 0) {
            let new_x = this.x + rate_of_change;
            this.x = new_x <= 0 ? new_x : 0;
        }

        if (this.y > 0) {
            let new_y = this.y - rate_of_change;
            this.y = new_y >= 0 ? new_y : 0;
        }

        if (this.y < 0) {
            let new_y = this.y + rate_of_change;
            this.y = new_y <= 0 ? new_y : 0;
        }
    }

    grow(
        direction: "up" | "left" | "right" | "down",
        rate_of_change: number,
        max: number,
    ) {
        switch (direction) {
            case "up":
                let uy = this.y + rate_of_change;
                this.y = uy >= max ? max : uy;
                break;
            case "left":
                let lx = this.x - rate_of_change;
                console.log(`lx: ${lx}`);
                this.x = lx <= -max ? -max : lx;
                break;
            case "right":
                let rx = this.x + rate_of_change;
                console.log(`rx: ${rx}`);
                this.x = rx >= max ? max : rx;
                break;
            case "down":
                let dy = this.y - rate_of_change;
                this.y = dy <= -max ? -max : dy;
                break;
        }
    }
}

class Player {
    color = `#000000`;
    position: Position = new Position();
    velocity = new Velocity();
    max_speed = 150.0;
    acceleration = 20;
    friction = 0.1;

    moveUp() {
        this.velocity.grow("up", this.acceleration, this.max_speed);
    }

    moveLeft() {
        this.velocity.grow("left", this.acceleration, this.max_speed);
    }

    moveRight() {
        this.velocity.grow("right", this.acceleration, this.max_speed);
    }

    moveDown() {
        this.velocity.grow("down", this.acceleration, this.max_speed);
    }

    resetVelocity() {
        this.velocity = new Velocity();
    }

    updateVelocity() {
        if (keyboardDirection.up) {
            this.moveUp();
        }

        if (keyboardDirection.left) {
            this.moveLeft();
        }

        if (keyboardDirection.right) {
            this.moveRight();
        }

        if (keyboardDirection.down) {
            this.moveDown();
        }
    }

    updatePosition() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    input() {
        this.updateVelocity();
    }

    draw(extrapolation: number) {
        let canvas = <HTMLCanvasElement>document.getElementById("canvas");
        let x = this.position.x;
        let y = this.position.y;

        let extrapolated_x =
            ((x + this.velocity.x * extrapolation) / canvas.width) * 2;
        let extrapolated_y =
            ((-1 * (y + this.velocity.y * extrapolation)) / canvas.height) * 2;

        // let extrapolated_x = x / canvas.width;
        // let extrapolated_y = (-1 * y) / canvas.height;

        debugC(`extr: x: ${extrapolated_x.toFixed(2)}`);
        debugD(`extr: y: ${extrapolated_y.toFixed(2)}`);

        let radius = 25;
        let ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.arc(
            canvas.width * extrapolated_x + canvas.width / 2,
            canvas.height * extrapolated_y + canvas.height / 2,
            radius,
            0,
            Math.PI * 2,
            false,
        );
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FF0000";
        ctx.stroke();
    }

    tick() {
        player.color = `#00FF00`;

        this.velocity.decay(this.friction); // TODO: you have no conservation of momentum, dimwit
        this.updatePosition();

        let { x, y } = this.velocity;
        debugA(`x force: ${x}`);
        debugB(`y force: ${y}`);
    }
}

const player = new Player();
const keyboardDirection = { up: false, left: false, right: false, down: false };

function keyDownHandler(event: KeyboardEvent) {
    switch (event.key) {
        case "O":
            toggleFullscreen();
            break;

        case "W":
        case "w":
            keyboardDirection.up = true;
            break;

        case "A":
        case "a":
            keyboardDirection.left = true;
            break;

        case "D":
        case "d":
            keyboardDirection.right = true;
            break;

        case "S":
        case "s":
            keyboardDirection.down = true;
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
            keyboardDirection.up = false;
            break;

        case "A":
        case "a":
            keyboardDirection.left = false;
            break;

        case "D":
        case "d":
            keyboardDirection.right = false;
            break;

        case "S":
        case "s":
            keyboardDirection.down = false;
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

let debug_textA = "";
function debugA(text: string) {
    debug_textA = text;
}

let debug_textB = "";
function debugB(text: string) {
    debug_textB = text;
}

let debug_textC = "";
function debugC(text: string) {
    debug_textC = text;
}

let debug_textD = "";
function debugD(text: string) {
    debug_textD = text;
}

function drawElements() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    let ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.font = "25px Arial";
    ctx.fillText(debug_text1, 10, 25);
    ctx.fillText(debug_text2, 10, 55);

    ctx.fillText(debug_textA, 10, 85);
    ctx.fillText(debug_textB, 10, 115);
    ctx.fillText(debug_textC, 10, 145);
    ctx.fillText(debug_textD, 10, 175);
}

function input() {
    player.input();
}

let render_old = window.performance.now();
function render(extrapolation: number) {
    let render_current = window.performance.now();
    let render_elapsed = (render_current - render_old) / 1000;

    let fps = Math.round(1 / render_elapsed);
    debug1(`FPS: ${fps}`);

    clearCanvas();
    drawElements();
    player.draw(extrapolation);
    render_old = render_current;
}

let tick_old = window.performance.now();
function tick() {
    let tick_current = window.performance.now();
    let tick_elapsed = (tick_current - tick_old) / 1000;

    let tps = Math.round(1 / tick_elapsed);
    debug2(`TPS: ${tps}`);

    player.tick();
    tick_old = tick_current;
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let previous = window.performance.now();
let lag = 0.0;
function gameLoop() {
    player.color = `#000000`;

    const TPS = 0.5;
    const MS_PER_TICK = (1 / TPS) * 1000;

    let current = window.performance.now();
    let elapsed = current - previous;
    previous = current;
    lag += elapsed;

    input();
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

    tick(); // Tick once to initialize the game

    window.requestAnimationFrame(gameLoop);
}

window.onload = main;
