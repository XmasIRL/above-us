
import * as mc from '@minecraft/server';
import * as control from 'control';
import { onScriptLoad, subscribeToEvents } from 'events';
import { runInterval } from 'utils';


// export const TEST_VILLAGE_COORDS = {x:213.44, y:78.00, z:-196.27}
// export const TEST_VILLAGE_COORDS = {x:222.89, y:81.02, z:-175.24}

onScriptLoad();
subscribeToEvents();

runInterval(() => {
    
  mc.world.getAllPlayers().forEach( player => {
    
    // if (mc.system.currentTick % 5 === 0) player.camera.setFov({fov:60,easeOptions:{easeTime:1,easeType:mc.EasingType.OutCubic}})
    control.controlMobs(player);

  })

})

