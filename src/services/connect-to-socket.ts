import * as io from "socket.io-client";
import { OnInit } from "@angular/core";
import { environment } from "../environments/environment";
import { Observable } from "rxjs/Observable";

export class ConnectToSocket implements OnInit {
  socket: any;

  ngOnInit() {
    console.log("in socket");
    /* let observable = new Observable((observer: any) => {
      this.socket.on("first", data => {
        observer.next(data);
        console.log(data);
      });
      return observer;
    }); */
  }

  constructor() {
    this.socket = io.connect(environment.socketURL);
  }

  getMessages() {
    let observable = new Observable(observer => {
      this.socket.on("first", data => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      };
    });
    return observable;
  }

  sendMessage(data: any) {
    this.socket.emit("message", data);
  }
}
