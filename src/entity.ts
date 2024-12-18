import { Position } from "./position";
import { Velocity } from "./player";
import {
    box,
    hexagon,
    out_of_range,
    text,
    world_to_canvas_coords,
} from "./util";

export class Entity {
    id: number = -1;
    position: Position = new Position();
    velocity: Velocity = new Velocity();
    entity_type: "box" | "hexagon" = "box";

    constructor() {}
    render(): void {
        let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");

        entity(this, canvas);
        text(
            canvas,
            this.position.x,
            this.position.y + 50,
            `${this.position.x} | ${this.position.y}`,
        );
        text(canvas, this.position.x, this.position.y - 50, `${this.id}`);
    }
}

function entity(entity: Entity, canvas: HTMLCanvasElement) {
    let [x, y] = world_to_canvas_coords(
        canvas,
        entity.position.x,
        entity.position.y,
    );

    let length = 50;
    let line_width = 2;
    switch (entity.entity_type) {
        case "box":
            box(canvas, x, y, "#bb00ff", "#550074", length, line_width);
            break;
        case "hexagon":
            hexagon(canvas, x, y, "#ff9900", "#a26200", length, line_width);
            break;
        default:
            break;
    }
}
