const sessions: Record<string, any[]> = {};

export function getSession(sessionId: string) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = [];
  }
  return sessions[sessionId];
}
