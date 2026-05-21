
import { world, system, Vector3 } from "@minecraft/server"


export const getPlayer = () => world.getAllPlayers()[0];

// dimension stuff
export const getEnd       = () => world.getDimension('the_end'  );
export const getNether    = () => world.getDimension('nether'   );
export const getOverworld = () => world.getDimension('overworld');


export function randomSpread( location: Vector3, spreadDistance: number ): Vector3 {
  return {
    x: location.x + (Math.random() - 0.5) * spreadDistance,
    y: location.y + (Math.random() - 0.5) * spreadDistance,
    z: location.z + (Math.random() - 0.5) * spreadDistance,
  }
}