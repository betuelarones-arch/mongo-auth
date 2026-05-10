import roleRepository from '../repositories/RoleRepository.js';

export default async function seedRoles() {
    const userRole = await roleRepository.findByName('user');
    if (!userRole) {
        await roleRepository.create({ name: 'user' });
    }

    const adminRole = await roleRepository.findByName('admin');
    if (!adminRole) {
        await roleRepository.create({ name: 'admin' });
    }

    console.log('Seeded roles: user, admin');
}
