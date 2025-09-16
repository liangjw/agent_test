
import { MOCK_AGENT_SCHEMAS } from '../constants';
import type { AgentConfig, JSONSchema } from '../types';

interface SchemaResponse {
  resultCode: string;
  resultMsg: string;
  data: {
    agent_id: string;
    config_schema: JSONSchema;
  };
}

export const getAgentSchema = (agentId: string): Promise<SchemaResponse> => {
  console.log(`Fetching schema for agent: ${agentId}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const schemaData = MOCK_AGENT_SCHEMAS[agentId];
      if (schemaData) {
        resolve({
          resultCode: "SUCCESS",
          resultMsg: "Schema retrieved successfully.",
          data: {
            agent_id: agentId,
            config_schema: schemaData.config_schema,
          },
        });
      } else {
        reject(new Error("Agent schema not found."));
      }
    }, 500); // Simulate network delay
  });
};

export const updateAgentConfig = (agentId: string, config: AgentConfig): Promise<void> => {
  console.log(`Updating config for agent: ${agentId}`, config);
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Config saved successfully.');
      resolve();
    }, 700); // Simulate network delay
  });
};

export const streamChatResponse = (message: string, onChunk: (chunk: string) => void): Promise<void> => {
  console.log(`Streaming response for message: "${message}"`);
  return new Promise((resolve) => {
    const response = "This is a streamed response from the agent, demonstrating how Server-Sent Events would work. Each part of this sentence is delivered as a separate chunk, creating a real-time typing effect for the user. This improves the user experience by providing immediate feedback. The simulation is now complete.";
    const chunks = response.split(' ');
    let chunkIndex = 0;

    const intervalId = setInterval(() => {
      if (chunkIndex < chunks.length) {
        const chunk = chunks[chunkIndex] + (chunkIndex === chunks.length - 1 ? '' : ' ');
        onChunk(chunk);
        chunkIndex++;
      } else {
        clearInterval(intervalId);
        resolve();
      }
    }, 80); // Simulate streaming delay
  });
};
