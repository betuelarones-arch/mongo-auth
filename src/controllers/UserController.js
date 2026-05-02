import userService from '../services/UserService.js';

class UserController {

    async getAll(req, res, next) {
        try {
            const users = await userService.getAll();
            res.status(200).json(users);
        } catch (err) {
            next(err);
        }
    }

    async getMe(req, res, next) {
        try {
            const user = await userService.getById(req.userId);
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }

    async updateMe(req, res, next) {
        try {
            const { name, lastName, phoneNumber, birthdate, url_profile, address } = req.body;
            const user = await userService.updateUser(req.userId, { 
                name, 
                lastName, 
                phoneNumber, 
                birthdate: birthdate ? new Date(birthdate) : undefined,
                url_profile, 
                address 
            });
            res.status(200).json(user);
        } catch (err) {
            next(err);
        }
    }
}

export default new UserController();