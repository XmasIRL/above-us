import * as mc from "@minecraft/server";
import * as control from "control";
import { run } from "utils";
import { setupWorld } from "world";

export function onScriptLoad() {
  setupWorld();
}

export function subscribeToEvents() {

  mc.system.beforeEvents.startup.subscribe((event) => {
  });

  mc.world.afterEvents.worldLoad.subscribe((event) => {   
  });
    
  mc.world.afterEvents.playerJoin.subscribe(event => {
  })

  mc.world.afterEvents.playerSpawn.subscribe(event => {
  })

  mc.world.afterEvents.itemStartUse.subscribe(event => {
  })

  mc.world.afterEvents.itemStopUse.subscribe(event => {
  })

  mc.world.afterEvents.entityLoad.subscribe(event => {
  })

  mc.world.beforeEvents.playerInteractWithEntity.subscribe(event => {
    event = control.onInteractEntity(event);
  })

  mc.world.beforeEvents.playerInteractWithBlock.subscribe(event => {
  })

  mc.world.beforeEvents.itemUse.subscribe(event => {
  })

  mc.world.beforeEvents.playerBreakBlock.subscribe(event => {
  })

  mc.world.beforeEvents.entityItemPickup.subscribe(event => {
  })

  mc.world.afterEvents.playerButtonInput.subscribe(event => {
    control.onJump(event);
  })
}