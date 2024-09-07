import { Element } from "./element";
import { Position } from "./position";
import { debugA, debugB, debugC, debugD } from "./debug";

class KeyboardDirection {
    up = false;
    left = false;
    right = false;
    down = false;
}

class Velocity {
    x: number = 0;
    y: number = 0;

    decay(rate_of_change: number) {
        if (this.x > 0) {
            let new_x = this.x - rate_of_change;
            this.x = new_x >= 0 ? new_x : 0;
        }

        if (this.x < 0) {
            let new_x = this.x + rate_of_change;
            this.x = new_x <= 0 ? new_x : 0;
        }

        if (this.y > 0) {
            let new_y = this.y - rate_of_change;
            this.y = new_y >= 0 ? new_y : 0;
        }

        if (this.y < 0) {
            let new_y = this.y + rate_of_change;
            this.y = new_y <= 0 ? new_y : 0;
        }
    }

    grow(
        direction: "up" | "left" | "right" | "down",
        rate_of_change: number,
        max: number,
    ) {
        switch (direction) {
            case "up":
                let uy = this.y + rate_of_change;
                this.y = uy >= max ? max : uy;
                break;
            case "left":
                let lx = this.x - rate_of_change;
                console.log(`lx: ${lx}`);
                this.x = lx <= -max ? -max : lx;
                break;
            case "right":
                let rx = this.x + rate_of_change;
                console.log(`rx: ${rx}`);
                this.x = rx >= max ? max : rx;
                break;
            case "down":
                let dy = this.y - rate_of_change;
                this.y = dy <= -max ? -max : dy;
                break;
        }
    }
}
export class Player implements Element {
    color = `#000000`;
    position: Position = new Position();
    velocity = new Velocity();
    max_speed = 150.0;
    acceleration = 20;
    friction = 0.1;

    keyboardDirection: KeyboardDirection = new KeyboardDirection();

    moveUp() {
        this.velocity.grow("up", this.acceleration, this.max_speed);
    }

    moveLeft() {
        this.velocity.grow("left", this.acceleration, this.max_speed);
    }

    moveRight() {
        this.velocity.grow("right", this.acceleration, this.max_speed);
    }

    moveDown() {
        this.velocity.grow("down", this.acceleration, this.max_speed);
    }

    resetVelocity() {
        this.velocity = new Velocity();
    }

    updateVelocity() {
        if (this.keyboardDirection.up) {
            this.moveUp();
        }

        if (this.keyboardDirection.left) {
            this.moveLeft();
        }

        if (this.keyboardDirection.right) {
            this.moveRight();
        }

        if (this.keyboardDirection.down) {
            this.moveDown();
        }
    }

    updatePosition() {
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }

    input() {
        this.updateVelocity();
    }

    render(extrapolation: number): void {
        let canvas = <HTMLCanvasElement>document.getElementById("ts-canvas");
        let x = this.position.x;
        let y = this.position.y;

        let extrapolated_x =
            ((x + this.velocity.x * extrapolation) / canvas.width) * 2;
        let extrapolated_y =
            ((-1 * (y + this.velocity.y * extrapolation)) / canvas.height) * 2;

        // let extrapolated_x = x / canvas.width;
        // let extrapolated_y = (-1 * y) / canvas.height;

        debugC(`extr: x: ${extrapolated_x.toFixed(2)}`);
        debugD(`extr: y: ${extrapolated_y.toFixed(2)}`);

        let radius = 25;
        let ctx = canvas.getContext("2d")!;
        ctx.beginPath();
        ctx.arc(
            canvas.width * extrapolated_x + canvas.width / 2,
            canvas.height * extrapolated_y + canvas.height / 2,
            radius,
            0,
            Math.PI * 2,
            false,
        );
        ctx.fillStyle = player.color;
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = "#FF0000";
        ctx.stroke();
    }

    tick() {
        player.color = `#00FF00`;

        this.velocity.decay(this.friction);
        this.updatePosition();

        let { x, y } = this.velocity;
        debugA(`x force: ${x}`);
        debugB(`y force: ${y}`);
    }
}

export const player = new Player();
