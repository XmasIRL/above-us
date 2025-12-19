import { Vector3Utils } from "@minecraft/math";
import { Dimension, Entity, EntityComponentTypes, EntityQueryOptions, system, Vector3, world } from "@minecraft/server";



/// SYSTEM UTILITIES ///

export function tryRun ( fn: () => void, errFn: (e: any) => void = (e) => console.error(e) ) : number {
  return system.run(() => { try {fn()} catch (e) {errFn(e)} });
}



/// PLAYER UTILITIES ///

export function getPlayer(query?: EntityQueryOptions) {
  return query ? world.getPlayers(query)[0] : world.getAllPlayers()[0];
}



/// DIMENSION UTILITIES ///

export function getWorldDimensions() {
  return {
    overworld : world.getDimension('overworld'),
    nether    : world.getDimension('nether'),
    the_end   : world.getDimension('the_end')
  }
}

export function mapDimension<T> ( fn: (dimension:Dimension) => T ) : { overworld:T, nether:T, the_end:T } {
  return {
    overworld : fn(world.getDimension('overworld')),
    nether    : fn(world.getDimension('nether')),
    the_end   : fn(world.getDimension('the_end'))
  }
}



/// BLOCK ENTITY UTILITIES ///

export function getBlockEntityOfTypeAt(type: string, dimension:Dimension, location:Vector3): Entity | undefined {
  return dimension.getEntitiesAtBlockLocation(location).find(e => e.typeId === type);
}
export function getBlockEntityOfFamilyAt(family: string, dimension:Dimension, location:Vector3): Entity | undefined {
  return dimension.getEntitiesAtBlockLocation(location).find(e => e.getComponent(EntityComponentTypes.TypeFamily)?.hasTypeFamily(family));
}

export interface AdjacentBlockEntities {
  center           : Entity | undefined,
  top              : Entity | undefined,
  bottom           : Entity | undefined,
  north            : Entity | undefined,
  south            : Entity | undefined,
  east             : Entity | undefined,
  west             : Entity | undefined,
  topNorth       ? : Entity | undefined,
  topSouth       ? : Entity | undefined,
  topEast        ? : Entity | undefined,
  topWest        ? : Entity | undefined,
  bottomNorth    ? : Entity | undefined,
  bottomSouth    ? : Entity | undefined,
  bottomEast     ? : Entity | undefined,
  bottomWest     ? : Entity | undefined,
  northEast      ? : Entity | undefined,
  northWest      ? : Entity | undefined,
  southEast      ? : Entity | undefined,
  southWest      ? : Entity | undefined,
  topNorthEast   ? : Entity | undefined,
  topNorthWest   ? : Entity | undefined,
  topSouthEast   ? : Entity | undefined,
  topSouthWest   ? : Entity | undefined,
  bottomNorthEast? : Entity | undefined,
  bottomNorthWest? : Entity | undefined,
  bottomSouthEast? : Entity | undefined,
  bottomSouthWest? : Entity | undefined,
}
export function getBlockEntitiesOfTypeAt(type:string, dimension:Dimension, location:Vector3) : AdjacentBlockEntities {
  return {
    center          : getBlockEntityOfTypeAt(type, dimension,                  location                     ),
    top             : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 0, y: 1, z: 0})),
    bottom          : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 0, y:-1, z: 0})),
    north           : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 0, y: 0, z:-1})),
    south           : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 0, y: 0, z: 1})),
    east            : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 1, y: 0, z: 0})),
    west            : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x:-1, y: 0, z: 0})),
    topNorth        : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 0, y: 1, z:-1})),
    topSouth        : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 0, y: 1, z: 1})),
    topEast         : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 1, y: 1, z: 0})),
    topWest         : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x:-1, y: 1, z: 0})),
    bottomNorth     : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 0, y:-1, z:-1})),
    bottomSouth     : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 0, y:-1, z: 1})),
    bottomEast      : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 1, y:-1, z: 0})),
    bottomWest      : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x:-1, y:-1, z: 0})),
    northEast       : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 1, y: 0, z:-1})),
    northWest       : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x:-1, y: 0, z:-1})),
    southEast       : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 1, y: 0, z: 1})),
    southWest       : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x:-1, y: 0, z: 1})),
    topNorthEast    : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 1, y: 1, z:-1})),
    topNorthWest    : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x:-1, y: 1, z:-1})),
    topSouthEast    : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 1, y: 1, z: 1})),
    topSouthWest    : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x:-1, y: 1, z: 1})),
    bottomNorthEast : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 1, y:-1, z:-1})),
    bottomNorthWest : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x:-1, y:-1, z:-1})),
    bottomSouthEast : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x: 1, y:-1, z: 1})),
    bottomSouthWest : getBlockEntityOfTypeAt(type, dimension, Vector3Utils.add(location, {x:-1, y:-1, z: 1})),
  };
}

