import * as mc from "@minecraft/server";
import { registerAsync, Test } from "@minecraft/server-gametest";
import { MinecraftBlockTypes, MinecraftDimensionTypes } from "@minecraft/vanilla-data";
import { GameTestIds, StructureIds, TickingAreaIds } from "constants";
import { getOverworld, run, runDuration, runTimeout, runWhen, tryCatch } from "utils";



export function getGameTestStructureBounds() { return {from: {x:-4, y:getOverworld().heightRange.min, z:-4}, to: {x:4, y:getOverworld().heightRange.min + 24, z:4}}}


export function initGameTest(){

  run(() => mc.world.tickingAreaManager.createTickingArea(TickingAreaIds.GameTest,{dimension:getOverworld(),from:{x:-4,y:0,z:-4},to:{x:4,y:0,z:4}}))
  
  runWhen(() => {  

    registerAsync( GameTestIds.AboveUs.split(':')[0], GameTestIds.AboveUs.split(':')[1],  async (gametest: Test) => { 
      globalThis.gametest = gametest; 
      gametest.runOnFinish(clearGameTestArtifacts);
    }).maxTicks(2147483647).structureName('x:void').structureLocation({x:0, y:getOverworld().heightRange.min, z:0},MinecraftDimensionTypes.Overworld)
    
    backupGameTestBounds();
    runTimeout(() => {
      getOverworld().runCommand(`gametest run ${GameTestIds.AboveUs}`)
      clearGameTestArtifacts(true);
    }, 2)   

  },() => getOverworld().isChunkLoaded({x:0,y:0,z:0}))

}


function backupGameTestBounds() { run(() => {
  mc.world.structureManager.delete(StructureIds.GameTestRestore);
  mc.world.structureManager.delete(StructureIds.GameTestRestoreOrigin);      
  mc.world.structureManager.createFromWorld( StructureIds.GameTestRestoreOrigin, getOverworld(), {x:0, y:getOverworld().heightRange.min, z:0}, {x:0, y:getOverworld().heightRange.min, z:0}, { saveMode: mc.StructureSaveMode.World } )
  const structureOrigin = {x:0, y:getOverworld().heightRange.min, z:0}  
  getOverworld().setBlockType(structureOrigin,MinecraftBlockTypes.StructureVoid)
  mc.world.structureManager.createFromWorld( StructureIds.GameTestRestore, getOverworld(), getGameTestStructureBounds().from, getGameTestStructureBounds().to, {saveMode: mc.StructureSaveMode.World} )      
})}


function restoreGameTestBounds(keepStructureBlock?: boolean) { run(() => {
  mc.world.structureManager.place( StructureIds.GameTestRestore, getOverworld(), getGameTestStructureBounds().from )
  if (!keepStructureBlock)  mc.world.structureManager.place( StructureIds.GameTestRestoreOrigin, getOverworld(),  {x:0, y:getOverworld().heightRange.min, z:0})
})}

function clearGameTestArtifacts(keepStructureBlock?: boolean) {
    runDuration(() => {
    restoreGameTestBounds(keepStructureBlock);
  }, 3 )
}