import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const commandCheckGitBranchInShell: string = 'git rev-parse --abbrev-ref HEAD';

export function getCurrentBranchNameSync(): string {
    try {
        const stdout: Buffer = execSync(commandCheckGitBranchInShell);

        return stdout.toString().trim();
    } catch (error) {
        console.warn(
            'Cannot get the git branch name, will use default name <develop>',
        );
        console.error(error);

        return 'develop';
    }
}

export function getEnvFilePathSync(): string {
    const branchName: string = getCurrentBranchNameSync();
    const projectRoot: string = process.cwd();
    const envFilePath: string = join(projectRoot, `.env.${branchName}`);
  
    if (existsSync(envFilePath)) {

        return `.env.${branchName}`;
    }
 
    return '.env';
}