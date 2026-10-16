import { MinecraftEffectTypes, MinecraftEntityTypes,  } from "@minecraft/vanilla-data";

export const ItemTypes = {
} as const;

export const MinecraftParticleTypes = {
    CropGrowth: "minecraft:crop_growth_emitter",
    VillagerHappy: "minecraft:villager_happy",
    VillagerAngry: "minecraft:villager_angry",
    Firefly: "minecraft:firefly_particle",
    Snowflake: "minecraft:snowflake_particle",
    CriticalHit: "minecraft:critical_hit_emitter",
    EndRod: "minecraft:endrod",
    MagnesiumSalts: "minecraft:magnesium_salts_emitter",
    MobSpell: "minecraft:mobspell_emitter",
    WaterBucketEvaporation: "minecraft:water_evaporation_bucket_emitter",
    HugeExplosion: "minecraft:huge_explosion_emitter",
    LlamaSpit: "minecraft:llama_spit_smoke",
    Heart: "minecraft:heart_particle",
    BlueFlame: "minecraft:blue_flame_particle",
    BasicSmoke: "minecraft:basic_smoke_particle",
    CampfireSmoke: "minecraft:campfire_smoke_particle"    
} as const;

export const EntityTypes = { 
    Platform: 'x:platform',
    Ride: 'x:ride'
} as const;

export const EntityFamilyTypes = { 
    Mob: "mob",
    Villager: "villager",
    Monster: "monster",
    Undead:"undead"
} as const;

export const DynamicPropertyTypes = {
    ControlledMob: "x:controlled_mob",
    ControlledMobLastLocation: "x:controlled_mob_last_location",
} as const;

export const DimensionsTypes = {
} as const;

export const TickingAreaIds = {
    GameTest: "x:game_test"
} as const;

export const AnimationIds = {
    Default: 'animation.default',
    Hide: 'animation.hide',
    Rotate: 'animation.rotate',
    LookAtTarget: 'animation.common.look_at_target',
} as const;

export const AnimationVariables = {
    CanLookAtTarget: 'v.can_look_at_target',
    RotateBodyX: 'v.rotate_body_x',
    RotateBodyY: 'v.rotate_body_y',
    RotateBodyZ: 'v.rotate_body_z',
    RotateHeadX: 'v.rotate_head_x',
    RotateHeadY: 'v.rotate_head_y',
    RotateHeadZ: 'v.rotate_head_z',
} as const;

export const EntityEvents = {
} as const;

export const CameraPresets = {
    MobControl: 'x:mob_control'
} as const

export const GameTestIds = {
    AboveUs: "x:above_us"
}

export const StructureIds = {
    GameTestRestore: "x:gametest_restore",
    GameTestRestoreOrigin: "x:gametest_restore_origin"
}