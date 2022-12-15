import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { rebuild, createCache, createMirror } from "rrweb-snapshot";
import { io } from "socket.io-client";

import Header from "../../common/components/Header";
import IFramePlayer from "../../common/components/IFramePlayer";
import { SERVER_URL, SocketEvent } from "../../common/constants";

export default function Session() {
  let { sessionId } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const [latency, setLatency] = useState(0);

  useEffect(() => {
    const cache = createCache();
    const mirror = createMirror();

    const socket = io(`${SERVER_URL}/admins`, {
      query: { admin_token: "TEST_ADMIN_TOKEN" },
    });

    socket.on(SocketEvent.Connect, () => {
      socket.emit(SocketEvent.Subscribe, { session_id: sessionId });
    });

    socket.on(SocketEvent.Disconnect, () => setIsConnected(false));

    socket.on(SocketEvent.DOMEvent, (event) => {
      setIsConnected(true);
      setLatency(Date.now() - event.timestamp);
      try {
        rebuild(event.data, {
          doc: window.frames["player" as any].document,
          cache,
          mirror,
        });
      } catch (error) {
        console.warn("Skipping a frame!", error);
      }
    });

    socket.on(SocketEvent.SessionEnd, (endedSession) => {
      setIsConnected(sessionId !== endedSession.id);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [sessionId]);

  return (
    <>
      <Header>
        <span>
          <strong>Session ID:</strong> {sessionId}{" "}
          <small>({isConnected ? "connected" : "disconnected"})</small>
        </span>
        <span>
          {latency}
          {" ms delayed"}
        </span>
      </Header>
      <Divider />
      <IFramePlayer />
    </>
  );
}
