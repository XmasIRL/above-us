
import { world, system, Vector3, DimensionLocation, Dimension } from "@minecraft/server"

export const isObject = (value: any): value is Record<string, any> => 
      value  && typeof value === 'object'  && !Array.isArray(value);

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]   // arrays
    : T[P] extends object
    ? RecursivePartial<T[P]>  // nested objects
    : T[P];                   // primitives
};

export const generateUUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === 'x' ? r : (r & 0x3 | 0x8);
  return v.toString(16);
})

export const tryCatch = <T>( f: (...args: any[]) => T ) : () => T | undefined => () => { 
  try { return f() } catch (e) { console.warn(e) }
}

export const run = ( f: () => void ) : number => system.run(tryCatch(f));
export const runTimeout  = ( f: () => void, tickDelay   ?: number ) : number => system.runTimeout (tryCatch(f), tickDelay   );
export const runInterval = ( f: () => void, tickInterval?: number ) : number => system.runInterval(tryCatch(f), tickInterval);

export function randomSpread( location: Vector3, spreadDistance: number ): Vector3 {
  return {
    x: location.x + (Math.random() - 0.5) * spreadDistance,
    y: location.y + (Math.random() - 0.5) * spreadDistance,
    z: location.z + (Math.random() - 0.5) * spreadDistance,
  }
}

export const isLocationLoaded = ( dimension: Dimension, location: Vector3 ) : boolean => dimension.isChunkLoaded(location)