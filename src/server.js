import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app.js';
import seedRoles from './utils/seedRoles.js';
import seedUsers from './utils/seedUsers.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('Connected to MongoDB Atlas');

        await seedRoles();
        await seedUsers();
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

connectDB();

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err.message);
    server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Closing HTTP server...');
    server.close(() => {
        mongoose.connection.close(false, () => {
            console.log('Process terminated');
            process.exit(0);
        });
    });
});
