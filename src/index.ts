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
    debugA,
} from "./debug";
import { Player } from "./player";
import { Position } from "./position";

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

function drawGrid() {
    grid(20, 20, 125);
    dot(0, 0, 3);
}

function line(x: number, y: number) {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
    let ctx = canvas.getContext("2d")!;
    let x_offset = x - camera.x;
    let y_offset = -1 * (y - camera.y);

    console.log(`${x_offset} | ${y_offset}`);
    let length = 200;
    let x_center = x_offset + canvas.width / 2;
    let y_center = y_offset + canvas.height / 2;

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#d3d3d3";
    ctx.beginPath();
    ctx.moveTo(x_center - length / 2, y_center);
    ctx.lineTo(x_center + length / 2, y_center);
    ctx.stroke();
}

function box(x: number, y: number, length: number) {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
    let ctx = canvas.getContext("2d")!;
    let [x_translated, y_translated] = world_to_canvas_coords(x, y);

    ctx.lineWidth = 2;
    ctx.strokeStyle = "lightgray";
    ctx.beginPath();
    ctx.moveTo(x_translated - length / 2, y_translated + length / 2);
    ctx.lineTo(x_translated + length / 2, y_translated + length / 2);
    ctx.lineTo(x_translated + length / 2, y_translated - length / 2);
    ctx.lineTo(x_translated - length / 2, y_translated - length / 2);
    ctx.lineTo(x_translated - length / 2, y_translated + length / 2);
    ctx.stroke();
}

function grid(rows: number, cols: number, cell: number) {
    let left = -(cell * cols) / 2 + cell / 2;
    let bot = -(cell * rows) / 2 + cell / 2;

    for (let x = left; x < (cell * cols) / 2; x += cell) {
        for (let y = bot; y < (cell * rows) / 2; y += cell) {
            box(x, y, cell);
        }
    }
}

function dot(x: number, y: number, radius: number) {
    let [x_translated, y_translated] = world_to_canvas_coords(x, y);
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
    let ctx = canvas.getContext("2d")!;
    ctx.beginPath();
    ctx.arc(x_translated, y_translated, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = "#FF0000";
    ctx.fill();
    ctx.closePath();
}

function world_to_canvas_coords(x: number, y: number): [number, number] {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
    let x_offset = x - camera.x;
    let y_offset = -1 * (y - camera.y);

    let x_translated = x_offset + canvas.width / 2;
    let y_translated = y_offset + canvas.height / 2;

    return [x_translated, y_translated];
}

function drawDebug() {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
    let ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#000000";
    ctx.textAlign = "left";
    ctx.font = "25px Arial";
    ctx.fillText(debug_text1, 10, 25);
    ctx.fillText(debug_text2, 10, 55);

    ctx.fillText(debug_textA, 10, 85);
    ctx.fillText(debug_textB, 10, 115);
    ctx.fillText(debug_textC, 10, 145);
    ctx.fillText(debug_textD, 10, 175);
}

const TPS = 3.0;

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
    debugA(`tolerance: ${tolerance}`);

    clearCanvas();
    drawGrid();
    drawDebug();
    for (const [id, player] of Object.entries(players)) {
        // @ts-ignore
        player.render(extrapolation);
    }

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
    // if (extrapolation >= tolerance) {
    //     extrapolation = tolerance;
    // }

    render(extrapolation);
    window.requestAnimationFrame(gameLoop);
}

// let local_player = new Player();
let players: any = {};
let websocket: WebSocket | null = null;
export let camera: Position = new Position();
function connect(address: string) {
    websocket = new WebSocket(address);
    websocket.binaryType = "arraybuffer";
    websocket.onopen = () => {
        console.log("Connected");
    };

    websocket.onmessage = async (event) => {
        let blob = event.data;
        let json = JSON.parse(blob);
        if (json.type == "handshake") {
            handleHandshake(json.id);
            handlePlayers(json.players);
        }

        if (json.type == "players") {
            handlePlayers(json.players);
        }

        if (json.type == "disconnect") {
            handleDisconnected(json.players);
        }

        reset_last_tick();
    };

    websocket.onclose = () => {
        console.log("Disconnected");
    };
}

export let own_id: number = -1;
function handleHandshake(id: number) {
    own_id = id;
    // players[own_id] = local_player
}

function handlePlayers(plrs: Player[]) {
    for (let p of plrs) {
        let player = new Player();
        player.id = p.id;
        player.position = p.position;
        player.velocity = p.velocity;
        if (player.id === own_id) {
            player.color = `#FF0000`;
            camera = player.position;
            // local_player = player;
        }

        players[p.id] = player;
    }
}

function handleDisconnected(plrs: Player[]) {
    for (let p of plrs) {
        delete players[p.id];
    }
}

class KeyboardDirection {
    up = false;
    left = false;
    right = false;
    down = false;
}

let keyboardDirection = new KeyboardDirection();
function sendInput() {
    if (websocket) {
        websocket.send(JSON.stringify(keyboardDirection));
    }
}
function keyDownHandler(event: KeyboardEvent) {
    if (event.repeat) {
        return;
    }

    switch (event.key) {
        case "O":
            // toggleFullscreen();
            return;

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
        case "L":
        case "l":
            console.log(players[own_id]);
            break;
        default:
            return;
    }

    sendInput();
}

function keyUpHandler(event: KeyboardEvent) {
    if (event.repeat) {
        return;
    }

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
        default:
            return;
    }

    sendInput();
}

function main() {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas")!;
    window.addEventListener("resize", () => {
        resizeCanvas(canvas);
    });

    resizeCanvas(canvas);
    let address = "ws://192.168.0.169:10001";
    connect(address);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);

    window.requestAnimationFrame(gameLoop);
}

window.onload = main;
