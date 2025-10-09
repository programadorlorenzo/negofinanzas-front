module.exports = {
  apps: [
    {
      name: 'negofinanzas-front',
      script: 'pnpm run start',
      // Deshabilitar watch en producción para evitar ENOSPC
      watch: false,
      // Configuración de producción con variables de entorno explícitas
      env: {
        NODE_ENV: 'production',
        NEXTAUTH_URL: 'https://finanzas.negolorenzo.pe',
        NEXTAUTH_SECRET: 'secretprod4333',
        NEXT_PUBLIC_API_URL: 'https://back-finanzas.negolorenzo.pe',
      },
      // Configuración de logs
      log_file: './logs/app.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // Configuración de instancias
      instances: 1,
      exec_mode: 'fork',
      // Auto restart
      autorestart: true,
      max_restarts: 10,
      min_uptime: '10s',
    },
  ],
};
