
import type { Agent, JSONSchema } from './types';

export const AGENTS: Agent[] = [
  { id: 'storyteller_agent_001', name: 'Storyteller Agent' }
];

export const MOCK_AGENT_SCHEMAS: { [key: string]: { config_schema: JSONSchema } } = {
  'storyteller_agent_001': {
    config_schema: {
      title: "Storyteller Agent Config",
      type: "object",
      properties: {
        model_name: { 
          type: "string", 
          title: "Model Name", 
          default: "gemini-2.5-flash",
          description: "The underlying AI model to use."
        },
        genre: { 
          type: "string", 
          title: "Story Genre", 
          default: "Fantasy",
          enum: ["Fantasy", "Sci-Fi", "Mystery", "Comedy", "Horror"],
          description: "Select the genre for the story."
        },
        character_name: { 
          type: "string", 
          title: "Main Character Name", 
          default: "Alex",
          description: "Name of the protagonist."
        },
        creativity: { 
          type: "number", 
          title: "Creativity Level", 
          default: 0.8, 
          minimum: 0.1, 
          maximum: 1.0,
          description: "Higher values mean more creative, less predictable stories."
        },
        include_moral: { 
          type: "boolean", 
          title: "Include a Moral", 
          default: true,
          description: "End the story with a moral lesson."
        },
        system_prompt: { 
          type: "string", 
          title: "System Prompt",
          default: "You are a master storyteller for all ages. Your stories are engaging, creative, and well-structured. You must follow the user's configuration for genre and character details.",
          'ui:widget': 'textarea',
          description: "The core instructions for the AI agent."
        }
      },
      required: ["model_name", "genre", "character_name", "system_prompt"]
    }
  }
};
