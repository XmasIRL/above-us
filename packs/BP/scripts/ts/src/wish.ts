import { generateUUID, isLocationLoaded, randomSpread, RecursivePartial, run, runInterval, runTimeout } from "utils";
import { WishData } from "types";
import { Dimension, Entity, EntityLoadAfterEvent, MolangVariableMap, PlayerInteractWithEntityAfterEvent, PlayerInteractWithEntityBeforeEvent, system, Vector3, world } from "@minecraft/server";
import { PARTICLE, WISH } from "constants";
import { Vector3Builder } from "@minecraft/math";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";




export class WishManager {
  
  private wishes: Record<string, WishData> = {};
  
  getFromEntity( entity:Entity ): WishData | undefined {
    return Object.entries(this.wishes)?.find( wish => wish[1]?.entity?.id === entity.id)?.[1];
  }

  update<T extends WishData>( newData:Partial<T> ): WishData {   
     
    const id = newData.id ?? generateUUID();

    const oldData = this.wishes[id];
    const data:WishData = {   ...oldData,
      id              : id,
      wish_type       : newData.wish_type ?? WISH.WISH_TYPE.GENERIC,
      dimension       : newData.dimension,
      location        : newData.location, 
      player          : newData.player,
      entity          : newData.entity
    }

    this.wishes[id] = data;
    return data;
  }

  create<T extends WishData>( data:Partial<T> ): WishData {
    if (data.wish_type === WISH.WISH_TYPE.MOVE_TO) {
      const dimension =  
        !data.dimension ? world.getDimension(MinecraftDimensionTypes.Overworld)
                        : (typeof  data.dimension === 'string') ? world.getDimension( data.dimension) 
                                                                : data.dimension as Dimension
      data.entity = dimension.spawnEntity('x:wish',data.location ?? new Vector3Builder(0,0,0))
    }    
    return this.update(data);    
  }

  remove(id: string) {
    const wish = this.wishes[id];    
    const target = wish?.entity;   
    if (target) this.removeEntity(target)
    delete this.wishes[id];
  }

  removeEntity(target: Entity) {    
    if (target.isValid){
      const dimension = target.dimension;
      const location = target.location;
      const run_despawn = system.runInterval(() => {
          dimension.spawnParticle(PARTICLE.LLAMA_SPIT, { x: location.x, y: location.y - 0.2, z: location.z });
      });
      runTimeout(() => { system.clearRun(run_despawn); }, 80);
      run(() => target.remove());
    }
  }

  renderWish(wish:WishData) {        
    if (!wish.entity || !wish.entity.isValid) return;
    if (isLocationLoaded( wish.entity.dimension, wish.entity.location )){
      if (system.currentTick % 10 == 0) 
        wish.entity.dimension.spawnParticle(PARTICLE.VILLAGER_HAPPY, wish.entity.location);
      if (system.currentTick % 5 == 0) {
        const color = new MolangVariableMap()
        color.setColorRGBA('color',{red:0.5,green:0.9,blue:0.8,alpha:0.9});
        wish.entity.dimension.spawnParticle(PARTICLE.MOB_SPELL, randomSpread({x: wish.entity.location.x, y: wish.entity.location.y - 0.1, z: wish.entity.location.z}, 0.1),color);            
      }
    }
  }

  renderWishes() { Object.values(this.wishes).forEach( wish => this.renderWish(wish)) }

}

export const wishManager = new WishManager();

export const onWishTick = () => {
  wishManager.renderWishes();
}

export const onWishLoad =  ( {entity}:EntityLoadAfterEvent ) => {
    if (entity.typeId !== WISH.ENTITY_TYPE) return;
    const wish = wishManager.getFromEntity(entity)
    if (!wish) wishManager.removeEntity(entity);
}

export const onPlayerInteractWish =  ({ cancel, player, target, itemStack }:PlayerInteractWithEntityBeforeEvent) => {
  if (target.typeId !== WISH.ENTITY_TYPE) return;
  const wish = wishManager.getFromEntity(target);
  if (wish?.id) wishManager.remove(wish.id)
  else wishManager.removeEntity(target);
}
