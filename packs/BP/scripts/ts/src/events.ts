import * as mc from "@minecraft/server";
import * as move from "move";
import * as game from "game";
import * as commands from "commands";
import { run } from "utils";
import { setupWorld } from "game";
import { StartupEvent } from "@minecraft/server";



export function subscribeToEvents() {

  mc.system.beforeEvents.startup.subscribe((event) => {
    event = commands.onSystemStartupBefore(event)
  });

  mc.world.afterEvents.worldLoad.subscribe((event) => {   
  });
    
  mc.world.afterEvents.playerJoin.subscribe(event => {
  })

  mc.world.afterEvents.playerSpawn.subscribe(event => {
  })

  mc.world.afterEvents.itemStartUse.subscribe(event => {
    event = move.onItemStartUseAfter(event)
  })

  mc.world.afterEvents.itemStopUse.subscribe(event => {
  })


  mc.world.beforeEvents.playerInteractWithEntity.subscribe(event => {
    event = move.onPlayerInteractWithEntityAfter(event)
  })

  mc.world.beforeEvents.playerInteractWithBlock.subscribe(event => {
    event = move.onPlayerInteractWithBlockAfter(event)
  })

  mc.world.beforeEvents.itemUse.subscribe(event => {
  })

  mc.world.beforeEvents.playerBreakBlock.subscribe(event => {
    event = move.onPlayerBreakBlockBefore(event)
  })

  mc.world.beforeEvents.entityItemPickup.subscribe(event => {
  })

  mc.world.afterEvents.playerButtonInput.subscribe(event => {
  })

  mc.world.afterEvents.entitySpawn.subscribe(event => {
    event = move.onEntitySpawnAfter(event)
  })

  mc.world.afterEvents.entityLoad.subscribe(event => {
    event = move.onEntityLoadAfter(event);
  })
}