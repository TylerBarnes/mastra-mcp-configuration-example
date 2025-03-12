import { spawn } from "child_process";
import path from "path";

function relativeFromRoot(pathString: string) {
  if (import.meta.url.includes(`.mastra`)) {
    return path.join(`../../`, pathString);
  }

  return path.join(`./`, pathString);
}

export async function startMockMCPSSE() {
  const sseFile = relativeFromRoot(`./src/mastra/mcp/weather.ts`);

  console.log(`Starting mock sse server`);
  // simulating an sse server that's already running
  const sseProcess = spawn(`pnpx`, [`tsx`, sseFile]);

  sseProcess.stderr.on(`data`, (chunk) => {
    const message = chunk.toString();
    console.error(message);
  });
  await new Promise((res) => {
    sseProcess.stdout.on(`data`, (chunk) => {
      const message = chunk.toString();
      if (message.includes("server is running on SSE")) {
        res(null);
      } else {
        console.log(message);
      }
    });
  });

  process.on(`exit`, () => {
    sseProcess.kill(`SIGINT`);
  });
}
