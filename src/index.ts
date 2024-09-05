import { v4 as uuidv4 } from "uuid";

function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth - 6; // 6px is total border width 3px left + 3px right
    canvas.height = window.innerHeight - 6;
}

function fullscreen() {
    let canvas = <HTMLCanvasElement>document.getElementById("canvas");
    let a = canvas.requestFullscreen();
}

let canvas = <HTMLCanvasElement>document.getElementById("canvas")!;
window.addEventListener("resize", () => {
    resizeCanvas(canvas);
});
resizeCanvas(canvas);

window.addEventListener("keypress", (event) => {
    if (event.key === "O") {
        fullscreen();
    }
});

let ctx = canvas.getContext("2d")!;
ctx.fillStyle = "#000000";
ctx.fillRect(0, 0, 150, 150);

console.log(uuidv4());
