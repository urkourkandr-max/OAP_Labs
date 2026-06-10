import * as userRepository from "../repositories/user.repository";
import { CreateUserRequestDto } from "../dtos/user.dto";

export const userService = {

    async getAll() {
        return userRepository.getAllUsers();
    },

    async getById(id: number) {
        const user = await userRepository.getUserById(id);

        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        return user;
    },

    async create(dto: CreateUserRequestDto) {

        if (!dto.name || dto.name.length < 3) {
            throw { status: 400, message: "Name invalid" };
        }

        if (!dto.email || !dto.email.includes("@")) {
            throw { status: 400, message: "Email invalid" };
        }

        return userRepository.createUser({
            name: dto.name,
            email: dto.email,
            password: "password123"
        });
    },

    async update(id: number, dto: any) {
        const updated = await userRepository.updateUser(id, {
            name: dto.name,
            email: dto.email,
            password: "password123"
        });

        if (!updated) {
            throw { status: 404, message: "User not found" };
        }

        return updated;
    },

    async delete(id: number) {
        const ok = await userRepository.deleteUser(id);

        if (!ok) {
            throw { status: 404, message: "User not found" };
        }
    }
};