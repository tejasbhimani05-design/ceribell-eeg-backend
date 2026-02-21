import { prisma } from "../db/prisma.js";

const createSessionSchema = {
  body: {
    type: "object",
    required: ["patientId", "deviceId"],
    additionalProperties: false,
    properties: {
      patientId: { type: "string", minLength: 1 },
      deviceId: { type: "string", minLength: 1 },
    },
  },
};

export default async function sessionRoutes(fastify) {
  fastify.post(
    "/sessions",
    { schema: createSessionSchema },
    async (request, reply) => {
      const { patientId, deviceId } = request.body;

      const session = await prisma.session.create({
        data: { patientId, deviceId },
      });

      return reply.code(201).send({
        sessionId: session.id,
        patientId: session.patientId,
        deviceId: session.deviceId,
        status: session.status,
        createdAt: session.createdAt,
      });

    },
  );

  fastify.get("/sessions", async(request, reply) => {
    const sessions = await prisma.session.findMany({
        orderBy: { createdAt: "desc"}
    });
    return reply.send(sessions);
  });

  fastify.get("/sessions/:id", async (request, reply) => {
  const { id } = request.params;

  const session = await prisma.session.findUnique({ where: { id } });

  if (!session) {
    return reply.code(404).send({ error: "NOT_FOUND", message: "Session not found" });
  }

  return reply.send(session);
});
}
