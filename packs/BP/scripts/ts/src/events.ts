import { world } from "@minecraft/server";


export const subscribeToEvents = () => {

  world.afterEvents.playerJoin.subscribe(event => {
  })

  world.afterEvents.playerSpawn.subscribe(event => {
  })

  world.afterEvents.itemStartUse.subscribe(event => {
  })

  world.afterEvents.itemStopUse.subscribe(event => {
  })

  world.afterEvents.entityLoad.subscribe(event => {
  })

  world.beforeEvents.playerInteractWithEntity.subscribe(event => {
  })
}