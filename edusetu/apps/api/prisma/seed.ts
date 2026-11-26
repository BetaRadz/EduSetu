import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const institutionPermissionKeys = [
    'institution:profile:read',
    'institution:profile:write',
    'reviews:read',
    'reviews:respond',
    'connect:manage',
    'analytics:read',
    'billing:manage',
    'members:manage',
  ] as const;

  const permissionDefinitions = [
    ['institution:profile:read', 'View the private institution workspace.'],
    ['institution:profile:write', 'Edit institution profile information.'],
    ['reviews:read', 'View institution review management tools.'],
    ['reviews:respond', 'Respond to public reviews on behalf of an institution.'],
    ['connect:manage', 'Manage institution communication and support cases.'],
    ['analytics:read', 'View aggregated institution analytics.'],
    ['billing:manage', 'Manage institution subscriptions and invoices.'],
    ['members:manage', 'Invite and manage institution team members.'],
    ['moderation:review', 'Review, action, and audit user-generated content.'],
    ['verification:manage', 'Review institution ownership and affiliation verification.'],
    ['platform:admin', 'Manage privileged platform configuration and operations.'],
  ] as const;

  for (const [key, description] of permissionDefinitions) {
    await prisma.permission.upsert({ where: { key }, create: { key, description }, update: { description } });
  }

  const roleDefinitions = [
    { key: 'institution_owner', name: 'Institution Owner', permissions: institutionPermissionKeys },
    {
      key: 'institution_admin',
      name: 'Institution Admin',
      permissions: ['institution:profile:read', 'institution:profile:write', 'reviews:read', 'reviews:respond', 'connect:manage', 'analytics:read', 'members:manage'],
    },
    { key: 'institution_staff', name: 'Institution Staff', permissions: ['institution:profile:read', 'reviews:read', 'reviews:respond', 'connect:manage'] },
  ] as const;

  for (const definition of roleDefinitions) {
    const role = await prisma.role.upsert({
      where: { key: definition.key },
      create: { key: definition.key, name: definition.name, scope: 'INSTITUTION' },
      update: { name: definition.name, scope: 'INSTITUTION' },
    });

    for (const permissionKey of definition.permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key: permissionKey } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        create: { roleId: role.id, permissionId: permission.id },
        update: {},
      });
    }
  }

  const globalRoleDefinitions = [
    { key: 'platform_moderator', name: 'Platform Moderator', permissions: ['moderation:review'] },
    { key: 'verification_officer', name: 'Verification Officer', permissions: ['verification:manage'] },
    { key: 'platform_super_admin', name: 'Platform Super Admin', permissions: ['moderation:review', 'verification:manage', 'platform:admin'] },
  ] as const;

  for (const definition of globalRoleDefinitions) {
    const role = await prisma.role.upsert({
      where: { key: definition.key },
      create: { key: definition.key, name: definition.name, scope: 'GLOBAL' },
      update: { name: definition.name, scope: 'GLOBAL' },
    });

    for (const permissionKey of definition.permissions) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key: permissionKey } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        create: { roleId: role.id, permissionId: permission.id },
        update: {},
      });
    }
  }

  const categoryDefinitions = [
    ['teaching_learning', 'Teaching and learning'],
    ['communication', 'Communication'],
    ['facilities', 'Facilities'],
    ['safety_wellbeing', 'Safety and wellbeing'],
    ['administration', 'Administration'],
    ['student_support', 'Student support'],
    ['transparency', 'Transparency'],
    ['value', 'Value'],
  ] as const;

  for (const [index, [key, label]] of categoryDefinitions.entries()) {
    await prisma.reviewCategory.upsert({
      where: { key },
      create: { key, label, sortOrder: index },
      update: { label, sortOrder: index, isActive: true },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error: unknown) => {
    console.error(error);
    await prisma.$disconnect();
    process.exitCode = 1;
  });
