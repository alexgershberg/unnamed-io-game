import { Position } from "./position";
import { camera, orientation, own_id } from "./index";

export class Velocity {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }
}

export class Player {
    color = `#000000`;
    id: number = -1;
    position: Position = new Position();
    velocity = new Velocity();
    orientation: number = 0;

    constructor() {}

    render(extrapolation: number): void {
        let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");

        player(this, canvas);

        text(canvas,
            this.position.x,
            this.position.y + 50,
            `${this.velocity.x} | ${this.velocity.y}`,
        );
        text(canvas,
            this.position.x,
            this.position.y + 100,
            `${this.position.x} | ${this.position.y}`,
        );
    }
}

function text(canvas: HTMLCanvasElement, x: number, y: number, txt: string) {
    let [x_translated, y_translated] = world_to_canvas_coords(canvas, x, y);
    let ctx = canvas.getContext("2d")!;

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(txt, x_translated, y_translated);
}

function player(player: Player, canvas: HTMLCanvasElement) {
    let [x_translated, y_translated] = world_to_canvas_coords(canvas, player.position.x, player.position.y);
    let ctx = canvas.getContext("2d")!;

    let radius = 25;
    // circle(canvas, x_translated, y_translated, player.color, radius)
    triangle(canvas, x_translated, y_translated, player.color, radius)
}

function circle(canvas: HTMLCanvasElement, x: number, y: number, color: string, radius: number) {
    let ctx = canvas.getContext("2d")!;

    ctx.fillStyle = color;
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FF0000";

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    // ctx.stroke();
}

function triangle(canvas: HTMLCanvasElement, x: number, y: number, color: string, radius: number) {
    let ctx = canvas.getContext("2d")!;

    let sides = 3;
    const angle = 2 * Math.PI / sides;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FF0000";
    ctx.fillStyle = color;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        ctx.lineTo(x + radius * Math.sin(angle * i + orientation), y + radius * Math.cos(angle * i + orientation));
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function hex(canvas: HTMLCanvasElement, x: number, y: number, color: string, radius: number) {
    let ctx = canvas.getContext("2d")!;

    let sides = 6;
    const a = 2 * Math.PI / sides;

    ctx.lineWidth = 4;
    ctx.strokeStyle = "#FF0000";
    ctx.fillStyle = color;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        ctx.lineTo(x + radius * Math.sin(a * i), y + (-1 * radius * Math.cos(a * i)));
    }
    ctx.closePath();
    ctx.fill();
    // ctx.stroke();
}

function world_to_canvas_coords(canvas: HTMLCanvasElement, x: number, y: number): [number, number] {
    let x_offset = x - camera.x;
    let y_offset = -1 * (y - camera.y);

    let x_translated = x_offset + canvas.width / 2;
    let y_translated = y_offset + canvas.height / 2;

    return [x_translated, y_translated];
}
