export default {
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    // The blackbox tester agent reaches this dev server from inside a
    // container via the Docker host-gateway alias, not localhost.
    allowedHosts: ['host.docker.internal'],
  },
};
