export interface AIModel {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  type: 'llm' | 'vision' | 'audio' | 'multimodal';
  capabilities: string[];
  parameters: AIModelParameter[];
}

export interface AIModelParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  value: any;
  range?: [number, number];
  options?: string[];
}

export interface AIModelResponse {
  modelId: string;
  timestamp: Date;
  output: string;
  metadata: Record<string, any>;
} 