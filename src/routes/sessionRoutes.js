import crypto from "crypto";
export default async function sessionRoutes(fastify) {
    fastify.post("/sessions", async(request, reply) => {
        const {patientId, deviceId} = request.body;

        if(!patientId || !deviceId) {
            return reply.status(400).send({error: "patientId and deviceId are required"});
        }

        const session = {
            sessionId: crypto.randomUUID(),
            patientId,
            deviceId,
            status: "created",
            createdAt: new Date().toISOString()
        };

        return session;
    });

}