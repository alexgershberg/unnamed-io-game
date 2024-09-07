import { Element } from "./element";
import { Position } from "./position";

export class Connection {
    getElementsNear(position: Position): Element[] {
        return [];
    }
}

export const connection = new Connection();
