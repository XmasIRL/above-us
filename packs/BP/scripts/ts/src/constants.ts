
export const ITEM = {
    DIAMOND_SPEAR           : { ID: 'minecraft:diamond_spear' }
} as const;

export const PARTICLE = {
    CROP_GROWTH             : "minecraft:crop_growth_emitter",
    VILLAGER_HAPPY          : "minecraft:villager_happy",
    VILLAGER_ANGRY          : "minecraft:villager_angry",
    FIREFLY                 : "minecraft:firefly_particle",
    SNOWFLAKE               : "minecraft:snowflake_particle",
    CRITICAL_HIT            : "minecraft:critical_hit_emitter",
    END_ROD                 : "minecraft:endrod",
    MAGNESIUM_SALTS         : "minecraft:magnesium_salts_emitter",
    MOB_SPELL               : "minecraft:mobspell_emitter",
    WATER_BUCKET_EVAPORATION: "minecraft:water_evaporation_bucket_emitter",
    HUGE_EXPLOSION          : "minecraft:huge_explosion_emitter",
    LLAMA_SPIT              : "minecraft:llama_spit_smoke",
    HEART                   : "minecraft:heart_particle",
    BLUE_FLAME              : "minecraft:blue_flame_particle",
    BASIC_SMOKE             : "minecraft:basic_smoke_particle",
    CAMPFIRE_SMOKE          : "minecraft:campfire_smoke_particle"    
} as const;

export const ENTITY = {
    TYPE : { VILLAGER: 'x:villager_v2' },
    EVENT: { DESPAWN: "x:despawn" }
} as const;

export const PLAYER = {
    RUNS: { SPEAR_USE: "spearUse" }
} as const;

export const WISH = {
  ENTITY_TYPE   : 'x:wish',
  WISH_TYPE     : {
    GENERIC      : "generic",
    MOVE_TO      : "move_to"
  },
  PROPERTY      : {
    WISH_TYPE    : "x:wish_type"  ,
    WISH_PLAYER  : "x:wish_player",
    WISH_PATH    : "x:wish_path" 
  }
} as const