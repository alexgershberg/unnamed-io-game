import { camera } from "./index";
import { Position } from "./position";

export function circle(
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

export function triangle(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    color: string,
    radius: number,
    orientation: number,
) {
    shape_with_n_sides(3, canvas, x, y, color, radius, orientation);
}

export function hexagon(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    fill_style: string,
    strokeStyle: string,
    radius: number,
    line_width: number,
    orientation: number,
) {
    shape_with_n_sides(5, canvas, x, y, fill_style, radius, orientation);
}

export function box(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    fill_style: string,
    stroke_style: string,
    radius: number,
    line_width: number,
    orientation: number,
) {
    shape_with_n_sides(4, canvas, x, y, fill_style, radius, orientation);
}

export function text(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    txt: string,
) {
    let [x_translated, y_translated] = world_to_canvas_coords(canvas, x, y);
    let ctx = canvas.getContext("2d")!;

    ctx.textAlign = "center";
    ctx.font = "20px Cascadia Code";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#000000";
    ctx.fillText(txt, x_translated, y_translated);
}

export function world_to_canvas_coords(
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

function shape_with_n_sides(
    sides: number,
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    color: string,
    radius: number,
    orientation: number,
) {
    let ctx = canvas.getContext("2d")!;

    const angle = (2 * Math.PI) / sides;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#666666";
    ctx.fillStyle = color;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        let xi = x + radius * Math.cos(angle * i - orientation); // TODO: My final geogebra calculation I had "+ orientation" rather than "- orientation"
        let yi = y + radius * Math.sin(angle * i - orientation);
        ctx.lineTo(xi, yi);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export function out_of_range(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
): boolean {
    console.log(
        `out of range? | x: ${x} y: ${y} | width: ${canvas.width} height: ${canvas.height}`,
    );
    return true;
}

export function boundingBox(
    sides: number,
    radius: number,
    draw_position: Position,
    draw_orientation: number,
    canvas: HTMLCanvasElement,
) {
    let [x_translated, y_translated] = world_to_canvas_coords(
        canvas,
        draw_position.x,
        draw_position.y,
    );

    let x_max = -Infinity;
    let x_min = Infinity;
    let y_max = -Infinity;
    let y_min = Infinity;

    const angle = (2 * Math.PI) / sides;

    // calculate min and max points for the box
    for (let i = 0; i < sides; i++) {
        let x = x_translated + radius * Math.cos(angle * i - draw_orientation);
        x_max = Math.max(x_max, x);
        x_min = Math.min(x_min, x);

        let y = y_translated + radius * Math.sin(angle * i - draw_orientation);
        y_max = Math.max(y_max, y);
        y_min = Math.min(y_min, y);
    }

    // draw the box
    let ctx = canvas.getContext("2d")!;

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#000000";

    ctx.beginPath();
    ctx.moveTo(x_min, y_max);
    ctx.lineTo(x_max, y_max);
    ctx.lineTo(x_max, y_min);
    ctx.lineTo(x_min, y_min);
    ctx.lineTo(x_min, y_max);
    ctx.closePath();
    ctx.stroke();
}
