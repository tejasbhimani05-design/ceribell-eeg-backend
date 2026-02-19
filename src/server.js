import Fastify from "fastify";
import sessionRoutes from "./routes/sessionRoutes.js";

const app = Fastify({ logger: true });

app.get("/health", async () => {
  return { status: "ok", service: "ceribell-eeg-backend" };
});

app.register(sessionRoutes);

app.setErrorHandler((error, request, reply) => {
  request.log.error(error);

  if (error.validation) {
    return reply.status(400).send({
      error: "VALIDATION_ERROR",
      message: "Invalid request data",
      details: error.validation
    });
  }

  return reply.status(500).send({
    error: "INTERNAL_SERVER_ERROR",
    message: "Something went wrong"
  });
})

const start = async () => {
  try {
    await app.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
