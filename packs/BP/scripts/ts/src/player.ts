import { generateUUID, RecursivePartial, run, runInterval } from "utils";
import { PlayerData } from "types";
import { ItemStartUseAfterEvent, ItemStopUseAfterEvent, PlayerJoinAfterEvent, PlayerSpawnAfterEvent, system, world } from "@minecraft/server";
import { Vector3Utils } from "@minecraft/math";
import { ITEM, PARTICLE, PLAYER, WISH } from "constants";
import { wishManager } from "wish";
import { MoveToWishData, WishData } from "types";


export class PlayerManager {
  
  private players: Record<string, PlayerData> = {};

  get( id: string ): PlayerData | undefined {
    return this.players[id]
  }
  
  update( newData:Partial<PlayerData> ): PlayerData {      
      
    const id = newData.id ?? generateUUID();

    const oldData = this.players[id];    
    const data:PlayerData = {
        id              : id,
        name            : newData.name ?? oldData?.name ?? id ?? "",
        selected        : newData.selected ?? oldData?.selected ?? {},
        entity          : newData.entity ?? oldData?.entity,
        is_using_item   : newData.is_using_item ?? oldData?.is_using_item ?? false,
        runs            : newData.runs ?? oldData?.runs ?? {}
    }    

    // console.log('Old Data:' + JSON.stringify(oldData))
    // console.log('New Data:' + JSON.stringify(newData))
    // console.log('Merged Data:' + JSON.stringify(data))
    // console.log('Before Update:' + JSON.stringify(this.players.get(id)))
    this.players[id] = data;    
    // console.log('After Update: ' + JSON.stringify(this.players.get(id)))
    return data;
  }

  remove( id:string ){
    delete this.players[id];
  }

  getRun( player_id: string, run_name: string ) {
    return this.players[player_id]?.runs[run_name];
  }

  setRun( player_id: string, run_name: string, run_id: number ) {
    const runs = this.players[player_id]?.runs ?? {};
    runs[run_name] = run_id;
    this.update({id: player_id, runs: runs});
  }

  clearRun( player_id: string, run_name: string ) {
    const runs = this.players[player_id]?.runs ?? {}
    const runId = runs[run_name];
    system.clearRun(runId);
    delete runs[run_name]
  }

}

export const playerManager = new PlayerManager();


export const onPlayerItemStartUse =  
({ source, useDuration, itemStack }:ItemStartUseAfterEvent) => {

    if (!itemStack) return;

    run(() => {

      if (itemStack.typeId == ITEM.DIAMOND_SPEAR.ID){
              
        // wishTrail.forEach( wish => removeWish(wish));
        // wishTrail.clear()

        playerManager.update({id:source.name, selected:{wish: {
            id: generateUUID(),
            wish_type: WISH.WISH_TYPE.MOVE_TO,
            player: source,
            path: []
        }}})      

        playerManager.setRun( source.name, PLAYER.RUNS.SPEAR_USE, runInterval( () => {

            const spearWish = playerManager.get(source.name)?.selected?.wish as MoveToWishData;

            let targetLocation = source.getViewDirection()
            targetLocation = Vector3Utils.scale(targetLocation, 3);
            targetLocation = Vector3Utils.add(source.getHeadLocation(), targetLocation)

            if (!spearWish.path?.find( point => Vector3Utils.equals(point, targetLocation))) {                        
              spearWish.path?.push(targetLocation);
              playerManager.update({id:source.name, selected:{wish: spearWish}});
              source.dimension.spawnParticle(PARTICLE.VILLAGER_HAPPY, targetLocation);
            }


        }))
      }
    })
  }


export const onPlayerItemStopUse =  
    ({ source, useDuration, itemStack }:ItemStopUseAfterEvent) => {

        if (!itemStack) return;

        const playerData = playerManager.update({id: source.name, is_using_item: false});

        if (
            itemStack.typeId == ITEM.DIAMOND_SPEAR.ID 
            && playerManager.getRun(playerData.id, PLAYER.RUNS.SPEAR_USE)
        ){

            console.log('Spear Update: ' + JSON.stringify(playerData))

            let targetLocation = source.getViewDirection()
            targetLocation = Vector3Utils.scale(targetLocation, 3);
            targetLocation = Vector3Utils.add(source.getHeadLocation(), targetLocation)
            
            const spearWish =  playerManager.get(source.name)?.selected?.wish as MoveToWishData;

            wishManager.create({ ...spearWish, 
              location: targetLocation, 
              dimension: source.dimension
            })            
        
            playerManager.clearRun(playerData.id, PLAYER.RUNS.SPEAR_USE)
        }
    }


export const onPlayerJoin = 
    ({playerId, playerName}:PlayerJoinAfterEvent) => {
        console.log(`JOIN: ${playerId}, ${playerName}`);
    }

export const onPlayerSpawn = 
    ({initialSpawn, player}:PlayerSpawnAfterEvent) => {
        console.log(`SPAWN: ${player.id}, ${player.name}`);        
        if (initialSpawn) {
            playerManager.update({  id: player.name,  entity: player  });
            console.log(JSON.stringify(playerManager.get(player.name)))
        }
    }
