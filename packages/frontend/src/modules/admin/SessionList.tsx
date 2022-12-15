import {
  Box,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Grid,
  styled,
} from "@mui/material";
import OpenInNew from "@mui/icons-material/OpenInNew";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { rebuild, createCache, createMirror } from "rrweb-snapshot";
import { io, Socket } from "socket.io-client";

import Header from "../../common/components/Header";
import IFramePlayer from "../../common/components/IFramePlayer";
import { SERVER_URL, SocketEvent } from "../../common/constants";
import { ActiveSession } from "../../common/types";

export default function SessionList() {
  const [latency, setLatency] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [listeningTo, setListeningTo] = useState<ActiveSession | null>();
  const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([]);
  const socket = useRef<Socket>();

  useEffect(() => {
    const cache = createCache();
    const mirror = createMirror();

    socket.current = io(`${SERVER_URL}/admins`, {
      query: { admin_token: "TEST_ADMIN_TOKEN" },
    });

    socket.current.on(SocketEvent.Connect, () => setIsConnected(true));

    socket.current.on(SocketEvent.Disconnect, () => setIsConnected(false));

    socket.current.on(
      SocketEvent.ActiveSessions,
      (sessions: ActiveSession[]) => {
        setActiveSessions(sessions);
      }
    );

    socket.current.on(SocketEvent.SessionStart, (startedSession) => {
      setActiveSessions((current) =>
        current.filter((s) => s.id !== startedSession.id).concat(startedSession)
      );
    });

    socket.current.on(SocketEvent.SessionEnd, (endedSession) => {
      setActiveSessions((current) =>
        current.filter((s) => s.id !== endedSession.id)
      );
    });

    socket.current.on(SocketEvent.DOMEvent, (event) => {
      setLatency(Date.now() - event.timestamp);
      try {
        rebuild(event.data, {
          doc: window.frames["player" as any].document,
          cache,
          mirror,
        });
      } catch (error) {
        console.warn("Skipping a frame!");
      }
    });

    return () => {
      socket.current?.removeAllListeners();
    };
  }, []);

  const selectActiveSession = (session: ActiveSession) => {
    const frame = document.getElementById("player");
    if (frame) {
      (frame as any).src = "about:blank";
    }

    socket.current?.emit(SocketEvent.Subscribe, { session_id: session.id });
    setListeningTo(session);
  };

  return (
    <>
      <Header>
        <Typography variant="h6">
          Admin{" "}
          <small style={{ fontSize: "14px" }}>
            ({isConnected ? "online" : "offline"})
          </small>
        </Typography>
        <span>
          {latency}
          {" ms delayed"}
        </span>
      </Header>
      <Grid container>
        <Grid item xs={4} sx={{ borderRight: "1px solid #ccc", p: 2 }}>
          <Box sx={{ pr: 2 }}>
            <Typography sx={{ mt: 2, mb: 1, fontSize: "18px" }} variant="h6">
              Active sessions
            </Typography>
            <Divider />
            <List component="nav">
              {activeSessions.map((session, index) => (
                <StyledListItemButton
                  key={index}
                  selected={listeningTo?.id === session.id}
                  onClick={() => selectActiveSession(session)}
                >
                  <ListItemText primary={session.id} />
                  <Link
                    target="_blank"
                    to={`/sessions/${session.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <OpenInNew />
                  </Link>
                </StyledListItemButton>
              ))}
            </List>
            {activeSessions.length === 0 && (
              <p style={{ textAlign: "center" }}>No active sessions</p>
            )}
          </Box>
        </Grid>
        <Grid item xs={8}>
          {!listeningTo && (
            <Instruction>
              <InfoOutlined sx={{ mb: 1, fontSize: 50 }} />
              Select an active session from the list
              <br />
              to start watching
            </Instruction>
          )}
          <IFramePlayer />
        </Grid>
      </Grid>
    </>
  );
}

const StyledListItemButton = styled(ListItemButton)(() => ({
  a: {
    color: "inherit",
    paddingLeft: "16px",
    textDecoration: "none",
    visibility: "hidden",
  },
  "&:hover a": {
    visibility: "visible",
  },
}));

const Instruction = styled("div")(() => ({
  zIndex: 10,
  height: "calc(100vh - 50px)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
}));
