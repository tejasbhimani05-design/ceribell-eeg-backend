import Fastify from "fastify";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { status: "ok", service: "ceribell-eeg-backend" };
});

app.register(sessionRoutes);

const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
