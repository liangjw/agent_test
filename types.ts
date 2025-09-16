
export interface Agent {
  id: string;
  name: string;
}

export interface JSONSchema {
  title?: string;
  description?: string;
  type: 'object';
  properties: {
    [key: string]: {
      type: 'string' | 'number' | 'integer' | 'boolean';
      title: string;
      description?: string;
      default?: any;
      enum?: (string | number)[];
      'ui:widget'?: 'textarea';
      minimum?: number;
      maximum?: number;
    };
  };
  required?: string[];
}

export interface AgentConfig {
  [key: string]: any;
}

export interface ChatMessage {
  id: number;
  role: 'user' | 'agent';
  content: string;
}
