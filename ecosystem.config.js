module.exports = {
  apps: [
    {
      name: "custom-domain",
      script: "yarn start",
      instances: "max",
      exec_mode: "cluster",
    },
  ],
};
