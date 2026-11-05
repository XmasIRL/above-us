import * as mc from "@minecraft/server";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";
import { Defaults } from "constants";
import { createSession, getSession, saveSessions, startSession } from "game";
import { PlayerData } from "player";
import { Bounds, BoundsDimension, printActionBar, print } from "utils";


export function onSystemStartupBefore(event: mc.StartupEvent): mc.StartupEvent {
 
  const setupGameCommand : mc.CustomCommand = {
    name: "x:setup",
    description: "Setup a game of Above Us.",
    permissionLevel: mc.CommandPermissionLevel.Admin,
    cheatsRequired: false,
    mandatoryParameters: [      
      { name: "from"                  , type: mc.CustomCommandParamType.Location },
      { name: "to"                    , type: mc.CustomCommandParamType.Location },
    ],
    optionalParameters: [
      { name: "dimension"             , type: mc.CustomCommandParamType.String  },
      { name: "gameID"                , type: mc.CustomCommandParamType.String  },
      { name: "addAllCurrentPlayers"  , type: mc.CustomCommandParamType.Boolean },
    ],
  }
  
  const setupGameCommandCallback = (
    origin       : mc.CustomCommandOrigin,
    from         : mc.Vector3,
    to           : mc.Vector3,
    dimension    : string       = MinecraftDimensionTypes.Overworld,
    id           : string       = Defaults.sessionID,
    addAllPlayers: boolean      = true
  ) : mc.CustomCommandResult => {
    const data = {
      players  : addAllPlayers  ? mc.world.getAllPlayers()
                                : origin.sourceEntity instanceof mc.Player  ? [origin.sourceEntity] 
                                                                            : [],
      entities : [],
      moves    : [],
      playArea : {from, to, dimension}
    }
    createSession(data, id);
    return { message: `§2Game (id: ${id}) created!§r`, status: mc.CustomCommandStatus.Success };
  }

  event.customCommandRegistry.registerCommand(setupGameCommand,setupGameCommandCallback)
  

  const startGameCommand : mc.CustomCommand = {
    name: "x:start",
    description: "Start a game of Above Us.",
    permissionLevel: mc.CommandPermissionLevel.Admin,
    cheatsRequired: false,
    optionalParameters: [
      { name: "id", type: mc.CustomCommandParamType.String  }
    ]
  }

  const startGameCommandCallback = (
    origin: mc.CustomCommandOrigin,
    id: string = Defaults.sessionID
  ): mc.CustomCommandResult => {

    try {
      const session = getSession(id);
      if (session) {
        startSession(id)
        return { status: mc.CustomCommandStatus.Success, message: `§2Started game (id: ${id})!§r` };
      }
      else return { status: mc.CustomCommandStatus.Failure, message: `§cGame (id: ${id}) not found!§r` };
    } 
    catch(e) { return { message: `Failed to start game with error: ${e}`, status: mc.CustomCommandStatus.Failure }; }
  
  }

  event.customCommandRegistry.registerCommand(startGameCommand,startGameCommandCallback)

  
  const listGamesCommand : mc.CustomCommand = {
    name: "x:list",
    description: "List created games of Above Us.",
    permissionLevel: mc.CommandPermissionLevel.Admin,
    cheatsRequired: false
  }

  const listGamesCommandCallback = (
    origin: mc.CustomCommandOrigin
  ): mc.CustomCommandResult => {

    try {
      const sessions = globalThis.sessions ?? {};
      if (sessions && Object.keys(sessions).length) {
        Object.entries(sessions).forEach(([k,v]) => print(k,'\n',JSON.stringify(v.toJSON())))
        return { status: mc.CustomCommandStatus.Success, message: `§2Found ${Object.keys(sessions).length} games!§r` };
      }
      else return { status: mc.CustomCommandStatus.Failure, message: `§cNo games found!§r` };
    } 
    catch(e) { return { message: `Failed to list game with error: ${e}`, status: mc.CustomCommandStatus.Failure }; }
  
  }

  event.customCommandRegistry.registerCommand(listGamesCommand,listGamesCommandCallback)

  
  const clearGamesCommand : mc.CustomCommand = {
    name: "x:clear",
    description: "Clear Above Us games list.",
    permissionLevel: mc.CommandPermissionLevel.Admin,
    cheatsRequired: false
  }

  const clearGamesCommandCallback = (
    origin: mc.CustomCommandOrigin
  ): mc.CustomCommandResult => {

    try {
      const count = globalThis.sessions ? Object.keys(globalThis.sessions).length : 0;
      globalThis.sessions = {};
      saveSessions();
      if (count) {
        return { status: mc.CustomCommandStatus.Success, message: `§2Cleared ${count} games!§r` };
      }
      else return { status: mc.CustomCommandStatus.Failure, message: `§cNo games found!§r` };
    } 
    catch(e) { return { message: `Failed to clear game with error: ${e}`, status: mc.CustomCommandStatus.Failure }; }
  
  }

  event.customCommandRegistry.registerCommand(clearGamesCommand,clearGamesCommandCallback)

  return event;
}
