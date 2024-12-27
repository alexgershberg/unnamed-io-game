import { Position } from "./position";
import { camera, orientation, own_id } from "./index";
import {
    boundingBox,
    box,
    text,
    triangle,
    world_to_canvas_coords,
} from "./util";

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
    draw_orientation: number = 0;
    server_orientation: number = 0;
    x_delta: number = 0;
    y_delta: number = 0;
    orientation_delta: number = 0;

    constructor() {}

    render(extrapolation: number): void {
        let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");

        this.interpolate();

        // Reset camera
        if (this.id === own_id) {
            camera.x = this.draw_position.x;
            camera.y = this.draw_position.y;

            this.draw_orientation = orientation;
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
        text(
            canvas,
            this.draw_position.x,
            this.draw_position.y + 150,
            `${this.draw_orientation} | ${this.orientation_delta}`,
        );
        text(
            canvas,
            this.draw_position.x,
            this.draw_position.y - 30,
            `${this.id}`,
        );
    }

    tick() {
        this.x_delta = (this.server_position.x - this.draw_position.x) / 5;
        this.y_delta = (this.server_position.y - this.draw_position.y) / 5;
        this.orientation_delta =
            angle_delta(this.draw_orientation, this.server_orientation) / 5;
    }

    interpolate() {
        // this.draw_position = this.server_position;
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

        if (this.id !== own_id) {
            this.draw_orientation = change_angle(
                this.draw_orientation,
                this.server_orientation,
                this.orientation_delta,
            );
        }
    }
}

function player(player: Player, canvas: HTMLCanvasElement) {
    let [x_translated, y_translated] = world_to_canvas_coords(
        canvas,
        player.draw_position.x,
        player.draw_position.y,
    );
    let ctx = canvas.getContext("2d")!;

    let radius = 45;
    // let radius = 15;
    // circle(canvas, x_translated, y_translated, player.color, radius)
    triangle(
        canvas,
        x_translated,
        y_translated,
        player.color,
        radius,
        player.draw_orientation,
    );
    boundingBox(3, 45, player.draw_position, player.draw_orientation, canvas);
}

export function angle_delta(angle1: number, angle2: number): number {
    let diff = ((angle2 - angle1 + Math.PI) % (2.0 * Math.PI)) - Math.PI;
    return diff < -Math.PI ? diff + 2.0 * Math.PI : diff;
}

export function change_angle(
    origin: number,
    target: number,
    delta: number,
): number {
    let new_val = (origin + delta) % (2.0 * Math.PI);
    if (Math.sign(delta) === 1.0) {
        let wrap = origin > Math.PI && target <= Math.PI;
        if (wrap) {
            let target_adjusted = target + 2.0 * Math.PI;
            new_val = Math.min(new_val, target_adjusted);
        } else {
            new_val = Math.min(new_val, target);
        }
    } else {
        let wrap = origin <= Math.PI && target > Math.PI;
        if (wrap) {
            let target_adjusted = target - 2.0 * Math.PI;
            new_val = Math.max(new_val, target_adjusted);
            new_val += 2.0 * Math.PI;
        } else {
            new_val = Math.max(new_val, target);
        }
    }

    return new_val;
}
