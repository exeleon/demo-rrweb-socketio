import { eventWithTime, listenerHandler } from "@rrweb/types";
import { record } from "rrweb";
import { snapshot } from "rrweb-snapshot";
import { io, Socket } from "socket.io-client";

import { SERVER_URL, SocketEvent } from "../constants";

class Reporter {
  socket?: Socket;
  stop?: listenerHandler;

  init(data: { sessionId: string }) {
    this.socket = io(`${SERVER_URL}/clients`, {
      query: { session_id: data.sessionId },
    });

    this.stop = record({
      emit: this.emit.bind(this),
    });
  }

  private emit(event: eventWithTime) {
    // this.socket?.emit(SocketEvent.DOMEvent, event);
    this.socket?.emit(SocketEvent.DOMEvent, {
      timestamp: Date.now(),
      data: snapshot(document),
    });
  }
}

export default new Reporter();
