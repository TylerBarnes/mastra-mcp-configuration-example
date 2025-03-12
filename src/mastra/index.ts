import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";

import { mcpExampleAgent } from "./agents";

export const mastra = new Mastra({
  agents: { mcpExampleAgent },
  logger: createLogger({
    name: "Mastra",
    level: "info",
  }),
});
