#!/usr/bin/env node

import { execFileSync } from 'child_process';
import { existsSync, rmSync, copyFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

const runTsc = (args = []) => {
  const tscPath = require.resolve('typescript/bin/tsc');
  execFileSync(process.execPath, [tscPath, ...args], { stdio: 'inherit' });
};

console.log('🔨 Building OpenSpec...\n');

// Clean dist directory
if (existsSync('dist')) {
  console.log('Cleaning dist directory...');
  rmSync('dist', { recursive: true, force: true });
}

// Run TypeScript compiler (use local version explicitly)
console.log('Compiling TypeScript...');
try {
  runTsc(['--version']);
  runTsc();

  // Copy template files
  console.log('Copying template files...');
  copyFileSync('src/core/templates/agents.md', 'dist/core/templates/agents.md');

  console.log('\n✅ Build completed successfully!');
} catch (error) {
  console.error('\n❌ Build failed!');
  process.exit(1);
}
