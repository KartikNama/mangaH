module.exports = {
  apps: [
    {
      name: "saudult-web",
      script: "server.js",
      cwd: "/var/www/mangaH/.next/standalone",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: "3000",
        HOSTNAME: "127.0.0.1",
        NODE_OPTIONS: "--max-old-space-size=384",
      },
      max_memory_restart: "450M",
    },
  ],
};
