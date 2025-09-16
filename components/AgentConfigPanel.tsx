
import React from 'react';
import type { Agent, AgentConfig, JSONSchema } from '../types';
import { JsonSchemaForm } from './JsonSchemaForm';
import { ReloadIcon, SaveIcon } from './Icons';

interface AgentConfigPanelProps {
  agents: Agent[];
  selectedAgentId: string;
  onAgentChange: (agentId: string) => void;
  schema: JSONSchema | null;
  config: AgentConfig;
  onConfigChange: (newConfig: AgentConfig) => void;
  onSave: () => void;
  onReload: () => void;
  isLoading: boolean;
  isSaving: boolean;
}

export const AgentConfigPanel: React.FC<AgentConfigPanelProps> = ({
  agents,
  selectedAgentId,
  onAgentChange,
  schema,
  config,
  onConfigChange,
  onSave,
  onReload,
  isLoading,
  isSaving,
}) => {
  return (
    <div className="w-1/3 h-full bg-gray-800 border-r border-gray-700 flex flex-col p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">Agent Playground</h1>
        <p className="text-gray-400">Configure and test your AI agents in real-time.</p>
      </header>
      
      <div className="mb-6">
        <label htmlFor="agent-select" className="block text-sm font-medium text-gray-300 mb-2">
          Agent Name
        </label>
        <select
          id="agent-select"
          value={selectedAgentId}
          onChange={(e) => onAgentChange(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-grow bg-gray-800/50 rounded-lg p-6 border border-gray-700 overflow-y-auto custom-scrollbar">
        <h2 className="text-xl font-semibold text-white mb-4">Agent Config</h2>
        {isLoading && (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-400"></div>
          </div>
        )}
        {!isLoading && schema && (
          <JsonSchemaForm schema={schema} formData={config} onChange={onConfigChange} />
        )}
        {!isLoading && !schema && (
          <p className="text-gray-500">Could not load agent configuration schema.</p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-end space-x-4">
        <button
          onClick={onReload}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors"
        >
          <ReloadIcon className="w-4 h-4 mr-2" />
          Reload
        </button>
        <button
          onClick={onSave}
          disabled={isSaving}
          className="flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500 transition-colors disabled:bg-indigo-400 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          ) : (
            <SaveIcon className="w-4 h-4 mr-2" />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
       <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #2d3748; /* gray-800 */
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4a5568; /* gray-600 */
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #718096; /* gray-500 */
        }
      `}</style>
    </div>
  );
};
