import { Position } from "./position";
import { camera, FPS, orientation, own_id } from "./index";

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
    draw_position: Position = new Position();
    server_position: Position = new Position();
    velocity = new Velocity();
    orientation: number = 0;
    x_delta: number = 0;
    y_delta: number = 0;

    constructor() {}

    render(extrapolation: number): void {
        let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");

        this.interpolate();

        // Reset camera
        if (this.id === own_id) {
            camera.x = this.draw_position.x;
            camera.y = this.draw_position.y;
        }

        player(this, canvas);

        text(
            canvas,
            this.draw_position.x,
            this.draw_position.y + 50,
            `${this.velocity.x} | ${this.velocity.y}`,
        );
        text(
            canvas,
            this.draw_position.x,
            this.draw_position.y + 100,
            `${this.server_position.x} | ${this.server_position.y}`,
        );
    }

    tick() {
        if (this.id === own_id) {
            console.log("tick");
        }

        this.x_delta = (this.server_position.x - this.draw_position.x) / 5;
        this.y_delta = (this.server_position.y - this.draw_position.y) / 5;
    }

    interpolate() {
        if (Math.sign(this.x_delta) === 1) {
            this.draw_position.x = Math.min(
                this.draw_position.x + this.x_delta,
                this.server_position.x,
            );
        } else {
            this.draw_position.x = Math.max(
                this.draw_position.x + this.x_delta,
                this.server_position.x,
            );
        }

        if (Math.sign(this.y_delta) === 1) {
            this.draw_position.y = Math.min(
                this.draw_position.y + this.y_delta,
                this.server_position.y,
            );
        } else {
            this.draw_position.y = Math.max(
                this.draw_position.y + this.y_delta,
                this.server_position.y,
            );
        }
    }
}

function text(canvas: HTMLCanvasElement, x: number, y: number, txt: string) {
    let [x_translated, y_translated] = world_to_canvas_coords(canvas, x, y);
    let ctx = canvas.getContext("2d")!;

    ctx.textAlign = "center";
    ctx.font = "20px Cascadia Code";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(txt, x_translated, y_translated);
}

function player(player: Player, canvas: HTMLCanvasElement) {
    let [x_translated, y_translated] = world_to_canvas_coords(
        canvas,
        player.draw_position.x,
        player.draw_position.y,
    );
    let ctx = canvas.getContext("2d")!;

    // let radius = 25;
    let radius = 15;
    // circle(canvas, x_translated, y_translated, player.color, radius)
    triangle(canvas, x_translated, y_translated, player.color, radius);
}

function circle(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    color: string,
    radius: number,
) {
    let ctx = canvas.getContext("2d")!;

    ctx.fillStyle = color;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#FF0000";

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
    // ctx.stroke();
}

function triangle(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    color: string,
    radius: number,
) {
    let ctx = canvas.getContext("2d")!;

    let sides = 3;
    const angle = (2 * Math.PI) / sides;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#666666";
    ctx.fillStyle = color;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        ctx.lineTo(
            x + radius * Math.sin(angle * i + orientation),
            y + radius * Math.cos(angle * i + orientation),
        );
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function hex(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    color: string,
    radius: number,
) {
    let ctx = canvas.getContext("2d")!;

    let sides = 6;
    const angle = (2 * Math.PI) / sides;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#FF0000";
    ctx.fillStyle = color;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        ctx.lineTo(
            x + radius * Math.sin(angle * i),
            y + -1 * radius * Math.cos(angle * i),
        );
    }
    ctx.closePath();
    ctx.fill();
    // ctx.stroke();
}

function world_to_canvas_coords(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
): [number, number] {
    let x_offset = x - camera.x;
    let y_offset = -1 * (y - camera.y);

    let x_translated = x_offset + canvas.width / 2;
    let y_translated = y_offset + canvas.height / 2;

    return [x_translated, y_translated];
}
