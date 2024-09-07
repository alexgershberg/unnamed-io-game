import { Position } from "./position";
import { Element } from "./element";
import { connection } from "./connection";

export class ViewPort {
    position: Position = new Position();

    render(extrapolation: number): void {
        let elementsInView: Element[] = connection.getElementsNear(
            this.position,
        );

        elementsInView.forEach((element) => {
            element.render(extrapolation);
        });
    }
}

export const viewport = new ViewPort();
