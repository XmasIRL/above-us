
import { Vector3Utils } from "@minecraft/math";
import * as mc from "@minecraft/server"
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";

export type Maybe<T> = T | undefined;

export function generateUUID () {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  })
}

export function tryCatch<T>( f: (...args: any[]) => T ) : () => T | undefined {
  return () => { 
    try { return f() } catch (e) { console.warn(e) }
  }
}

export function run ( f: () => void ) : number { return mc.system.run(tryCatch(f));}
export function runTimeout  ( f: () => void, tickDelay   ?: number ) : number { return mc.system.runTimeout (tryCatch(f), tickDelay   );}
export function runInterval ( f: () => void, tickInterval?: number ) : number { return mc.system.runInterval(tryCatch(f), tickInterval);}
export function runDuration ( f: () => void, tickDuration?: number ) : number {
  const run_id = mc.system.runInterval(tryCatch(f))
  mc.system.runTimeout(() => mc.system.clearRun(run_id),tickDuration)
  return run_id;
}
export function runUntil ( f: () => void, testFn?: () => boolean ) : number {
  const run_id = mc.system.runInterval(tryCatch(() => !testFn?.() ? f() : mc.system.clearRun(run_id)))  
  return run_id;
}
export function runWhen ( f: () => void, testFn?: () => boolean ) : number {
  const run_id = mc.system.runInterval(tryCatch(() => testFn?.() ? (f(), mc.system.clearRun(run_id)) : null ));  
  return run_id;
}

export function print(message:string) {return run(() => mc.world.sendMessage(message ?? ''))};
export function printActionBar(message:string) {return run(() => mc.world.getAllPlayers().forEach( player => player.onScreenDisplay.setActionBar(message ?? '')))};
export function printTitle(title:string, subtitle:string) { return run(() => mc.world.getAllPlayers().forEach( player => 
  player.onScreenDisplay.setTitle(title ?? '', {
    fadeInDuration  :1 * mc.TicksPerSecond,
    fadeOutDuration :1 * mc.TicksPerSecond,
    stayDuration    :5 * mc.TicksPerSecond,
    subtitle        :    subtitle ?? ''
  }))
)};

export function randomSpread( location: mc.Vector3, spreadDistance: number ): mc.Vector3 {
  return {
    x: location.x + (Math.random() - 0.5) * spreadDistance,
    y: location.y + (Math.random() - 0.5) * spreadDistance,
    z: location.z + (Math.random() - 0.5) * spreadDistance,
  }
}

export function isLocationLoaded ( dimension: mc.Dimension, location: mc.Vector3 ) : boolean {
  return dimension.isChunkLoaded(location)
}

export function getPlayer(name?: string) : mc.Player | undefined {
  return name ? mc.world.getPlayers({name})[0] : mc.world.getPlayers()[0]
}


export function degToRad(deg:number) { return deg * Math.PI/180.0 }
export function radToDeg(rad:number) { return rad * 180.0/Math.PI }

export function vec2ToDeg(v:mc.Vector2) {return Math.atan2(v.y,v.x)}
export function vec3ToDeg(v:mc.Vector3) {return {
  x: Math.atan2(-v.y,Math.sqrt(v.x*v.x + v.z*v.z)) * 180.0/Math.PI,
  y: Math.atan2(v.x,v.z) * 180.0/Math.PI
}}




export function midPoint(v1:mc.Vector3,v2:mc.Vector3){
  return { x: v1.x + (v2.x - v1.x)/2, y: v1.y + (v2.y - v1.y)/2, z: v1.z + (v2.z - v1.z)/2 }
}

export function aabbToBlockVolume(aabb: mc.AABB) {
  return new mc.BlockVolume(
    Vector3Utils.subtract(aabb.center,aabb.extent),
    Vector3Utils.add(aabb.center,aabb.extent)
  )
}

export function getOrSetDefaultDynamicProperty(entity:mc.Entity,propertyID:string,defaultValue?:string|number|boolean|mc.Vector3) {
  const property = entity.getDynamicProperty(propertyID);
  if (!property) entity.setDynamicProperty(propertyID,defaultValue)
  return property ?? defaultValue;
}

export function getAndSetDynamicProperty(entity:mc.Entity,propertyID:string,setValue?:string|number|boolean|mc.Vector3) {
  const property = entity.getDynamicProperty(propertyID);
  entity.setDynamicProperty(propertyID,setValue)
  return property ?? setValue;
}


export function stopFlying(player:mc.Player) {
  run(() => {
    const gameMode = player.getGameMode();
    player.setGameMode(mc.GameMode.Survival);
    runTimeout(() => player.setGameMode(gameMode));
  })
}

export function getRootVehicle(entity: mc.Entity): mc.Entity {
  const root = entity.getComponent(mc.EntityComponentTypes.Riding)?.entityRidingOn
  return !root ? entity : getRootVehicle(root)
}

export function getOverworld() { return globalThis.dimensions?.Overworld ?? mc.world.getDimension(MinecraftDimensionTypes.Overworld)}
export function getNether() { return globalThis.dimensions?.Nether ?? mc.world.getDimension(MinecraftDimensionTypes.Nether)}
export function getTheEnd() { return globalThis.dimensions?.TheEnd ?? mc.world.getDimension(MinecraftDimensionTypes.TheEnd)}