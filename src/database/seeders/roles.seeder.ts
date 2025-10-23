import { DataSource } from 'typeorm';
import { Role } from '../../modules/roles/entities/role.entity';

export class RolesSeeder {
  public async run(dataSource: DataSource): Promise<void> {
    const roleRepository = dataSource.getRepository(Role);

    const roles = [
      {
        name: 'MASTER',
        description: 'Master administrator with full system access',
      },
      {
        name: 'BARBER',
        description: 'Barber providing services to clients',
      },
      {
        name: 'EMPLOYEE',
        description: 'Employee staff member',
      },
      {
        name: 'CLIENT',
        description: 'Customer/client booking services',
      },
    ];

    for (const roleData of roles) {
      const existingRole = await roleRepository.findOne({
        where: { name: roleData.name },
      });

      if (!existingRole) {
        const role = roleRepository.create(roleData);
        await roleRepository.save(role);
        console.log(`✓ Role "${roleData.name}" created successfully`);
      } else {
        console.log(`- Role "${roleData.name}" already exists, skipping...`);
      }
    }

    console.log('Roles seeding completed!');
  }
}

