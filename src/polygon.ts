import { Position } from "./position";
import { angle_delta, change_angle, Velocity } from "./player";
import {
    boundingBox,
    box,
    hexagon,
    text,
    world_to_canvas_coords,
} from "./util";

export class Polygon {
    id: number = -1;
    draw_orientation: number = 0;
    server_orientation: number = 0;
    position: Position = new Position();
    velocity: Velocity = new Velocity();
    shape: "square" | "hexagon" = "square";
    orientation_delta: number = 0;

    constructor() {}
    render(): void {
        let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");

        this.interpolate();

        polygon(this, canvas);
        text(
            canvas,
            this.position.x,
            this.position.y + 50,
            `${this.position.x} | ${this.position.y}`,
        );
        text(canvas, this.position.x, this.position.y - 50, `${this.id}`);

        let sides = this.shape === "square" ? 4 : 5;
        let radius = 50;
        boundingBox(
            sides,
            radius,
            this.position,
            this.draw_orientation,
            canvas,
        );
    }

    tick() {
        this.orientation_delta =
            angle_delta(this.draw_orientation, this.server_orientation) / 5;
    }

    interpolate() {
        this.draw_orientation = change_angle(
            this.draw_orientation,
            this.server_orientation,
            this.orientation_delta,
        );
    }
}

function polygon(polygon: Polygon, canvas: HTMLCanvasElement) {
    let [x, y] = world_to_canvas_coords(
        canvas,
        polygon.position.x,
        polygon.position.y,
    );

    let line_width = 2;
    switch (polygon.shape) {
        case "square":
            box(
                canvas,
                x,
                y,
                "#bb00ff",
                "#550074",
                50,
                line_width,
                polygon.draw_orientation,
            );
            break;
        case "hexagon":
            hexagon(
                canvas,
                x,
                y,
                "#ff9900",
                "#a26200",
                50,
                line_width,
                polygon.draw_orientation,
            );
            break;
        default:
            break;
    }
}
