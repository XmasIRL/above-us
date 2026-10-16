import * as mc from "@minecraft/server";
import { MinecraftDimensionTypes } from "@minecraft/vanilla-data";
import * as gametest from "gametest";
import { run } from "utils";

export function setupWorld() {

  run(() => {    
    
    globalThis.dimensions = {};
    globalThis.dimensions.Overworld = mc.world.getDimension(MinecraftDimensionTypes.Overworld);
    globalThis.dimensions.Nether = mc.world.getDimension(MinecraftDimensionTypes.Nether);
    globalThis.dimensions.TheEnd = mc.world.getDimension(MinecraftDimensionTypes.TheEnd);

    gametest.initGameTest()
  
  })
  
}