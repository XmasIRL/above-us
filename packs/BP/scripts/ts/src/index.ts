
import * as mc from '@minecraft/server';
import { onScriptLoad, subscribeToEvents } from 'events';
import { runInterval } from 'utils';


export const TEST_VILLAGE_COORDS = {x:214.53 , y:81.74, z:-190.34}

onScriptLoad();
subscribeToEvents();

runInterval(() => {
    
})

