import { system, world } from "@minecraft/server";

import "commands";
import "village";
import "wish";

system.runInterval(() => {
  world.getAllPlayers().forEach((player) => {});
});

// system.runInterval(() => {

//   world.getAllPlayers().forEach(player => {

//     // world.sendMessage(`${JSON.stringify(player.getVelocity())}`)
//     // if ((player.getGameMode() === GameMode.Spectator) && (Vector3Utils.distance(player.getVelocity(),VECTOR3_ZERO) < 0.1)) {
//     //   player.setGameMode(GameMode.Creative);
//     //   player.teleport(Vector3Utils.add(player.location,{y:-1.6}));
//     //   player.runCommand(`ride @s summon_ride xmas_above:player_flight`)
//     // }
//     // if ((player.getGameMode() === GameMode.Creative) && !(Vector3Utils.distance(player.getVelocity(),VECTOR3_ZERO) < 0.1)) {
//     //   player.setGameMode(GameMode.Spectator);
//     // }

//     // const ride = player.getComponent(EntityComponentTypes.Riding)?.entityRidingOn

//     // if (ride && ride.typeId === 'xmas_above:player_flight') {
//     //   ride.setRotation(player.getRotation());
//     //   if (player.inputPermissions.isPermissionCategoryEnabled(InputPermissionCategory.Dismount)) {
//     //     player.inputPermissions.setPermissionCategory(InputPermissionCategory.Dismount,false)
//     //   }
//     //   if (!player.dimension.getBlock(player.getHeadLocation())?.isAir && !player.dimension.getBlock(player.getHeadLocation())?.isLiquid) {
//     //     player.setGameMode(GameMode.Spectator);
//     //     player.teleport(Vector3Utils.add(ride.location,VECTOR3_DOWN));
//     //   }
//     //   // if (player.inputInfo.getMovementVector() == VECTOR3_ZERO) ride.clearVelocity();
//     //   // if (player.inputInfo.getButtonState(InputButton.Sneak) === ButtonState.Pressed) ride.teleport(
//     //   //   // Vector3Utils.subtract(ride.getVelocity(),{x:0,y:10,z:0})
//     //   //   {x:0,y:0.2,z:0}
//     //   // )
//     // }

//     // else {
//     //   if (!player.inputPermissions.isPermissionCategoryEnabled(InputPermissionCategory.Dismount)) {
//     //     player.inputPermissions.setPermissionCategory(InputPermissionCategory.Dismount,true)
//     //   }
//     // }

//     // if (player.getGameMode() === GameMode.Spectator && (player.dimension.getBlock(player.getHeadLocation())?.isAir || player.dimension.getBlock(player.getHeadLocation())?.isLiquid)) {
//     //   player.setGameMode(GameMode.Creative);
//     // }
//     // if (player.isFalling) {
//     //   player.teleport(Vector3Utils.add(player.location,{y:-1.6}));
//     //   player.runCommand(`ride @s summon_ride xmas_above:player_flight`)
//     // }

//   });
// }, 1);

// world.afterEvents.playerButtonInput.subscribe(({button, newButtonState, player}) => {

//   // if (button === InputButton.Sneak && newButtonState === ButtonState.Released && player.isFalling) {
//   //   player.runCommand(`ride @s summon_ride xmas_above:player_flight`)
//   // }

//   // const ride = player.getComponent(EntityComponentTypes.Riding)?.entityRidingOn
//   // if (ride && ride.typeId === 'xmas_above:player_flight') {
//   //   if(button === InputButton.Sneak && newButtonState === ButtonState.Pressed) ride.teleport(
//   //       Vector3Utils.subtract(ride.getVelocity(),{x:0,y:1,z:0})
//   //       // {x:0,y:0.2,z:0}
//   //   )
//   // }
// })

// export interface BV_COORDS {
//   from: { x: number, y: number, z: number },
//   to:   { x: number, y: number, z: number },
// };

// export const DEFAULT_PLAY_BV_LENGTH = 1000;
// export const DEFAULT_PLAY_BV_HEIGHT = 100;

// export const DEFAULT_PLAY_BV = {
//   from: { x:  0, y: -64, z: 0 },
//   to:   { x:  DEFAULT_PLAY_BV_LENGTH, y: DEFAULT_PLAY_BV_HEIGHT, z:  DEFAULT_PLAY_BV_LENGTH },
// };

// export const END_PLAY_BV_COORDS_YZ = { y: -64, z: 100000 };
// export const END_PLAY_BV_PADDING = 1000;

