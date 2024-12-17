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

let off_canvas: HTMLCanvasElement | null;
function resizeCanvas(canvas: HTMLCanvasElement) {
    canvas.width = window.innerWidth - 6; // 6px is total border width 3px left + 3px right
    canvas.height = window.innerHeight - 6;

    off_canvas = createGrid(canvas.width * 3, canvas.height * 3);
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

function clearCanvas(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
) {
    ctx.clearRect(0, 0, width, height);
}

function createGrid(width: number, height: number): HTMLCanvasElement {
    let canvas = <HTMLCanvasElement>document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    let max = 990;

    // Border
    dot(canvas, max, max, 3);
    dot(canvas, max, -max, 3);
    dot(canvas, -max, max, 3);
    dot(canvas, -max, -max, 3);

    let cell = 15;
    let cell_count = (max * 2) / cell;
    grid(canvas, cell_count, cell_count, cell);
    dot(canvas, 0, 0, 3);
    let notch_len = cell / 2;

    let notch_count = cell_count / 2;
    for (let x = 1; x <= notch_count; x += 1) {
        notch_x(canvas, x * cell, 0, notch_len);
    }

    for (let x = -1; x >= -notch_count; x -= 1) {
        notch_x(canvas, x * cell, 0, notch_len);
    }

    for (let y = 1; y <= notch_count; y += 1) {
        notch_y(canvas, 0, y * cell, notch_len);
    }

    for (let y = -1; y >= -notch_count; y -= 1) {
        notch_y(canvas, 0, y * cell, notch_len);
    }

    return canvas;
}

function line(x: number, y: number) {
    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
    let ctx = canvas.getContext("2d")!;
    let x_offset = x - camera.x;
    let y_offset = -1 * (y - camera.y);

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

function box(canvas: HTMLCanvasElement, x: number, y: number, length: number) {
    let ctx = canvas.getContext("2d")!;
    let [x_translated, y_translated] = world_to_canvas_coords(canvas, x, y);

    ctx.lineWidth = 0.15;
    ctx.strokeStyle = "lightgray";

    ctx.beginPath();
    ctx.moveTo(x_translated - length / 2, y_translated + length / 2);
    ctx.lineTo(x_translated + length / 2, y_translated + length / 2);
    ctx.lineTo(x_translated + length / 2, y_translated - length / 2);
    ctx.lineTo(x_translated - length / 2, y_translated - length / 2);
    ctx.lineTo(x_translated - length / 2, y_translated + length / 2);
    ctx.stroke();
}

function grid(
    canvas: HTMLCanvasElement,
    rows: number,
    cols: number,
    cell: number,
) {
    let left = -(cell * cols) / 2 + cell / 2;
    let bot = -(cell * rows) / 2 + cell / 2;

    for (let x = left; x < (cell * cols) / 2; x += cell) {
        for (let y = bot; y < (cell * rows) / 2; y += cell) {
            box(canvas, x, y, cell);
        }
    }
}

function dotgrid(
    canvas: HTMLCanvasElement,
    rows: number,
    cols: number,
    radius: number,
    padding: number,
) {
    let cell = radius + padding;

    let left = -(cell * cols) / 2 + cell / 2;
    let bot = -(cell * rows) / 2 + cell / 2;

    for (let x = left; x < (cell * cols) / 2; x += cell) {
        for (let y = bot; y < (cell * rows) / 2; y += cell) {
            dot(canvas, x, y, radius);
        }
    }
}

function dot(canvas: HTMLCanvasElement, x: number, y: number, radius: number) {
    let ctx = canvas.getContext("2d")!;
    let [x_translated, y_translated] = world_to_canvas_coords(canvas, x, y);

    ctx.fillStyle = "#FF0000";

    ctx.beginPath();
    ctx.arc(x_translated, y_translated, radius, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

function notch_x(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    length: number,
) {
    let ctx = canvas.getContext("2d")!;
    let [x_translated, y_translated] = world_to_canvas_coords(canvas, x, y);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#FF0000";

    ctx.beginPath();
    ctx.moveTo(x_translated, y_translated - length / 2);
    ctx.lineTo(x_translated, y_translated + length / 2);
    ctx.stroke();
}

function notch_y(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    length: number,
) {
    let ctx = canvas.getContext("2d")!;
    let [x_translated, y_translated] = world_to_canvas_coords(canvas, x, y);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#FF0000";

    ctx.beginPath();
    ctx.moveTo(x_translated - length / 2, y_translated);
    ctx.lineTo(x_translated + length / 2, y_translated);
    ctx.stroke();
}

function world_to_canvas_coords(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
): [number, number] {
    // let x_offset = x - camera.x;
    // let y_offset = -1 * (y - camera.y);
    //
    // let x_translated = x_offset + canvas.width / 2;
    // let y_translated = y_offset + canvas.height / 2;
    //
    // return [x_translated, y_translated];

    return [x + canvas.width / 2, y + canvas.height / 2];
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
export let FPS = 0;
function render(extrapolation: number) {
    let render_current = window.performance.now();
    let render_elapsed = (render_current - render_old) / 1000;

    FPS = Math.round(1 / render_elapsed);
    debug1(`FPS: ${FPS}`);
    debug2(`extrapolation: ${extrapolation}`);
    debugA(`tolerance: ${tolerance}`);

    let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
    let ctx = canvas.getContext("2d")!;
    clearCanvas(ctx, canvas.width, canvas.height);
    if (off_canvas) {
        let x_mid = canvas.width / 2;
        let y_mid = canvas.height / 2;

        ctx.drawImage(
            off_canvas,
            x_mid - off_canvas.width / 2 - camera.x,
            y_mid - off_canvas.height / 2 + camera.y,
        );
    }
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

let players: any = {};
let websocket: WebSocket | null = null;
export let camera: Position = new Position();
export let orientation: number = 0;
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
}

function handlePlayers(plrs: any[]) {
    // console.log("got players")
    for (let p of plrs) {
        let player;
        let new_player = !players[p.id];
        if (new_player) {
            player = new Player();
            players[p.id] = player;
            player.draw_position = p.position;
        } else {
            player = players[p.id];
        }

        player.id = p.id;
        player.server_position = p.position;
        player.velocity = p.velocity;

        if (player.id === own_id) {
            player.color = "#0099FF";
            // camera = player.draw_position;
        } else {
            player.color = "#FF9900";
        }

        player.tick();
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

onmousemove = (event) => {
    let height = window.innerHeight;
    let width = window.innerWidth;

    let x = event.x - width / 2;
    let y = -1 * (event.y - height / 2);

    orientation = Math.atan(y / x);
};

window.onload = main;
