import Fastify from "fastify";
import sessionRoutes from "./routes/sessionRoutes.js";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import cors from "@fastify/cors";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: true,
});

await app.register(swagger, {
  openapi: {
    info: {
      title: "Ceribell EEG Backend API",
      description: "API documentation for sessions and related endpoints",
      version: "1.0.0",
    },
  },
});

await app.register(swaggerUI, {
  routePrefix: "/docs",
});

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
