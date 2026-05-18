import { existsSync } from 'node:fs'
import path from 'node:path'
import { spawn } from 'node:child_process'
import process from 'node:process'

const projectRoot = process.cwd()
const buildDir = path.join(projectRoot, 'build')
const buildServer = path.join(buildDir, 'bin', 'server.js')
const buildManifest = path.join(buildDir, 'public', 'assets', '.vite', 'manifest.json')

if (!existsSync(buildServer) || !existsSync(buildManifest)) {
  console.error('Production build not found.')
  console.error('Run `npm run build` first, then start the server with `npm start`.')
  process.exit(1)
}

const child = spawn(process.execPath, ['bin/server.js'], {
  cwd: buildDir,
  stdio: 'inherit',
  env: process.env,
})

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 0)
})

