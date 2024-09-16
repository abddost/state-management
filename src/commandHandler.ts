// src/commandHandler.ts

import { Command, Event, CommandHandler, CommandHandlers } from "./types";

export function createCommandHandler(
  handlers: CommandHandlers
): CommandHandler {
  return (command: Command) => {
    const handler = handlers[command.type];
    if (!handler) {
      throw new Error(`No handler for command type: ${command.type}`);
    }
    return handler(command);
  };
}
