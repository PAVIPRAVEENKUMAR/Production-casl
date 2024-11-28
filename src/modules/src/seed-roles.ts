import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RolesService } from './modules/roles/roles.service';


async function seedRoles() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const rolesService = app.get(RolesService);

  try {

    const userRole = await rolesService.createRole('visiter', [
      { action: 'read', subject: 'users', conditions: { userId: '$userId' }},
      { action: 'read', subject: 'Items' },
    ]);
    console.log('User role seeded:', userRole);
  } catch (error) {
    console.error('Error seeding roles:', error);
  }
  await app.close();
}
seedRoles();