// export function getBV(bv: BV_COORDS) : BlockVolume {
//   return new BlockVolume(
//     { x: bv.from.x, y: bv.from.y, z: bv.from.z },
//     { x: bv.to.x,   y: bv.to.y,   z: bv.to.z   },
//   );
// }

// export let playBV       = DEFAULT_PLAY_BV;
// export let playBVLength = DEFAULT_PLAY_BV_LENGTH;
// export let playBVHeight = DEFAULT_PLAY_BV_HEIGHT;

// export let playerEndBVMap = new Map<Player, BlockVolume>();

// export function updatePlayerEndBVMap( players:Player[] ) : Map<Player, BlockVolume> {
//   system.run(()=>{
//     playerEndBVMap = new Map( players.map( (player, index) => [
//         player,
//         new BlockVolume(
//         {
//           x: index * ( playBVLength + END_PLAY_BV_PADDING ),
//           y: END_PLAY_BV_COORDS_YZ.y,
//           z: END_PLAY_BV_COORDS_YZ.z
//         },
//         {
//           x: (index + 1) * ( playBVLength + END_PLAY_BV_PADDING ),
//           y: END_PLAY_BV_COORDS_YZ.y + playBVHeight,
//           z: END_PLAY_BV_COORDS_YZ.z + playBVLength
//         },
//     )]));
//   });
//   return playerEndBVMap;
// }

// system.run(() => updatePlayerEndBVMap( world.getAllPlayers() ));

// world.afterEvents.playerButtonInput.subscribe(({player, button, newButtonState}) => {
//   system.run(() => {
//     if (button === InputButton.Jump && newButtonState === ButtonState.Released) {
//       const endBV = playerEndBVMap.get(player);
//       if (!endBV) return;
//       if (player.isFlying && player.dimension.id === 'minecraft:overworld') {
//         const tpTo = {
//           x: endBV.from.x + player.location.x - playBV.from.x,
//           y: player.location.y,
//           z: END_PLAY_BV_COORDS_YZ.z + player.location.z - playBV.from.z,
//         };
//         // world.sendMessage(`Teleporting ${player.name} to The End at ${tpTo.x}, ${tpTo.y}, ${tpTo.z}`);
//         player.teleport(tpTo,{ dimension: world.getDimension('the_end')});
//         const muteTP = system.runInterval(() => player.runCommand('stopsound @s portal.travel'), 1);
//         system.runTimeout(() => system.clearRun(muteTP), 20);
//       }
//       if (!player.isFlying && player.dimension.id === 'minecraft:the_end') {
//         const tpTo = {
//           x: playBV.from.x + player.location.x - endBV.from.x,
//           y: player.location.y,
//           z: playBV.from.z + player.location.z - END_PLAY_BV_COORDS_YZ.z,
//         };
//         // world.sendMessage(`Teleporting ${player.name} to Overworld at ${tpTo.x}, ${tpTo.y}, ${tpTo.z}`);
//         player.teleport(tpTo,{ dimension: world.getDimension('overworld')});
//         const muteTP = system.runInterval(() => player.runCommand('stopsound @s portal.travel'), 1);
//         system.runTimeout(() => system.clearRun(muteTP), 20);
//       }
//     }
//   });
// });

// world.afterEvents.entityHitBlock.subscribe(({hitBlock}) => {
//   if (!hitBlock.dimension.getEntitiesAtBlockLocation(hitBlock.location).some(e => e.typeId === 'xmas_above:wish_block_mine')) {
//     system.run(()=>{
//       hitBlock.dimension.spawnEntity('xmas_above:wish_block_mine', hitBlock.bottomCenter());
//       world.sendMessage(`Wish to mine ${hitBlock.location.x}, ${hitBlock.location.y}, ${hitBlock.location.z} !`);
//     });
//   }
// });

// world.beforeEvents.playerInteractWithEntity.subscribe(event => {

//   event.cancel = true;

//   if (event.target.getComponent(EntityComponentTypes.TypeFamily)?.hasTypeFamily('xmas_above:wish_block')) {

//     system.run(()=>{

//       const blockCenter = Vector3Utils.add( event.target.location,{x:0,y:0.5,z:0});
//       const direction = Vector3Utils.subtract(blockCenter, event.player.getHeadLocation());

