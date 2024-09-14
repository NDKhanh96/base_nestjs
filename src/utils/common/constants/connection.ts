import { getCurrentBranchNameSync } from 'src/utils/common/environment/checkGitBranch';

export const dbConfig = () => ({
  host: process.env.DB_HOST,
  dbPort: process.env.DB_PORT,
  username: process.env.DB_USER_NAME,
  password: process.env.DB_USER_PASSWORD,
  database: process.env.DB_NAME,
  isDevelopENV: getCurrentBranchNameSync() === 'develop',
});

export const globalConfig = () => ({
  port: process.env.PORT,
});
