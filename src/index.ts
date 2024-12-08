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
import { Player } from "./entities/player";
// import { viewport } from "./viewport";

let player = new Player();

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

/*
      20 tps -> 50ms per tick

       50ms  50ms  50ms  50ms
      0     1     2     3     4
  T   |     |     |     |     |
  R   | | | | | | | | | | | | |
      0 1 2 3 4 5 6 7 8 9 1 1 1
                          0 1 2


 */

const TPS = 2.0;

let last_tick = window.performance.now();
let tolerance = 1 / TPS;
export const reset_last_tick = () => {
    last_tick = window.performance.now();
};
export const since_last_tick = () => {
    let now = window.performance.now();
    return (now - last_tick) / 1000;
};

let render_old = window.performance.now();
function render(extrapolation: number) {
    let render_current = window.performance.now();
    let render_elapsed = (render_current - render_old) / 1000;

    let fps = Math.round(1 / render_elapsed);
    debug1(`FPS: ${fps}`);
    debug2(`extrapolation: ${extrapolation}`);

    clearCanvas();
    drawElements();
    player.render(extrapolation);

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

function gameLoop() {
    let extrapolation = since_last_tick();
    if (extrapolation >= tolerance) {
        extrapolation = tolerance;
    }

    render(extrapolation);
    window.requestAnimationFrame(gameLoop);
}

function main() {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas")!;
    window.addEventListener("resize", () => {
        resizeCanvas(canvas);
    });

    resizeCanvas(canvas);
    window.requestAnimationFrame(gameLoop);
}

window.onload = main;
