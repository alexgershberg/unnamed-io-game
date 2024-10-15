import WebSocket from "ws";
import * as readline from "readline";
import { stdin as input, stdout as output } from "process";
import { Packet } from "./packet/common";
import { MovementPacket } from "./packet/movement";
import { Frame } from "./packet/frame";
import { Id } from "./packet/id";

class Client {
    id: Id;
    websocket: WebSocket;

    constructor(id: Id, address: string) {
        this.id = id;
        let websocket = new WebSocket(address);
        websocket.on("open", () => {
            console.log("Connected");
        });

        websocket.onmessage = (event) => {
            let data = event.data;
            console.log(`onmessage: %o`, data);
        };

        websocket.on("close", () => {
            console.log("Disconnected");
        });

        this.websocket = websocket;
    }

    send_packet(packet: Packet) {
        let frame = new Frame(this.id, packet);
        console.log(frame);
        this.websocket.send(frame.to_bytes());
    }
}

function main() {
    let client = new Client(new Id(10), "ws://127.0.0.1:10001");

    let rl = readline.createInterface({ input, output });
    rl.on("line", (line) => {
        let packet = new MovementPacket({
            up: true,
            down: true,
            left: true,
            right: true,
        });
        client.send_packet(packet);
    });
}

main();
