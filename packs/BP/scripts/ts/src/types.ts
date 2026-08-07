import { Block, Dimension, Entity, ItemStack, Player, Vector3 } from "@minecraft/server"

export type PlayerData = {
    id              : string,
    name            : string,
    selected: {
        entity     ?: Entity,
        block      ?: Block,
        item       ?: ItemStack,
        wish       ?: WishData | MoveToWishData
    },
    is_using_item   : boolean,
    runs            : Record<string, number>
    entity         ?: Player
}

export type WishData = {
    id              : string, 
    wish_type       : string
    dimension      ?: Dimension | string
    location       ?: Vector3,
    player         ?: Player | string,
    entity         ?: Entity
}

export type MoveToWishData = WishData & {
    path           ?: Vector3[] 
} 
