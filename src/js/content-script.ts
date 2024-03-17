import { init as initEvent } from "./content-script/event";
import { init as initMessage } from "./content-script/message";

initMessage();
initEvent();
