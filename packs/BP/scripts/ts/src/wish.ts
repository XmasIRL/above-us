import { VECTOR3_DOWN, VECTOR3_EAST, VECTOR3_NORTH, VECTOR3_SOUTH, VECTOR3_UP, VECTOR3_WEST, Vector3Utils } from "@minecraft/math";
import { BlockTypes, BlockVolume, ButtonState, Direction, Entity, EntityComponentTypes, InputButton, Player, system, world } from "@minecraft/server";
import { AdjacentBlockEntities, getBlockEntitiesOfTypeAt, getBlockEntityOfFamilyAt } from "lib"


















function setWishBlockFaceVisibility( wishBlock:Entity, face:Direction, visible:boolean ){
  if (!wishBlock || !wishBlock.isValid) return;
  switch (face) {
    case Direction.Up   : wishBlock.setProperty("xmas_above:top_face_visible"   , visible); break;
    case Direction.Down : wishBlock.setProperty("xmas_above:bottom_face_visible", visible); break;
    case Direction.North: wishBlock.setProperty("xmas_above:north_face_visible" , visible); break;
    case Direction.South: wishBlock.setProperty("xmas_above:south_face_visible" , visible); break;
    case Direction.East : wishBlock.setProperty("xmas_above:east_face_visible"  , visible); break;
    case Direction.West : wishBlock.setProperty("xmas_above:west_face_visible"  , visible); break;
  }
}

function updateWishBlocksFaceVisibility( wishBlocks:AdjacentBlockEntities ){
  setWishBlockFaceVisibility( wishBlocks.center!, Direction.Up   , !(wishBlocks.top?.isValid ?? false) );
  setWishBlockFaceVisibility( wishBlocks.center!, Direction.Down , !(wishBlocks.bottom?.isValid ?? false) );
  setWishBlockFaceVisibility( wishBlocks.center!, Direction.North, !(wishBlocks.north?.isValid ?? false) );
  setWishBlockFaceVisibility( wishBlocks.center!, Direction.South, !(wishBlocks.south?.isValid ?? false) );
  setWishBlockFaceVisibility( wishBlocks.center!, Direction.East , !(wishBlocks.east?.isValid ?? false) );
  setWishBlockFaceVisibility( wishBlocks.center!, Direction.West , !(wishBlocks.west?.isValid ?? false) );
  setWishBlockFaceVisibility( wishBlocks.top!   , Direction.Down , !(wishBlocks.center?.isValid ?? false)  );
  setWishBlockFaceVisibility( wishBlocks.bottom!, Direction.Up   , !(wishBlocks.center?.isValid ?? false)  );
  setWishBlockFaceVisibility( wishBlocks.north! , Direction.South, !(wishBlocks.center?.isValid ?? false)  );
  setWishBlockFaceVisibility( wishBlocks.south! , Direction.North, !(wishBlocks.center?.isValid ?? false)  );
  setWishBlockFaceVisibility( wishBlocks.east!  , Direction.West , !(wishBlocks.center?.isValid ?? false)  );
  setWishBlockFaceVisibility( wishBlocks.west!  , Direction.East , !(wishBlocks.center?.isValid ?? false)  );
}

world.beforeEvents.playerBreakBlock.subscribe(event => {

  event.cancel = true;

  system.run(()=>{
    const wishBlocks = getBlockEntitiesOfTypeAt('xmas_above:wish_block_mine', event.dimension, event.block.bottomCenter());
    if (
      !wishBlocks.center &&
      !getBlockEntityOfFamilyAt('xmas_above:wish_block', event.dimension, event.block.bottomCenter()) &&
      !(event.block.dimension.getBlock(event.block.bottomCenter())?.isAir || event.block.dimension.getBlock(event.block.bottomCenter())?.isLiquid)
    ) {
        wishBlocks.center = event.dimension.spawnEntity('xmas_above:wish_block_mine', event.block.bottomCenter());
        // world.sendMessage(`Wish to mine ${event.block.bottomCenter().x}, ${event.block.bottomCenter().y}, ${event.block.bottomCenter().z} !`);
    }
    else if (wishBlocks?.center?.isValid) wishBlocks.center?.remove();
    updateWishBlocksFaceVisibility( wishBlocks );
  });

});

