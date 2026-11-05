
import { Vector3Builder } from '@minecraft/math';
import * as mc from '@minecraft/server';
import { subscribeToEvents } from 'events';
import { setupWorld } from 'game';
import { Bounds, clearChat, runInterval } from 'utils';



export const TEST_VILLAGE_COORDS = {x:214.53 , y:81.74, z:-190.34}
export const TEST_VILLAGE_BOUNDS = new Bounds(
  new Vector3Builder(150, 0, -120),
  new Vector3Builder(250, 100, -280)
)



export function init(){
  subscribeToEvents();
  setupWorld()
}



init();
runInterval(() => {
    
})

