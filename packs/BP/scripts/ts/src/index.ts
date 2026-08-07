
import { system } from '@minecraft/server'
import { onWishTick } from 'wish'
import { subscribeToEvents } from 'events';

export const TEST_VILLAGE_COORDS = {x:213.44, y:78.00, z:-196.27}
subscribeToEvents();

system.runInterval(() => {
    onWishTick();
})