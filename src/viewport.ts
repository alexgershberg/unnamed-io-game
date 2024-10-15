import { Position } from "./position";
import { Element } from "./element";
import { player } from "./player";

export class ViewPort {
    position: Position = new Position();

    render(extrapolation: number): void {
        // let elementsInView: Element[] = connection.getElementsNear(
        //     this.position,
        // );

        let elementsInView: Element[] = [player];

        elementsInView.forEach((element) => {
            element.render(extrapolation);
        });
    }
}

export const viewport = new ViewPort();
