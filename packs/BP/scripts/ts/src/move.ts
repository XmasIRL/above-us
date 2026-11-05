import { Vector3Utils } from '@minecraft/math';
import * as mc from '@minecraft/server'
import { MinecraftItemTypes } from '@minecraft/vanilla-data';
import { DynamicProperties, EntityEvents, EntityTypes } from 'constants';
import { generateUUID, printActionBar, run, runInterval } from 'utils';


export const MoveType = {
  moveTo: "move_to",
  breakBlock : "break_block",
  placeBlock : "place_block"  
} as const;


export class Move {
  
  constructor(
    public type: typeof MoveType[keyof typeof MoveType] = MoveType.moveTo,
    public location   ?: mc.Vector3,
    public mob        ?: mc.Entity,
    public moveEntity ?: mc.Entity,
    public run        ?: {id?: number, fn?: Function},
    public testFn     ?: () => boolean|void
  ){}

  static fromJSON (data: any): Move { return new Move( 
    data.type,
    data.location,
    data.mob?.id        ? mc.world.getEntity(data.mob.id)        : undefined,
    data.moveEntity?.id ? mc.world.getEntity(data.moveEntity.id) : undefined,
    data.run?.id        ? {id: data.run.id}                      : undefined,
    data.testFn
  )}

  toJSON () { return { 
    ...this, 
    mob       : {id: this.mob?.id},
    moveEntity: {id: this.moveEntity?.id},
    run       : {id: this.run?.id} 
  }}
}

globalThis.moves = {};

export function onEntityLoadAfter(event: mc.EntityLoadAfterEvent) {
  const moveID = event.entity.getDynamicProperty(DynamicProperties.move) as number
  if (moveID){
    stopMove(moveID);
    event.entity.runCommand(`replaceitem entity @s slot.armor.head 0 air`);
    console.log('Loaded');
  }
}

export function onPlayerInteractWithBlockAfter(event: mc.PlayerInteractWithBlockBeforeEvent){

  if (event.itemStack?.typeId === MinecraftItemTypes.Brush && event.isFirstEvent){
    
    const selectedMobID = event.player.getDynamicProperty(DynamicProperties.selectedMob) as string;
    const selectedMob = selectedMobID ? mc.world.getEntity(selectedMobID) : undefined
    
    if (!selectedMob?.isValid) {printActionBar("No Move Entity Selected!"); return event;}
    else {
      createMove({
        mob: selectedMob, 
        type: MoveType.moveTo, 
        location:event.block.location,
        testFn: ()=>{
          if (Vector3Utils.distance(selectedMob.location,event.block.location) < 2){
            return true
          }
        }
      });  
      event.cancel = true;
    }
    
  }

  return event;
}

export function onPlayerInteractWithEntityAfter(event: mc.PlayerInteractWithEntityBeforeEvent){
  
  if (event.itemStack?.typeId === MinecraftItemTypes.Brush){
    event.player.setDynamicProperty(DynamicProperties.selectedMob, event.target.id) 

    let printStr = ''
    const size = event.target.getComponent(mc.EntityComponentTypes.Inventory)?.inventorySize
    for (let i = 0; i < (size ?? 0); i++) {
      printStr += (event.target.getComponent(mc.EntityComponentTypes.Inventory)?.container.getItem(i)?.typeId.replace('minecraft:','') ?? '#') + ' '
    }
    printActionBar(printStr)
    event.cancel = true
  }
  
  return event;
}

export function onPlayerBreakBlockBefore(event: mc.PlayerBreakBlockBeforeEvent) {

  if (event.player.playerPermissionLevel === mc.PlayerPermissionLevel.Operator) {
    createMove({
      location:event.block.location,
      type: MoveType.breakBlock
    })
    event.cancel = true;
  }

  return event;
}



export function onItemStartUseAfter(event:mc.ItemStartUseAfterEvent){

  return event;
}

export function onEntitySpawnAfter(event:mc.EntitySpawnAfterEvent){

  return event;
}

export function createMove(move: Partial<Move>){
  
  const moveID = Object.keys(globalThis.moves).length;

  run(() => {
    if (move.mob && move.location){
      move.moveEntity = move.mob.dimension.spawnEntity(EntityTypes.move,Vector3Utils.add(move.location,{y:1}));
      move.moveEntity.runCommand(`replaceitem entity @s slot.armor.head 0 ${MinecraftItemTypes.Feather} 1 ${moveID + 10}`)
      move.mob.runCommand(`replaceitem entity @s slot.armor.head 0 ${MinecraftItemTypes.Feather} 1 ${moveID + 10}`)
      move.mob.triggerEvent(EntityEvents.startMove)
      move.mob.setDynamicProperty(DynamicProperties.move,moveID)
      move.moveEntity.setDynamicProperty(DynamicProperties.move,moveID)
      let testRunID = 0;
      testRunID = runInterval(() => { 
        if (move.testFn?.()) {
          stopMove(moveID)
          mc.system.clearRun(testRunID)
        }        
      })
    }
  })
  
  globalThis.moves[moveID] = move;
  
  return move;
}

export function stopMove(moveID: number){
  const move = globalThis.moves[moveID];
  if (!move) return;

  if (move.mob && move.mob.isValid){
    move.mob.setDynamicProperty(DynamicProperties.move)
    move.mob.runCommand(`replaceitem entity @s slot.armor.head 0 air`)
  }
  if (move.moveEntity && move.moveEntity.isValid){
    move.moveEntity.remove()
  }
  
  if (move.run?.id) mc.system.clearRun(move.run?.id);
  delete globalThis.moves[moveID];

}