world.afterEvents.entityHitEntity.subscribe(event => {
  if (event.damagingEntity.typeId === 'minecraft:player') {
    if (event.hitEntity.getComponent(EntityComponentTypes.TypeFamily)?.hasTypeFamily('xmas_above:wish_block')) {
      system.run(()=>{
        const wishBlocks = getBlockEntitiesOfTypeAt(event.hitEntity.typeId , event.hitEntity.dimension, event.hitEntity.location);
        event.hitEntity.remove();
        updateWishBlocksFaceVisibility( wishBlocks );
      });
    }
  }
});

world.beforeEvents.playerInteractWithBlock.subscribe(event => {

  event.cancel = true;
  if (!event.isFirstEvent) return;

  const placeLocation =
    event.blockFace === Direction.Up    ? Vector3Utils.add(event.block.bottomCenter(), VECTOR3_UP    ) :
    event.blockFace === Direction.Down  ? Vector3Utils.add(event.block.bottomCenter(), VECTOR3_DOWN  ) :
    event.blockFace === Direction.North ? Vector3Utils.add(event.block.bottomCenter(), VECTOR3_SOUTH ) :
    event.blockFace === Direction.South ? Vector3Utils.add(event.block.bottomCenter(), VECTOR3_NORTH ) :
    event.blockFace === Direction.East  ? Vector3Utils.add(event.block.bottomCenter(), VECTOR3_EAST  ) :
    event.blockFace === Direction.West  ? Vector3Utils.add(event.block.bottomCenter(), VECTOR3_WEST  ) :
    event.block.bottomCenter();

  system.run(()=>{
    const wishBlocks = getBlockEntitiesOfTypeAt('xmas_above:wish_block_place', event.block.dimension, placeLocation);
    if (
      !wishBlocks.center &&
      !getBlockEntityOfFamilyAt('xmas_above:wish_block', event.block.dimension, placeLocation) &&
      (event.block.dimension.getBlock(placeLocation)?.isAir || event.block.dimension.getBlock(placeLocation)?.isLiquid)
    ) {
      wishBlocks.center = event.block.dimension.spawnEntity('xmas_above:wish_block_place', placeLocation);
      // wishBlocks.center?.runCommand(`replaceitem entity @s slot.weapon.mainhand 0 ${event.itemStack?.typeId}`);
      // if (!BlockTypes.get(event.itemStack?.typeId ?? '')) {
      //   wishBlocks.center?.setProperty('xmas_above:item_scale_x',1.0);
      //   wishBlocks.center?.setProperty('xmas_above:item_scale_y',1.0);
      //   wishBlocks.center?.setProperty('xmas_above:item_scale_z',1.0);
      // }
      // else {
      //   wishBlocks.center?.setProperty('xmas_above:item_rot_y',135.0);
      // }
      // BlockTypes.getAll().forEach(b => world.sendMessage(`${b.id}`));


      // wishBlocks.center?.getComponent(EntityComponentTypes.Inventory)?.container.setItem(0,event.itemStack);
      // system.runTimeout(() => world.sendMessage(JSON.stringify(wishBlocks.center?.getComponent(EntityComponentTypes.Equippable)?.getEquipmentSlot(EquipmentSlot.Offhand)?.typeId) ?? "--")
      // .setItem(event.itemStack)
      // ,30);
      // world.sendMessage(`Wish to place ${event.block.typeId} @ ${placeLocation.x}, ${placeLocation.y}, ${placeLocation.z} !`);
    }
    else if (wishBlocks?.center?.isValid) wishBlocks.center.remove();
    updateWishBlocksFaceVisibility( wishBlocks );
  });

});
