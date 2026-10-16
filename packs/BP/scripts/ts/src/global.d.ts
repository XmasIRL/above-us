import * as mc from "@minecraft/server"
import { Test } from "@minecraft/server-gametest";

declare global {

  var dimensions: { [key: string]: mc.Dimension; }
  var gametest: Test;

}

export {};