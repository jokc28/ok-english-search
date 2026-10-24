import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

try {
  const root = new URL('../', import.meta.url);
  const { scripts, releaseChecks } = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
  if (!Array.isArray(releaseChecks) || !releaseChecks.length || releaseChecks.some(name => !/^[a-z][a-z0-9:-]*$/.test(name) || name === 'check:release' || !scripts?.[name])) throw new Error('Required release checks are missing');
  for (const name of releaseChecks) {
    console.log(`[release] ${name}`);
    const result = spawnSync('npm', ['run', name], { cwd: root, stdio: 'inherit', shell: false });
    if (result.status !== 0) {
      process.exit(result.status || 2);
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
