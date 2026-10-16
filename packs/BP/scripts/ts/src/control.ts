import { Vector2Utils, Vector3Utils } from "@minecraft/math";
import * as mc from "@minecraft/server";
import { AnimationIds, AnimationVariables, CameraPresets, DynamicPropertyTypes, EntityFamilyTypes } from "constants";
import { run, stopFlying, vec3ToDeg } from "utils";


export function onInteractEntity(event:mc.PlayerInteractWithEntityBeforeEvent) {
  
  const entity = event.target;
  const player = event.player;
  const itemStack = event.itemStack;

  if(!entity.getComponent(mc.EntityComponentTypes.TypeFamily)?.hasTypeFamily(EntityFamilyTypes.Mob)) 
    return event;

  event.cancel = true;
    
  const controlledMobId = player.getDynamicProperty(DynamicPropertyTypes.ControlledMob);
  const controlledMob = (typeof controlledMobId === 'string') ? mc.world.getEntity(controlledMobId) : undefined

  if (controlledMob) {
    stopControl(player,controlledMob)
    return event;
  }

  if (!player.getDynamicProperty(DynamicPropertyTypes.ControlledMob)) {
    run(() => {
      player.setDynamicProperty(DynamicPropertyTypes.ControlledMob, entity.id);
      player.teleport(entity.location)
      player.camera.setCamera(CameraPresets.MobControl)
      entity.addTag('attach_entity');
      player.runCommand(`camera @s attach_to_entity @e[tag=attach_entity,c=1]`);
      entity.removeTag('attach_entity')      
      // entity.runCommand(`playanimation @s animation.common.look_at_target default 1.0 "v.is_controlled = 1; return 0;"`)
    });
    stopFlying(player);
  }

  return event;
}


export function onJump(event: mc.PlayerButtonInputAfterEvent) {
    
    const player = event.player;  
    
    if (event.button !== mc.InputButton.Jump) return;
    
    const controlledMobId = player.getDynamicProperty(DynamicPropertyTypes.ControlledMob);
    if (typeof controlledMobId !== 'string') return;
    

    const controlledMob = mc.world.getEntity(controlledMobId)
    if (!controlledMob) {
      player.setDynamicProperty(DynamicPropertyTypes.ControlledMob);
      return;
    }


    if (player.isFlying) {
      stopControl(player,controlledMob);
    }
}


function stopControl(player: mc.Player,controlledMob: mc.Entity) {
  run(() => {
    const lastLocation = controlledMob.getDynamicProperty(DynamicPropertyTypes.ControlledMobLastLocation) as mc.Vector3 | undefined;
    if (lastLocation) controlledMob.teleport(lastLocation ?? controlledMob.location);
    controlledMob.teleport(lastLocation ?? controlledMob.location);
    // controlledMob.runCommand(`playanimation @s animation.common.look_at_target default 1.0 "v.is_controlled = 0; return 0;" `)    
    controlledMob.playAnimation(AnimationIds.Default,{ stopExpression: `
      ${AnimationVariables.CanLookAtTarget} = 1;
      return 1;`
    });
    player.setDynamicProperty(DynamicPropertyTypes.ControlledMob);
    player.camera.clear();
  })
}

export function controlMobs(player: mc.Player) {

  const controlledMobId = player.getDynamicProperty(DynamicPropertyTypes.ControlledMob);
  if (typeof controlledMobId !== 'string') return;

  const controlledMob = mc.world.getEntity(controlledMobId)
  if (!controlledMob) return;
  
  player.playAnimation(AnimationIds.Hide);

  controlledMob.setDynamicProperty(DynamicPropertyTypes.ControlledMobLastLocation,controlledMob.location)
  
  const lookDir = Vector3Utils.scale(player.getViewDirection(),10)
  const lookAt = Vector3Utils.add(player.getHeadLocation(),lookDir)
  // const targetLocation = Vector3Utils.subtract(player.location,{...Vector3Utils.scale(player.getViewDirection(),1),y:0})
  const targetLocation = player.location;
  // const isMoving = Vector3Utils.distance(player.location,controlledMob.location) > 0.1
  const isMoving = !Vector3Utils.equals(player.location,controlledMob.location) || !Vector2Utils.equals(player.getRotation(),controlledMob.getRotation()) 
  
  if (isMoving) controlledMob.teleport(targetLocation);
  controlledMob.setRotation({x:0, y:0});


  controlledMob.playAnimation(AnimationIds.Rotate,{ blendOutTime:3, stopExpression: `
    ${AnimationVariables.CanLookAtTarget} = 0.0; 
    ${AnimationVariables.RotateHeadX} = ${vec3ToDeg(lookDir).x};
    ${AnimationVariables.RotateHeadY} = 0;
    ${AnimationVariables.RotateBodyY} = ${-vec3ToDeg(lookDir).y};
    ${AnimationVariables.RotateBodyX} = 0;  
    return 0;`
  })

  
}