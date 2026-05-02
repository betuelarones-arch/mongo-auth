import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },
    password: { 
        type: String, 
        required: true,
        validate: {
            validator: function(v) {
                if (v.startsWith('$2b$') || v.startsWith('$2a$') || v.startsWith('$2y$')) {
                    return true;
                }
                return /^(?=.*[A-Z])(?=.*\d)(?=.*[#$%&*@])[A-Za-z\d#$%&*@]{8,}$/.test(v);
            },
            message: 'La contraseña debe tener al menos 8 caracteres, 1 mayúscula, 1 dígito y 1 carácter especial (#$%&*@)'
        }
    },
    roles: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Role' 
    }],
    name: { 
        type: String
    },
    lastName: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    birthdate: {
        type: Date,
        required: true
    },
    url_profile: {
        type: String
    },
    address: {
        type: String
    }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (this.isModified('password') && !this.password.startsWith('$2b$')) {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS ?? '10', 10);
        this.password = await bcrypt.hash(this.password, saltRounds);
    }
    next();
});

export default mongoose.model('User', UserSchema);