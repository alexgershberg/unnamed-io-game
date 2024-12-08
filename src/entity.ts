import { Position } from "./position";

export interface Entity {
    position: Position;
    render(extrapolation: number): void;
}
