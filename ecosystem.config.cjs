const path = require('node:path')

const projectRoot = __dirname
const logsDir = path.join(projectRoot, 'logs')

module.exports = {
  apps: [
    {
      name: 'gas_station_platform',
      cwd: path.join(projectRoot, 'build'),
      script: './bin/server.js',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      env: {
        NODE_ENV: 'production',
        PORT: 3333,
      },
      error_file: path.join(logsDir, 'err.log'),
      out_file: path.join(logsDir, 'out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
