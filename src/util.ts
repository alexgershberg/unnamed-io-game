import { camera, orientation } from "./index";

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
    let ctx = canvas.getContext("2d")!;

    let sides = 3;
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

export function hexagon(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    fillStyle: string,
    strokeStyle: string,
    radius: number,
    line_width: number,
) {
    let ctx = canvas.getContext("2d")!;

    let sides = 5;
    const angle = (2 * Math.PI) / sides;

    ctx.lineWidth = line_width;
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;

    ctx.beginPath();
    for (let i = 0; i < sides; i++) {
        ctx.lineTo(
            x + radius * Math.sin(angle * i),
            y + -1 * radius * Math.cos(angle * i),
        );
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

export function box(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    fill_style: string,
    stroke_style: string,
    length: number,
    line_width: number,
) {
    let ctx = canvas.getContext("2d")!;

    ctx.lineWidth = line_width;
    ctx.fillStyle = fill_style;
    ctx.strokeStyle = stroke_style;

    ctx.beginPath();
    ctx.moveTo(x - length / 2, y + length / 2);
    ctx.lineTo(x + length / 2, y + length / 2);
    ctx.lineTo(x + length / 2, y - length / 2);
    ctx.lineTo(x - length / 2, y - length / 2);
    ctx.lineTo(x - length / 2, y + length / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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
