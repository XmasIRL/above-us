import * as mc from '@minecraft/server'

export class EntityData {
  
  constructor(
    public entity?: mc.Entity,
    public removeAfterGame: boolean = false
  ){}

  static fromJSON (data: any) { return new EntityData( 
    data.entity?.id ? mc.world.getEntity(data.entity.id) 
                    : data.id ? mc.world.getEntity( data.id) 
                    : undefined,
    data.removeAfterGame
  )}

  toJSON() { return { ...this, 
    entity: {id: this.entity?.id} 
  }}

}
