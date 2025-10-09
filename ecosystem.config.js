module.exports = {
  apps: [
    {
      watch: true,
      name: 'negofinanzas-front',
      script: 'pnpm run start',
      ignore_watch: ['node_modules', '.next', 'temp'],
    },
  ],
};
