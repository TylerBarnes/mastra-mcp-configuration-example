import { Agent } from "@mastra/core";
import { MCPConfiguration } from "@mastra/mcp";
import { openai } from "@ai-sdk/openai";
import path from "path";
import { Memory } from "@mastra/memory";

const mcp = new MCPConfiguration({
  servers: {
    textEditor: {
      command: "pnpx",
      args: [
        "@modelcontextprotocol/server-filesystem",
        path.join(process.cwd(), `../`), // access cwd + dir above
      ],
    },
  },
});

export const mcpExampleAgent = new Agent({
  name: "MCP Agent",
  instructions: "You are a helpful assistant that has filesystem access.",
  model: openai("gpt-4"),
  tools: await mcp.getTools(),
  memory: new Memory({
    options: {
      semanticRecall: false,
    },
  }),
});
