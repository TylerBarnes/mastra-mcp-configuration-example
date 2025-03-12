import { Agent } from "@mastra/core";
import { MCPConfiguration } from "@mastra/mcp";
import { openai } from "@ai-sdk/openai";
import path from "path";
import { Memory } from "@mastra/memory";

// start sse server - in real life this would already be running but want to show using sse and stdio in this example
import { startMockMCPSSE } from "../mcp/sse";

await startMockMCPSSE();

const mcp = new MCPConfiguration({
  servers: {
    stockPrice: {
      command: "pnpx",
      args: ["tsx", "../../src/mastra/mcp/stock-price.ts"],
      env: {
        FAKE_CREDS: "let me in!",
      },
    },
    weather: {
      url: new URL("http://localhost:8080/sse"),
    },
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
