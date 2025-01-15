export type CommandResult = {
  success: boolean;
  output: string;
  data?: any;
};

export interface TerminalCommand {
  name: string;
  description: string;
  usage: string;
  execute: (args: string[]) => Promise<CommandResult>;
}

export const commands: Record<string, TerminalCommand> = {
  help: {
    name: 'help',
    description: 'Show available commands',
    usage: 'help [command]',
    execute: async (args: string[]) => {
      if (args.length === 0) {
        const commandList = Object.values(commands)
          .map(cmd => `${cmd.name} - ${cmd.description}`)
          .join('\n');
        return {
          success: true,
          output: `Available commands:\n${commandList}`
        };
      }
      
      const command = commands[args[0]];
      if (!command) {
        return {
          success: false,
          output: `Unknown command: ${args[0]}`
        };
      }
      
      return {
        success: true,
        output: `${command.name}\n${command.description}\nUsage: ${command.usage}`
      };
    }
  },
  
  connect: {
    name: 'connect',
    description: 'Connect to a blockchain network',
    usage: 'connect <network> [options]',
    execute: async (args: string[]) => {
      if (args.length === 0) {
        return {
          success: false,
          output: 'Network name required'
        };
      }
      
      // TODO: Implement actual blockchain connection
      return {
        success: true,
        output: `Connected to ${args[0]}`
      };
    }
  },
  
  deploy: {
    name: 'deploy',
    description: 'Deploy a smart contract',
    usage: 'deploy <contract> [args...]',
    execute: async (args: string[]) => {
      if (args.length === 0) {
        return {
          success: false,
          output: 'Contract name required'
        };
      }
      
      // TODO: Implement actual contract deployment
      return {
        success: true,
        output: `Deploying contract: ${args[0]}`
      };
    }
  }
};

export const parseCommand = (input: string): { command: string; args: string[] } => {
  const parts = input.trim().split(/\s+/);
  return {
    command: parts[0].toLowerCase(),
    args: parts.slice(1)
  };
}; 