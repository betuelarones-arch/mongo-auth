import jwt from 'jsonwebtoken';

export default function authenticate(req, res, next) {
    try {
        let token = null;
        
        // Intentar leer del header Authorization
        const header = req.headers.authorization;
        if (header && header.startsWith('Bearer ')) {
            token = header.split(' ')[1];
        }
        
        // Si no está en el header, intentar leer de las cookies
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }
        
        if (!token) {
            return res.status(401).json({ message: 'No autorizado' });
        }
        
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = payload.sub;
        req.userRoles = payload.roles || [];
        next();
        
    } catch (err) {
        return res.status(401).json({ message: 'Token no válido o caducado' });
    }
}
        