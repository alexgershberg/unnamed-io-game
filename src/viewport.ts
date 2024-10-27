import { Position } from "./position";
import { Element } from "./element";

export class ViewPort {
    position: Position = new Position();

    render(extrapolation: number): void {


        let elementsInView: Element[] = [];

        elementsInView.forEach((element) => {
            element.render(extrapolation);
        });
    }
}

export const viewport = new ViewPort();
