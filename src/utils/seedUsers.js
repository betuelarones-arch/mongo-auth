import User from '../models/User.js';
import Role from '../models/Role.js';

export default async function seedUsers() {
    try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@system.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin#1234';
        
        const existingAdmin = await User.findOne({ email: adminEmail }).populate('roles');
        if (existingAdmin) {
            console.log('Admin user already exists');
            return;
        }

        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
            console.log('Admin role not found, please run seedRoles first');
            return;
        }

        const adminUser = new User({
            email: adminEmail,
            password: adminPassword,
            name: 'Admin',
            lastName: 'System',
            phoneNumber: '+1234567890',
            birthdate: new Date('1990-01-01'),
            url_profile: '',
            address: 'System Address',
            roles: [adminRole._id]
        });

        await adminUser.save();
        console.log(`Admin user created: ${adminEmail}`);
    } catch (err) {
        console.error('Error seeding admin user:', err);
    }
}