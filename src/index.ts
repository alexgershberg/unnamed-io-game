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
    debugC,
} from "./debug";
import { Player } from "./player";
import { Position } from "./position";
import { Polygon } from "./polygon";
import { triangle } from "./util";

let off_canvas: HTMLCanvasElement | null;
let scale = 2.0; // https://stackoverflow.com/questions/50566991/increase-html5-canvas-resolution
function resizeCanvas(canvas: HTMLCanvasElement) {
    let width = window.innerWidth - 6; // 6px is total border width 3px left + 3px right
    let height = window.innerHeight - 6;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    canvas.width = width * scale;
    canvas.height = height * scale;
    off_canvas = createGrid(width, height, scale);
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

function createGrid(
    width: number,
    height: number,
    scale: number,
): HTMLCanvasElement {
    let canvas = <HTMLCanvasElement>document.createElement("canvas");

    let max = 4000;
    let max_length = max * 2;
    canvas.width = max_length * scale;
    canvas.height = max_length * scale;
    canvas.style.width = max_length + "px";
    canvas.style.height = max_length + "px";

    dot(canvas, 0, 250, 3);
    dot(canvas, 250, 0, 3);

    // Border
    dot(canvas, max, max, 3);
    dot(canvas, max, -max, 3);
    dot(canvas, -max, max, 3);
    dot(canvas, -max, -max, 3);

    let cell = 25;
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

    let [x_t, y_t] = world_to_canvas_coords(canvas, 150, 150);
    triangle(canvas, x_t, y_t, "#0000FF", 60, Math.PI / 2);

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
            let [x_translated, y_translated] = world_to_canvas_coords(
                canvas,
                x,
                y,
            );
            gridBox(canvas, x_translated, y_translated, cell, 0.3);
        }
    }
}

function gridBox(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    length: number,
    line_width: number,
) {
    let ctx = canvas.getContext("2d")!;

    ctx.lineWidth = line_width;
    ctx.strokeStyle = "lightgray";

    ctx.beginPath();
    ctx.moveTo(x - length / 2, y + length / 2);
    ctx.lineTo(x + length / 2, y + length / 2);
    ctx.lineTo(x + length / 2, y - length / 2);
    ctx.lineTo(x - length / 2, y - length / 2);
    ctx.lineTo(x - length / 2, y + length / 2);
    ctx.stroke();
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

    return [x + canvas.width / 2, -1 * y + canvas.height / 2];
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

    for (const [id, polygon] of Object.entries(polygons)) {
        polygon.render();
    }

    for (const [id, player] of Object.entries(players)) {
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

let players: { [key: number]: Player } = {};
let polygons: { [key: number]: Polygon } = {};
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
            handleId(json.id);
            handlePlayers(json.players);
            handlePolygons(json.polygons);
        }

        if (json.type == "players") {
            handlePlayers(json.players);
        }

        if (json.type == "disconnect") {
            handleDisconnected(json.players);
        }

        if (json.type == "polygons") {
            console.log(json);
            handlePolygons(json.polygons);
        }

        reset_last_tick();
    };

    websocket.onclose = () => {
        console.log("Disconnected");
    };
}

export let own_id: number = -1;
function handleId(id: number) {
    own_id = id;
}

function handlePlayers(plrs: any[]) {
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
            player.color = "#ff0099";
            player.server_orientation = p.orientation; // Ignore server orientation on "our" player, we've got the latest locally
        }

        player.tick();
    }
}

function handlePolygons(plgns: any[]) {
    for (let p of plgns) {
        let polygon;
        let new_polygon = !polygons[p.id];
        if (new_polygon) {
            polygon = new Polygon();
            polygons[p.id] = polygon;
        } else {
            polygon = polygons[p.id];
        }

        polygon.id = p.id;
        polygon.position = p.position;
        polygon.velocity = p.velocity;
        polygon.shape = p.shape;
        polygon.server_orientation = p.orientation;

        polygon.tick();
    }
}

function handleDisconnected(plrs: Player[]) {
    for (let p of plrs) {
        delete players[p.id];
    }
}

class Movement {
    up = false;
    left = false;
    right = false;
    down = false;
}

let movement = new Movement();
function sendInput() {
    let request = JSON.stringify({ type: "movement", value: movement });
    send(request);
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
            movement.up = true;
            break;

        case "A":
        case "a":
            movement.left = true;
            break;

        case "D":
        case "d":
            movement.right = true;
            break;

        case "S":
        case "s":
            movement.down = true;
            break;
        case "L":
        case "l":
            console.log(players[own_id]);
            break;
        default:
            return;
    }
    debugC(`scale: ${scale}`);

    sendInput();
}

function keyUpHandler(event: KeyboardEvent) {
    if (event.repeat) {
        return;
    }

    switch (event.key) {
        case "W":
        case "w":
            movement.up = false;
            break;

        case "A":
        case "a":
            movement.left = false;
            break;

        case "D":
        case "d":
            movement.right = false;
            break;

        case "S":
        case "s":
            movement.down = false;
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
    let address = "ws://127.0.0.1:10001";
    connect(address);
    window.addEventListener("keydown", keyDownHandler);
    window.addEventListener("keyup", keyUpHandler);
    onmousemove = (event) => {
        let height = window.innerHeight;
        let width = window.innerWidth;

        let x = event.x - width / 2;
        let y = -1 * (event.y - height / 2);

        let angle = Math.atan2(y, x);
        if (angle < 0.0) {
            angle += 2.0 * Math.PI; // Normalize between 0 and 2PI
        }
        orientation = angle;

        let request = JSON.stringify({
            type: "orientation",
            value: orientation,
        });
        send(request);
    };

    window.requestAnimationFrame(gameLoop);
}

function send(msg: any) {
    if (websocket) {
        if (websocket.readyState == websocket.OPEN) {
            websocket.send(msg);
        }
    }
}

window.onload = main;