//       const blockFace =
//         direction.y >= Math.abs(direction.x) && direction.y >= Math.abs(direction.z) ? Direction.Down :
//         -direction.y >= Math.abs(direction.x) && -direction.y >= Math.abs(direction.z) ? Direction.Up :
//         direction.z >= Math.abs(direction.x) && direction.z >= Math.abs(direction.y) ? Direction.North :
//         -direction.z >= Math.abs(direction.x) && -direction.z >= Math.abs(direction.y) ? Direction.South :
//         direction.x >= Math.abs(direction.y) && direction.x >= Math.abs(direction.z) ? Direction.West :
//         Direction.East;

//       const placeLocation =
//         blockFace === Direction.Up    ? Vector3Utils.add(event.target.location, VECTOR3_UP    ) :
//         blockFace === Direction.Down  ? Vector3Utils.add(event.target.location, VECTOR3_DOWN  ) :
//         blockFace === Direction.North ? Vector3Utils.add(event.target.location, VECTOR3_SOUTH ) :
//         blockFace === Direction.South ? Vector3Utils.add(event.target.location, VECTOR3_NORTH ) :
//         blockFace === Direction.East  ? Vector3Utils.add(event.target.location, VECTOR3_EAST  ) :
//         blockFace === Direction.West  ? Vector3Utils.add(event.target.location, VECTOR3_WEST  ) :
//         event.target.location;

//       const wishBlocks = getBlockEntitiesOfTypeAt('xmas_above:wish_block_place', event.target.dimension, placeLocation);

//       if (
//         !wishBlocks.center &&
//         !getBlockEntityOfFamilyAt('xmas_above:wish_block', event.target.dimension, placeLocation) &&
//         (event.target.dimension.getBlock(placeLocation)?.isAir || event.target.dimension.getBlock(placeLocation)?.isLiquid)
//       ) {
//         wishBlocks.center = event.target.dimension.spawnEntity('xmas_above:wish_block_place', placeLocation);
//         world.sendMessage(`Wish to place ${event.itemStack?.typeId} @ ${placeLocation.x}, ${placeLocation.y}, ${placeLocation.z} !`);
//       }

//       else if (wishBlocks?.center?.isValid) wishBlocks.center.remove();

//       updateWishBlocksFaceVisibility( wishBlocks );

//       // const wishBlocks = getBlockEntitiesOfTypeAt(event.target.typeId , event.target.dimension, event.target.location);
//       // event.target.remove();
//       // updateWishBlocksFaceVisibility( wishBlocks );
//     });

//   }

// });

// system.afterEvents.scriptEventReceive.subscribe(event => {

//   const message = JSON.parse(event.message);
//   event.sourceEntity?.dimension.getEntities({type: 'xmas_above:wish_block_place'}).forEach(wish => {
//     world.sendMessage(`Received script event: ${JSON.stringify(message)}`);

//     wish.setProperty('xmas_above:item_pos_x'  , message?.pos  ?.x ?? wish.getProperty('xmas_above:item_pos_x'  ));
//     wish.setProperty('xmas_above:item_pos_y'  , message?.pos  ?.y ?? wish.getProperty('xmas_above:item_pos_y'  ));
//     wish.setProperty('xmas_above:item_pos_z'  , message?.pos  ?.z ?? wish.getProperty('xmas_above:item_pos_z'  ));
//     wish.setProperty('xmas_above:item_rot_x'  , message?.rot  ?.x ?? wish.getProperty('xmas_above:item_rot_x'  ));
//     wish.setProperty('xmas_above:item_rot_y'  , message?.rot  ?.y ?? wish.getProperty('xmas_above:item_rot_y'  ));
//     wish.setProperty('xmas_above:item_rot_z'  , message?.rot  ?.z ?? wish.getProperty('xmas_above:item_rot_z'  ));
//     wish.setProperty('xmas_above:item_scale_x', message?.scale?.x ?? wish.getProperty('xmas_above:item_scale_x'));
//     wish.setProperty('xmas_above:item_scale_y', message?.scale?.y ?? wish.getProperty('xmas_above:item_scale_y'));
//     wish.setProperty('xmas_above:item_scale_z', message?.scale?.z ?? wish.getProperty('xmas_above:item_scale_z'));

//   });
// });

// let simulatedPlayer:SimulatedPlayer;

// world.beforeEvents.playerInteractWithBlock.subscribe(({player,isFirstEvent, block, cancel}) => {
//   if (block.typeId === 'minecraft:crafting_table') {
//     system.run(()=>player.setGameMode(GameMode.Spectator));
//     system.runTimeout(()=>player.setGameMode(GameMode.Creative),1);
//   }
// });

