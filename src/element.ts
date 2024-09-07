import { Position } from "./position";

export interface Element {
    position: Position;
    render(extrapolation: number): void;
    tick(): void;
}
