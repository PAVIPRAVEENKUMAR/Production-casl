import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesService } from './modules/roles/roles.service';


async function seedRoles() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rolesService = app.get(RolesService);

  try {
    const adminRole = await rolesService.createRole('admin', [
      { action: 'manage', subject: 'all' },
    ]);
    console.log('Admin role seeded:', adminRole);
 
    const userRole = await rolesService.createRole('user', [
      { action: 'read', subject: 'Item' },
      { action: 'read', subject: 'Item' },
      { action: 'update', subject: 'Item', conditions: { userId: '$userId' } },
    { action: 'delete', subject: 'Item', conditions: { userId: '$userId' } },
    ]);
    console.log('User role seeded:', userRole);
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
  await app.close();
}
seedRoles();