// import WebSocket from "ws";
import { Packet } from "./packet/common";
import { Frame } from "./packet/frame";
import { Id } from "./packet/id";

export class WSClient {
    id: Id;
    websocket: WebSocket;
    open = false;

    constructor(id: Id, address: string) {
        this.id = id;
        let websocket = new WebSocket(address);
        websocket.onopen = () => {
            console.log("Connected");
            // this.open = true;
        };

        websocket.onmessage = (event) => {
            let data = event.data;
            console.log(`onmessage: %o`, data);
        };

        websocket.onclose = () => {
            console.log("Disconnected");
            // this.open = false;
        };

        this.websocket = websocket;
    }

    sendPacket(packet: Packet) {
        // if (!this.open) {
        let frame = new Frame(packet);
        console.log(frame);
        this.websocket.send(frame.toBytes());
        // } else {
        //     console.log(`Tried sending packet while websocket is not open!: ${packet}`)
        // }
    }
}

// import * as readline from "readline";
// import { stdin as input, stdout as output } from "process";
// import { MovementPacket } from "./packet/movement";
// function main() {
//     let client = new Client(new Id(10), "ws://127.0.0.1:10001");
//
//     let rl = readline.createInterface({ input, output });
//     rl.on("line", (line) => {
//         let packet = new MovementPacket({
//             up: true,
//             down: true,
//             left: true,
//             right: true,
//         });
//         client.send_packet(packet);
//     });
// }

// main();
