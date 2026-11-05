import * as mc from "@minecraft/server"
import { Test } from "@minecraft/server-gametest";
import { EntityData, Session } from "game";
import { Move } from "move";
import { PlayerData } from "player";
import { BoundsDimension } from "utils";

declare global {

  var dimensions  : { [key: string]: mc.Dimension; }
  var sessions    : { [key: string]: Session; }

  var players     : { [key: string]: PlayerData; }
  var entities    : { [key: string]: EntityData; }
  var moves       : { [key: string]: Move; }
  
}

export {};