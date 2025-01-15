export type CommandCategory = 
  | 'general'
  | 'layout'
  | 'terminal'
  | 'ai'
  | 'blockchain'
  | 'theme'
  | 'market'
  | 'trading'
  | 'analytics'
  | 'settings';

export interface PaletteCommand {
  id: string;
  title: string;
  category: CommandCategory;
  shortcut?: string;
  keywords: string[];
  action: () => void;
  icon?: string;
  description?: string;
} 