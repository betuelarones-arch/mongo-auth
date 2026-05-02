import express from 'express';
import jwt from 'jsonwebtoken';
import authService from '../services/AuthService.js';
import userService from '../services/UserService.js';

const router = express.Router();

// Middleware para verificar token en web (desde cookie)
const checkWebAuth = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) {
        return res.redirect('/signIn');
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.sub;
        req.userRoles = decoded.roles || [];
        next();
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/signIn');
    }
};

// Página SignIn
router.get('/signIn', (req, res) => {
    if (req.cookies?.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            if (decoded.roles?.includes('admin')) return res.redirect('/admin');
            return res.redirect('/dashboard');
        } catch (e) {
            res.clearCookie('token');
        }
    }
    res.render('signIn', { error: req.query.error || null, success: req.query.success || null });
});

// Procesar SignIn
router.post('/signIn', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.render('signIn', { error: 'Email y password son requeridos' });
        }
        const result = await authService.signIn({ email, password });
        res.cookie('token', result.token, { 
            httpOnly: true, 
            maxAge: 3600000,
            sameSite: 'lax'
        });
        try {
            const decoded = jwt.verify(result.token, process.env.JWT_SECRET);
            if (decoded.roles?.includes('admin')) return res.redirect('/admin');
            return res.redirect('/dashboard');
        } catch (e) {
            return res.redirect('/dashboard');
        }
    } catch (err) {
        return res.render('signIn', { error: err.message || 'Credenciales inválidas' });
    }
});

// Página SignUp
router.get('/signUp', (req, res) => {
    if (req.cookies?.token) {
        try {
            const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
            if (decoded.roles?.includes('admin')) return res.redirect('/admin');
            return res.redirect('/dashboard');
        } catch (e) {
            res.clearCookie('token');
        }
    }
    res.render('signUp', { error: req.query.error || null });
});

// Procesar SignUp
router.post('/signUp', async (req, res) => {
    try {
        const { name, lastName, email, password, phoneNumber, birthdate, address, url_profile } = req.body;
        if (!email || !password) {
            return res.render('signUp', { error: 'Email y password son requeridos' });
        }
        await authService.signUp({ name, lastName, email, password, phoneNumber, birthdate, address, url_profile });
        return res.redirect('/signIn?success=1');
    } catch (err) {
        return res.render('signUp', { error: err.message || 'Error en el registro' });
    }
});

// Dashboard de usuario
router.get('/dashboard', checkWebAuth, async (req, res) => {
    if (req.userRoles.includes('admin')) {
        return res.redirect('/admin');
    }
    try {
        const user = await userService.getById(req.userId);
        res.render('dashboard', { user });
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/signIn');
    }
});

// Dashboard de administrador
router.get('/admin', checkWebAuth, async (req, res) => {
    if (!req.userRoles.includes('admin')) {
        return res.redirect('/403');
    }
    try {
        const users = await userService.getAll();
        res.render('admin', { users });
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/signIn');
    }
});

// Perfil de usuario
router.get('/profile', checkWebAuth, async (req, res) => {
    try {
        const user = await userService.getById(req.userId);
        res.render('profile', { user });
    } catch (err) {
        res.clearCookie('token');
        return res.redirect('/signIn');
    }
});

// Ver detalles de usuario (admin)
router.get('/admin/users/:id', checkWebAuth, async (req, res) => {
    if (!req.userRoles.includes('admin')) {
        return res.redirect('/403');
    }
    try {
        const user = await userService.getById(req.params.id);
        res.render('user-detail', { user });
    } catch (err) {
        return res.redirect('/admin');
    }
});

// Procesar actualización de perfil
router.post('/profile', checkWebAuth, async (req, res) => {
    try {
        const { name, lastName, phoneNumber, birthdate, address, url_profile } = req.body;
        await userService.updateUser(req.userId, { 
            name, 
            lastName, 
            phoneNumber, 
            birthdate: birthdate ? new Date(birthdate) : undefined,
            address, 
            url_profile 
        });
        return res.redirect('/profile');
    } catch (err) {
        return res.redirect('/profile?error=1');
    }
});

// Logout
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/signIn');
});

// Página 403
router.get('/403', (req, res) => {
    res.status(403).render('403');
});

// Página 404
router.get('/404', (req, res) => {
    res.status(404).render('404');
});

// Ruta catch-all para 404
router.get('*', (req, res) => {
    res.status(404).render('404');
});

export default router;