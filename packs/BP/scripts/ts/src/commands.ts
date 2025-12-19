import { CommandPermissionLevel, CustomCommandOrigin, CustomCommandResult, system } from "@minecraft/server";
import { getPlayer, tryRun } from "lib";
import { spawnVillager } from "./village";



/// COMMAND UTILS ///

export type CustomCommandCallback    = (origin:CustomCommandOrigin,...args:any) => CustomCommandResult | undefined;
export type CustomCommandCallbackAny = (origin:CustomCommandOrigin,...args:any) => any;

export function toCustomCommandFn (fn: CustomCommandCallbackAny): CustomCommandCallback {
  return (origin,...args) => {
    tryRun(() => fn({...origin, sourceEntity: origin.sourceEntity ?? getPlayer()},...args))
    return undefined;
  }
}



/// CUSTOM COMMANDS ///

export const customCommands = [
  {
    command: {
      name            : "xmas_above:spawn_villager",
      description     : "Spawn a (modded) villager.",
      permissionLevel : CommandPermissionLevel.GameDirectors,
      cheatsRequired  : true,
    },
    fn: toCustomCommandFn( origin => {
      return spawnVillager( origin.sourceEntity!.location, origin.sourceEntity!.dimension );
    })
  },
  {
    command: {
      name            : "xmas_above:tp_village",
      description     : "Teleport to testing village.",
      permissionLevel : CommandPermissionLevel.GameDirectors,
      cheatsRequired  : true,
    },
    fn: toCustomCommandFn( origin => {
      return origin.sourceEntity!.teleport({ x:-14456.80, y:83.08, z:-1389.04 });
    })
  },
]



/// REGISTER CUSTOM COMMANDS ///

system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {
  customCommands.forEach((value) => {
    customCommandRegistry.registerCommand(value.command,value.fn)
  });
});

