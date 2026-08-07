import { world } from "@minecraft/server";
import { onPlayerItemStartUse, onPlayerItemStopUse, onPlayerJoin, onPlayerSpawn } from 'player'
import { onPlayerInteractWish, onWishLoad } from "wish";


export const subscribeToEvents = () => {

  world.afterEvents.playerJoin.subscribe(event => {
    onPlayerJoin(event);
  })

  world.afterEvents.playerSpawn.subscribe(event => {
    onPlayerSpawn(event);
  })

  world.afterEvents.itemStartUse.subscribe(event => {
    onPlayerItemStartUse(event)
  })

  world.afterEvents.itemStopUse.subscribe(event => {
    onPlayerItemStopUse(event)
  })

  world.afterEvents.entityLoad.subscribe(event => {
    onWishLoad(event);
  })

  world.beforeEvents.playerInteractWithEntity.subscribe(event => {
    onPlayerInteractWish(event);
  })
}