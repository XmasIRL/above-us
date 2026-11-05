
export const Defaults = {
  sessionID: "default"
}

export const DynamicProperties = {
  sessions: "x:sessions",
  sessionID: "x:session_id",
  selectedMob: "x:selected_mob",
  move: "x:move"
} as const;

export const EntityEvents = {
  startMove: "x:start_move",
  stopMove: "x:stop_move"
} as const;

export const EntityTypes = {
  move: "x:move"
} as const;