// let moveLoc = VECTOR3_EAST;
// register('testClass','testFn',(test) => {
//   world.getDimension('overworld').getEntities({excludeTypes:["player"]}).forEach(en => {
//     test.walkTo(en, moveLoc);
//   });
// }).structureLocation(VECTOR3_ONE).structureName('testFn:void');

// world.afterEvents.playerEmote.subscribe(({player, personaPieceId}) => {
//   const dimension = player.dimension
//   simulatedPlayer = spawnSimulatedPlayer({...player.location,dimension},'Sam',GameMode.Survival)
//   simulatedPlayer.setSkin(getPlayerSkin(player));
// });

// world.afterEvents.playerPlaceBlock.subscribe(({player, block, dimension}) => {
//   // simulatedPlayer?.navigateToBlock(Vector3Utils.add(block.center(),VECTOR3_UP) ).getPath().forEach(v => {
//   //   world.sendMessage(`${v.x}, ${v.y}, ${v.z}`);
//   // });
//   moveLoc = block.center();
//   system.run(() => world.getDimension('overworld').runCommand('/gametest run testClass:testFn'));
// });

// system.runInterval(() => {
//   world.getAllPlayers().forEach(player => {

//     // if (player.inputInfo.getButtonState(InputButton.Jump) === ButtonState.Pressed) {
//     //   // player.teleport(Vector3Utils.add(player.location,{x:0, y:0.1, z:0}));
//     //   // player.clearVelocity();
//     //   // player.applyImpulse({x: 0, y: 0.2, z: 0});
//     // }

//     // const movementVector = player.inputInfo.getMovementVector();

//     // if ( player.getGameMode() == GameMode.Creative && player.isFalling ) {
//     //   player.setGameMode( GameMode.Spectator );
//     //   // if (movementVector.x !== 0 || movementVector.y !== 0) {
//     //   // }
//     // }
//     // else if ( player.getGameMode() == GameMode.Spectator ) {
//     //   if (movementVector.x === 0 && movementVector.y === 0) {
//     //     player.setGameMode( GameMode.Creative );
//     //   }
//     // }
//   });
// }, 1);

// world.afterEvents.playerButtonInput.subscribe(({player, button, newButtonState}) => {

//   let holdJumping;

//   if (button === InputButton.Jump) {

//     if ( newButtonState === ButtonState.Pressed  ) {

//       player.setDynamicProperty("isJumping", true);

//       // if (player.getGameMode() === GameMode.Creative && player.isFlying) {
//       //   player.setGameMode( GameMode.Spectator );
//       // }

//       // player.teleport(Vector3Utils.add(player.location,{x:0, y:0.1, z:0}));

//       // holdJumping = system.runTimeout(() => {
//       //   if (player.getDynamicProperty("isJumping") && player.getGameMode() !== GameMode.Spectator) {
//       //     // player.applyImpulse({x: 0, y: 0.52, z: 0});
//       //   }
//       // }, 2);

//       // if (player.getVelocity() !== VECTOR3_ZERO) {
//       //   player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, false);
//       // }
//       // else {
//       //   player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, true);
//       // }

//     }

//     if ( newButtonState === ButtonState.Released ) {

//       // world.sendMessage(`${player.name} has Jumped? ${player.getDynamicProperty("isSingleJumping")}`);

//       player.setDynamicProperty("isJumping", false);

//       // if (holdJumping) system.clearRun(holdJumping);

//       const resetJump = system.runTimeout(() => {
//         // if (player.getDynamicProperty("isSingleJumping") && player.getGameMode() === GameMode.Survival) {
//         //   player.applyImpulse({x: 0, y: 0.32, z: 0});
//         // }
//         player.setDynamicProperty("isSingleJumping", false)
//       }, 5);

//       if (player.getDynamicProperty("isSingleJumping")){

//         // if (player.getGameMode() === GameMode.Creative) {
//         //   player.setGameMode( GameMode.Spectator );
//         // }
//         // if (player.getGameMode() === GameMode.Spectator) {
//         //   player.setGameMode( GameMode.Creative );
//         // }
//         // if (player.getGameMode() !== GameMode.Spectator) {
//         //   player.setGameMode( GameMode.Spectator );
//         //   // player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, true);
//         // } else {
//         //   // player.inputPermissions.setPermissionCategory(InputPermissionCategory.Jump, false);
//         //   player.setGameMode( GameMode.Creative );
//         // }

//         player.setDynamicProperty("isSingleJumping", false);
//         system.clearRun(resetJump);
//       }

//       else player.setDynamicProperty("isSingleJumping", true);
//     }
//   }

// });
