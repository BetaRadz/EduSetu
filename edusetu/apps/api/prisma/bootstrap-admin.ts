import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const issuer = process.env.BOOTSTRAP_ADMIN_ISSUER;
  const subject = process.env.BOOTSTRAP_ADMIN_SUBJECT;
  const email = process.env.BOOTSTRAP_ADMIN_EMAIL;

  if (!issuer || !subject) {
    throw new Error('Set BOOTSTRAP_ADMIN_ISSUER and BOOTSTRAP_ADMIN_SUBJECT for the exact OIDC account.');
  }
  if (process.env.AUTH_ENABLED !== 'true' || issuer !== process.env.OIDC_ISSUER) {
    throw new Error('Enable the configured OIDC provider and use its exact OIDC_ISSUER before bootstrapping an administrator.');
  }

  const role = await prisma.role.findUnique({ where: { key: 'platform_super_admin' } });
  if (!role || role.scope !== 'GLOBAL') {
    throw new Error('Platform roles are missing. Run the database seed first.');
  }

  const user = await prisma.user.upsert({
    where: { externalIssuer_externalSubject: { externalIssuer: issuer, externalSubject: subject } },
    create: { externalIssuer: issuer, externalSubject: subject, email },
    update: email ? { email } : {},
    select: { id: true, email: true },
  });

  await prisma.userRoleAssignment.upsert({
    where: { userId_roleId: { userId: user.id, roleId: role.id } },
    create: { userId: user.id, roleId: role.id },
    update: {},
  });

  console.log(`Platform administrator role assigned to ${user.email ?? user.id}.`);
  console.log('After verifying the account can access the platform, remove the bootstrap values from your local environment.');
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
