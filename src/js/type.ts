import { MESSAGETYPE, MODE } from "./enums";

export interface MessageOpenlinks {
  type: MESSAGETYPE.OPENLINKS;
  urls: string[];
}

export interface MessageGetlinks {
  type: MESSAGETYPE.GETLINKS;
  mode: MODE;
}

export type MESSAGE = MessageOpenlinks | MessageGetlinks;
