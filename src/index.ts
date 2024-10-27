import "./styles.css";
import {
    debug1,
    debug2,
    debug_text1,
    debug_text2,
    debug_textA,
    debug_textB,
    debug_textC,
    debug_textD,
} from "./debug";
import { viewport } from "./viewport";

function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth - 6; // 6px is total border width 3px left + 3px right
    canvas.height = window.innerHeight - 6;
}

function toggleFullscreen() {
    // TODO: Handle this

    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
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

function keyDownHandler(event: KeyboardEvent) {
    if (event.repeat) {
        return;
    }

    switch (event.key) {
        case "O":
            toggleFullscreen();
            return;

        case "W":
        case "w":
            player.keyboardDirection.up = true;
            break;

        case "A":
        case "a":
            player.keyboardDirection.left = true;
            break;

        case "D":
        case "d":
            player.keyboardDirection.right = true;
            break;

        case "S":
        case "s":
            player.keyboardDirection.down = true;
            break;
    }

    player.sendInput();
}

function keyUpHandler(event: KeyboardEvent) {
    if (event.repeat) {
        return;
    }

    switch (event.key) {
        case "W":
        case "w":
            player.keyboardDirection.up = false;
            break;

        case "A":
        case "a":
            player.keyboardDirection.left = false;
            break;

        case "D":
        case "d":
            player.keyboardDirection.right = false;
            break;

        case "S":
        case "s":
            player.keyboardDirection.down = false;
            break;
    }

    player.sendInput();
}

function clearCanvas() {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
    let ctx = canvas.getContext("2d")!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawElements() {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
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

let render_old = window.performance.now();
function render(extrapolation: number) {
    let render_current = window.performance.now();
    let render_elapsed = (render_current - render_old) / 1000;

    let fps = Math.round(1 / render_elapsed);
    debug1(`FPS: ${fps}`);

    clearCanvas();
    drawElements();
    viewport.render(extrapolation);

    render_old = render_current;
}

let tick_old = window.performance.now();
function tick() {
    let tick_current = window.performance.now();
    let tick_elapsed = (tick_current - tick_old) / 1000;

    let tps = Math.round(1 / tick_elapsed);
    debug2(`TPS: ${tps}`);

    tick_old = tick_current;
}

function delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

let previous = window.performance.now();
let lag = 0.0;
function gameLoop() {
    // player.color = `#000000`;

    const TPS = 0.5;
    const MS_PER_TICK = (1 / TPS) * 1000;

    let current = window.performance.now();
    let elapsed = current - previous;
    previous = current;
    lag += elapsed;

    while (lag >= MS_PER_TICK) {
        // tick();
        lag -= MS_PER_TICK;
    }

    render(lag / MS_PER_TICK);
    window.requestAnimationFrame(gameLoop);
}

function main() {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas")!;
    window.addEventListener("resize", () => {
        resizeCanvas(canvas);
    });

    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    resizeCanvas(canvas);

    // tick(); // Tick once to initialize the game

    window.requestAnimationFrame(gameLoop);
}

window.onload = main;
