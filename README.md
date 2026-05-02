# Express Mongo Auth 🔐

Sistema completo de autenticación y autorización con **Express.js**, **MongoDB** y **EJS** como motor de plantillas. Incluye un panel de administración, gestión de usuarios y una interfaz moderna con **Materialize CSS**.

## ✨ Características

### 🔑 Autenticación y Autorización
- Registro de usuarios con validación de contraseña robusta
- Inicio de sesión con JWT (JSON Web Tokens)
- Protección de rutas API y Web
- Sistema de roles (user, admin)
- Encriptación de contraseñas con bcrypt

### 🎨 Interfaz Moderna
- Diseño **Dark Blue/Slate** elegante y profesional
- **Materialize CSS** para componentes UI
- **Glassmorphism** y gradientes modernos
- Totalmente responsive (móvil, tablet, desktop)
- Animaciones suaves y transiciones

### 👤 Gestión de Usuarios
- **Dashboard de Usuario**: Vista personal con datos y acciones rápidas
- **Dashboard de Admin**: Gestión completa de usuarios
- **Perfil de Usuario**: Ver y editar información personal
- **Detalles de Usuario**: Vista completa para administradores
- Listado de usuarios con tabla interactiva

### 🛡️ Tecnologías
- **Backend**: Express.js, Node.js
- **Base de Datos**: MongoDB con Mongoose
- **Frontend**: EJS (Embedded JavaScript templates)
- **Estilos**: Materialize CSS, CSS3 moderno
- **Autenticación**: JWT, bcrypt
- **Motor de Plantillas**: EJS con renderizado server-side

---

## 📋 Requisitos Previos

- **Node.js** (v18 o superior)
- **MongoDB** (local o Atlas)
- **npm** (incluido con Node.js)

---

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd express-mongo-auth
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz del proyecto:
   ```env
   MONGODB_URI=mongodb://localhost:27017/express-auth
   JWT_SECRET=tu_clave_secreta_super_segura
   JWT_EXPIRES_IN=1h
   BCRYPT_SALT_ROUNDS=10
   PORT=3000
   ADMIN_EMAIL=admin@system.com
   ADMIN_PASSWORD=Admin#1234
   ```
   
   > **Nota**: Si usas MongoDB Atlas, reemplaza `MONGODB_URI` con tu string de conexión.

4. **Iniciar el servidor**
   ```bash
   npm run dev
   ```
   
   El servidor se iniciará en `http://localhost:3000`

---

## 📖 Uso

### 🔑 Páginas Principales

| Página | URL | Descripción |
|--------|-----|-------------|
| **Iniciar Sesión** | `/signIn` | Formulario de login |
| **Registrarse** | `/signUp` | Formulario de registro |
| **Dashboard Usuario** | `/dashboard` | Panel personal (rol: user) |
| **Dashboard Admin** | `/admin` | Gestión de usuarios (rol: admin) |
| **Mi Cuenta** | `/profile` | Ver y editar perfil |
| **Detalles Usuario** | `/admin/users/:id` | Vista completa de usuario |

### 👤 Usuario Administrador (Creado Automáticamente)
- **Email**: `admin@system.com`
- **Contraseña**: `Admin#1234`

### 🔒 Validaciones de Contraseña
La contraseña debe contener:
- Mínimo **8 caracteres**
- Al menos **1 mayúscula**
- Al menos **1 dígito**
- Al menos **1 carácter especial** (`# $ % & * @`)

### 🛡️ API Endpoints

#### Autenticación
- `POST /api/auth/signUp` - Registrar nuevo usuario
- `POST /api/auth/signIn` - Iniciar sesión

#### Usuarios (Requiere JWT)
- `GET /api/users` - Listar todos los usuarios (solo admin)
- `GET /api/users/me` - Obtener perfil propio
- `PUT /api/users/me` - Actualizar perfil propio

---

## 📁 Estructura del Proyecto

