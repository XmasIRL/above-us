import * as mc from '@minecraft/server'

export class PlayerData {
  
  constructor(
    public entity?: mc.Player,
    public selectedEntity?: mc.Entity
  ){}

  static fromJSON(data: any) { return new PlayerData( 
    data.entity?.name ? mc.world.getPlayers({name: data.entity.name})[0] 
                      : data.name ? mc.world.getPlayers({name: data.name})[0] 
                      : undefined,
    data.selectedEntity
  )}

  toJSON() { return { ...this, 
    entity: {name: this.entity?.name} 
  }}
}