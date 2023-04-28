interface UserConfig {
  /** directory where tests will be written */
  dir?: string;
  projectId: string;
  managerURL: string;
  auth: {
    username: string;
    password: string;
  };
  /** Custom behaviours */
  behaviours: Record<string, (...args) => unknown>;
}

export type ResolvedConfig = UserConfig & { dir: string; auth: { username: string; password: string } };

export function resolveConfig(config: UserConfig): ResolvedConfig {
  if (config.auth.username && config.auth.password) {
    return {
      ...config,
      dir: config.dir ?? '.hummus',
    };
  }

  throw new Error('Invalid hummus config');
}