```
express-mongo-auth/
├── src/
│   ├── controllers/          # Controladores
│   │   ├── AuthController.js
│   │   └── UserController.js
│   ├── middlewares/         # Middlewares
│   │   ├── authenticate.js   # Verificar JWT
│   │   └── authorize.js     # Verificar roles
│   ├── models/              # Modelos Mongoose
│   │   ├── Role.js
│   │   └── User.js
│   ├── repositories/        # Capa de acceso a datos
│   │   ├── RoleRepository.js
│   │   └── UserRepository.js
│   ├── routes/              # Rutas
│   │   ├── auth.routes.js
│   │   ├── users.routes.js
│   │   └── web.routes.js      # Rutas de la web
│   ├── services/            # Lógica de negocio
│   │   ├── AuthService.js
│   │   └── UserService.js
│   ├── utils/               # Utilidades
│   │   ├── seedRoles.js
│   │   └── seedUsers.js
│   ├── views/               # Plantillas EJS
│   │   ├── partials/
│   │   │   └── layout.ejs
│   │   ├── 403.ejs
│   │   ├── 404.ejs
│   │   ├── signIn.ejs
│   │   ├── signUp.ejs
│   │   ├── dashboard.ejs
│   │   ├── admin.ejs
│   │   ├── profile.ejs
│   │   └── user-detail.ejs
│   ├── public/              # Archivos estáticos
│   │   ├── css/
│   │   │   └── style.css
│   │   └── js/
│   │       └── app.js
│   └── server.js           # Punto de entrada
├── .env                      # Variables de entorno (no versionar)
├── .gitignore
├── package.json
└── README.md
```

---

## 🔧 Scripts Disponibles

```bash
npm start        # Iniciar en modo producción
npm run dev      # Iniciar con nodemon (desarrollo)
```

---

## 🔡️ Modelo de Usuario

El modelo `User` incluye los siguientes campos:

| Campo | Tipo | Validaciones |
|-------|------|-------------|
| `email` | String | Requerido, único, lowercase |
| `password` | String | Requerido, min 8 chars, 1 mayúscula, 1 dígito, 1 especial |
| `name` | String | Opcional |
| `lastName` | String | Requerido |
| `phoneNumber` | String | Requerido |
| `birthdate` | Date | Requerido |
| `url_profile` | String | Opcional (URL) |
| `address` | String | Opcional |
| `roles` | [ObjectId] | Referencia a Role |

---

## 🔐 Sistema de Roles

- **user**: Acceso a su propio perfil y dashboard de usuario
- **admin**: Acceso completo al panel de administración y gestión de usuarios

---

## 🎨 Características de la Interfaz

### Diseño Moderno
- **Paleta de colores**: Dark Blue/Slate (#0f172a, #1e293b, #334155)
- **Gradientes**: Azul (#3b82f6, #1d4ed) para botones y acentos
- **Glassmorphism**: Efecto de vidrio en tarjetas y navbar
- **Tipografía**: Inter (Google Fonts)
- **Iconos**: Material Icons

### Componentes UI
- ✅ Formularios con validación visual
- ✅ Tarjetas (cards) con efectos hover
- ✅ Tablas responsivas con estadísticas
- ✅ Botones con gradientes y sombras
- ✅ Mensajes de error/éxito elegantes
- ✅ Avatar de usuario con inicial
- ✅ Badges de roles coloridos

---

## 🚧 Desarrollo

### Agregar un Nuevo Rol
```javascript
// En src/utils/seedRoles.js
await roleRepository.create({ name: 'moderator' });
```

### Proteger una Ruta Web
```javascript
// En src/routes/web.routes.js
router.get('/ruta-protegida', checkWebAuth, (req, res) => {
    if (!req.userRoles.includes('admin')) {
        return res.redirect('/403');
    }
    res.render('vista');
});
```

### Proteger una Ruta API
```javascript
// En src/routes/users.routes.js
router.get('/', authenticate, authorize(['admin']), UserController.getAll);
```

---

## 📝 Licencia

ISC

---

## 👤 Autor

**earevalo**

---

## 🙏 Agradecimientos

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Materialize CSS](https://materializecss.com/)
- [EJS](https://ejs.co/)

---

**¡Disfruta de tu sistema de autenticación moderno! 🚀**
