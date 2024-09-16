import { getCurrentBranchNameSync } from 'src/utils/common/environment/checkGitBranch';

const branchAllowAtoMigrate: string = 'develop';

export const dbConfig = () => ({
    host: process.env.DB_HOST,
    dbPort: process.env.DB_PORT,
    dbUsername: process.env.DB_USER_NAME,
    dbPassword: process.env.DB_USER_PASSWORD,
    database: process.env.DB_NAME,
    isDevelopENV: getCurrentBranchNameSync() === branchAllowAtoMigrate,
});

export const globalConfig = () => ({
    port: process.env.PORT,
    baseUrl: process.env.BASE_URL
});
