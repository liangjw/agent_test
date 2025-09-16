
import React, { useState, useEffect, useCallback } from 'react';
import { AgentConfigPanel } from './components/AgentConfigPanel';
import { ChatPanel } from './components/ChatPanel';
import { getAgentSchema, updateAgentConfig, streamChatResponse } from './services/agentService';
import { AGENTS } from './constants';
import type { Agent, AgentConfig, ChatMessage, JSONSchema } from './types';

const App: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent>(AGENTS[0]);
  const [schema, setSchema] = useState<JSONSchema | null>(null);
  const [config, setConfig] = useState<AgentConfig>({});
  const [initialConfig, setInitialConfig] = useState<AgentConfig>({});
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingSchema, setIsLoadingSchema] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

  const loadAgentData = useCallback(async (agent: Agent) => {
    setIsLoadingSchema(true);
    setSchema(null);
    setMessages([]);
    try {
      const schemaResponse = await getAgentSchema(agent.id);
      setSchema(schemaResponse.data.config_schema);

      // Initialize config with default values from schema
      const defaultConfig: AgentConfig = {};
      if (schemaResponse.data.config_schema.properties) {
        for (const key in schemaResponse.data.config_schema.properties) {
          defaultConfig[key] = schemaResponse.data.config_schema.properties[key].default;
        }
      }
      setConfig(defaultConfig);
      setInitialConfig(defaultConfig);

    } catch (error) {
      console.error("Failed to load agent schema:", error);
      // You could set an error state here and display it to the user
    } finally {
      setIsLoadingSchema(false);
    }
  }, []);

  useEffect(() => {
    loadAgentData(selectedAgent);
  }, [selectedAgent, loadAgentData]);

  const handleAgentChange = (agentId: string) => {
    const agent = AGENTS.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
    }
  };

  const handleConfigChange = (newConfig: AgentConfig) => {
    setConfig(newConfig);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateAgentConfig(selectedAgent.id, config);
      setInitialConfig(config); // Update the 'clean' state
      // Show a success message if you have a notification system
    } catch (error) {
      console.error("Failed to save config:", error);
      // Show an error message
    } finally {
      setIsSaving(false);
    }
  };

  const handleReload = () => {
    setConfig(initialConfig);
  };

  const handleSendMessage = (text: string) => {
    const userMessage: ChatMessage = { id: Date.now(), role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);
    
    const agentMessage: ChatMessage = { id: Date.now() + 1, role: 'agent', content: '' };
    setMessages(prev => [...prev, agentMessage]);

    streamChatResponse(text, (chunk) => {
      setMessages(prev => {
        return prev.map(msg => 
          msg.id === agentMessage.id 
            ? { ...msg, content: msg.content + chunk } 
            : msg
        );
      });
    }).finally(() => {
      setIsStreaming(false);
    });
  };

  return (
    <div className="flex h-screen font-sans bg-gray-900 text-gray-100">
      <AgentConfigPanel
        agents={AGENTS}
        selectedAgentId={selectedAgent.id}
        onAgentChange={handleAgentChange}
        schema={schema}
        config={config}
        onConfigChange={handleConfigChange}
        onSave={handleSave}
        onReload={handleReload}
        isLoading={isLoadingSchema}
        isSaving={isSaving}
      />
      <ChatPanel
        messages={messages}
        onSendMessage={handleSendMessage}
        isStreaming={isStreaming}
        agentName={selectedAgent.name}
      />
    </div>
  );
};

export default App;
