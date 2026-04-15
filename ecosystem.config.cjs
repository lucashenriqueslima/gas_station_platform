module.exports = {
  apps: [
    {
      name: 'gas_station_platform',
      cwd: '/var/www/gas_station_platform/build',
      script: './bin/server.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3333,
      },
      error_file: '/var/www/gas_station_platform/logs/err.log',
      out_file: '/var/www/gas_station_platform/logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
    },
  ],
}
