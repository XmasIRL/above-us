// handle game start, end, restart, cleanup, setup, onboarding, pause/resume

import { VECTOR2_ZERO, VECTOR3_ZERO, Vector3Utils } from "@minecraft/math";
import * as mc from "@minecraft/server";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";
import { Defaults, DynamicProperties } from "constants";
import { EntityData } from "entity";
import { Move } from "move";
import { PlayerData } from "player";
import { Bounds, BoundsDimension, generateUUID, getOverworld, run, save, load, print, clearChat } from "utils";


export class Session {
  constructor(
    public players  : PlayerData[] = [],
    public entities : EntityData[] = [],
    public moves    : Move[]       = [],
    public playArea?: BoundsDimension,
  ){}
  public static fromJSON(data:any){return new Session(
    data?.players  && Array.isArray(data.players)  ? Array.from(data.players , value => PlayerData.fromJSON(value)) : [],
    data?.entities && Array.isArray(data.entities) ? Array.from(data.entities, value => EntityData.fromJSON(value)) : [],
    data?.moves    && Array.isArray(data.moves)    ? Array.from(data.moves   , value => Move.fromJSON(value))       : [],
    data?.playArea && data.playArea                ? BoundsDimension.fromJSON(data.playArea)                        : undefined
  )}
  public toJSON(){ return {
    players  : Array.from(this.players  ?? [],value => value.toJSON()),
    entities : Array.from(this.entities ?? [],value => value.toJSON()),
    moves    : Array.from(this.moves    ?? [],value => value.toJSON()),
    playArea : this.playArea?.toJSON()
  }}
}

export function setupWorld() {  
  run (() => {
    loadDimensions();
    loadSessions();
  })
}

export function loadDimensions() {
  globalThis.dimensions = {};
  globalThis.dimensions.overworld = mc.world.getDimension(MinecraftDimensionTypes.Overworld);
  globalThis.dimensions.nether    = mc.world.getDimension(MinecraftDimensionTypes.Nether);
  globalThis.dimensions.theEnd    = mc.world.getDimension(MinecraftDimensionTypes.TheEnd);
}

export function getSession(id:string) { 
  return globalThis.sessions[id] ; 
}

export function createSession(data:any, id:string = generateUUID()) { 
  globalThis.sessions[id] = Session.fromJSON(data);
  saveSessions(); 
  return id; 
}

export function loadSessions() { 
  
  const data = load(DynamicProperties.sessions);
  if (typeof data !== 'string') return;
  globalThis.sessions = Object.assign({}, ...Object.entries(JSON.parse(data)).map(([k,v]) => ({
    [k]: Session.fromJSON(v)
  })))
  print(JSON.stringify(globalThis.sessions,null,2));
}


export function saveSessions() { 
  const data:{[key:string]:any} = {};
  Object.keys(globalThis.sessions).forEach( (key) => { data[key] = globalThis.sessions[key].toJSON() })
  save(DynamicProperties.sessions,JSON.stringify(data)); 
}

export function startSession(id:string) {
  const session = getSession(id);
  session.players.forEach(player => {
    if (session.playArea){
      player.entity?.teleport(
        { ...session.playArea.getCentre(), y: (session.playArea.getMax().y ?? 0) + 100 },
        { 
          dimension: session.playArea.dimension, 
          facingLocation: session.playArea.getCentre() 
        }
      )
    }
  })
}