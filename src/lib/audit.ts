import { prisma } from "@/lib/prisma";

type AuditAction = "CREATE" | "UPDATE" | "DELETE" | "MOVE" | "LOGIN" | "LOGOUT";

export async function logAudit(
  userId: string,
  action: AuditAction,
  entity: string,
  entityId: string,
  details?: string
) {
  await prisma.auditLog.create({
    data: { userId, action, entity, entityId, details },
  });
}
