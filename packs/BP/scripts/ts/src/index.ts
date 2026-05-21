
import { VECTOR3_DOWN, Vector3Utils } from '@minecraft/math';
import { world, system, Entity, BlockVolumeBase, BlockVolume, EntityComponentTypes, MolangVariableMap } from '@minecraft/server'
import { getOverworld, getPlayer, randomSpread } from 'lib/utils';

const TEST_VILLAGE_COORDS = {x:213.44, y:78.00, z:-196.27}
const ENTITY = {
    WISH: {
        TYPE: 'x:wish'
    },
    VILLAGER: {
        TYPE: 'x:villager_v2'        
    }
}

const PARTICLE = {
    CROP_GROWTH: "minecraft:crop_growth_emitter",
    VILLAGER_HAPPY: "minecraft:villager_happy",
    VILLAGER_ANGRY: "minecraft:villager_angry",
    FIREFLY: "minecraft:firefly_particle",
    SNOWFLAKE: "minecraft:snowflake_particle",
    CRITICAL_HIT: "minecraft:critical_hit_emitter",
    END_ROD: "minecraft:endrod",
    MAGNESIUM_SALTS: "minecraft:magnesium_salts_emitter",
    MOB_SPELL: "minecraft:mobspell_emitter",
    WATER_BUCKET_EVAPORATION: "minecraft:water_evaporation_bucket_emitter",
    HUGE_EXPLOSION: "minecraft:huge_explosion_emitter",
    LLAMA_SPIT: "minecraft:llama_spit_smoke",
    HEART: "minecraft:heart_particle",
    BLUE_FLAME: "minecraft:blue_flame_particle",
    BASIC_SMOKE: "minecraft:basic_smoke_particle",
    CAMPFIRE_SMOKE: "minecraft:campfire_smoke_particle"
    
}

let selectedEntity:Entity;

function clearGameTestArea() {    
    getOverworld().fillBlocks(
        new BlockVolume({x:-3, y:-2, z:-3},{x:3,y:1,z:3}), 
        'minecraft:air'
    );
}


world.beforeEvents.playerInteractWithEntity.subscribe( 
    ({ cancel, player, target, itemStack }) => {
        
        
        system.run(() => {
            
            selectedEntity = target;
            
            if (target.typeId == ENTITY.VILLAGER.TYPE) {
                world.sendMessage(`[Villager] Hello`);
            }

            if (target.typeId == ENTITY.WISH.TYPE) {
                const dimension = selectedEntity.dimension;
                const location = selectedEntity.location;
                const run_despawn = system.runInterval(()=>{
                    dimension.spawnParticle(PARTICLE.LLAMA_SPIT, {x: location.x, y: location.y - 0.2, z: location.z},);
                })
                system.runTimeout(() => {system.clearRun(run_despawn)}, 80);
                target.remove();
            }
        });



    }
)

system.runInterval(() => {

    getPlayer()?.dimension.getEntities({type: ENTITY.WISH.TYPE}).forEach( entity => {
        
        if (system.currentTick % 10 == 0) 
            entity.dimension.spawnParticle(PARTICLE.VILLAGER_HAPPY, entity.location);
        if (system.currentTick % 5 == 0) {
            const color = new MolangVariableMap()
            color.setColorRGBA('color',{red:0.5,green:0.9,blue:0.8,alpha:0.9});
            entity.dimension.spawnParticle(PARTICLE.MOB_SPELL, randomSpread({x: entity.location.x, y: entity.location.y - 0.1, z: entity.location.z}, 0.1),color);            
        }
        

    })
});
