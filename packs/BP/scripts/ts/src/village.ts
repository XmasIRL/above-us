import { Vector3Utils } from "@minecraft/math";
import { Dimension, StructureSaveMode, system, Vector3, world } from "@minecraft/server";
import { getWorldDimensions, tryRun } from "lib";



export function spawnVillager(position: Vector3, dimension: Dimension) {
  dimension.spawnEntity("minecraft:villager", position);
}

world.beforeEvents.playerInteractWithEntity.subscribe(({cancel, player, target, itemStack}) => tryRun( () => {

  if (['minecraft:villager', 'minecraft:villager_v2'].some(t => t === target.typeId)) {
    target.remove();
    cancel = true;
  }

}));



const VILLAGE_BOUNDS = { minX: -14502, maxX: -14389, minZ: -1490, maxZ: -1325, minY: -64, maxY: 320 };
const VILLAGE_BOUNDS_MIN = { x: VILLAGE_BOUNDS.minX, y: VILLAGE_BOUNDS.minY, z: VILLAGE_BOUNDS.minZ };
const VILLAGE_BOUNDS_MAX = { x: VILLAGE_BOUNDS.maxX, y: VILLAGE_BOUNDS.maxY, z: VILLAGE_BOUNDS.maxZ };

tryRun( () => {
  // const struct_village = world.structureManager.createFromWorld('above_us:test',getWorldDimensions().overworld,VILLAGE_BOUNDS_MIN,VILLAGE_BOUNDS_MAX,{includeBlocks: true,includeEntities: true,saveMode: StructureSaveMode.Memory});
  // world.sendMessage(`${Vector3Utils.toString(struct_village.size)}`);
  const map_village = [];
  let map_village_size = 0;
  for (let x = VILLAGE_BOUNDS.minX; x <= VILLAGE_BOUNDS.maxX; x++) {
    for (let z = VILLAGE_BOUNDS.minZ; z <= VILLAGE_BOUNDS.maxZ; z++) {
      // const column = [];
      for (let y = VILLAGE_BOUNDS.minY; y <= VILLAGE_BOUNDS.maxY; y++) {
        // const block = getWorldDimensions().overworld.getBlock({x:x,y:y,z:z});
        // column.push(block);
        map_village_size++;
      }
      // map_village.push(column);
    }
  }
  world.sendMessage(`Village map size: ${map_village_size}`);
});
