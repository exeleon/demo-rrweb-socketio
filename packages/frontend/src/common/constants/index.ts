export const SERVER_URL = "http://localhost:3001";

export enum SocketEvent {
  Connect = "connect",
  Disconnect = "disconnect",
  ActiveSessions = "active_sessions",
  SessionStart = "session_start",
  SessionEnd = "session_end",
  Subscribe = "subscribe",
  DOMEvent = "dom_event",
}
