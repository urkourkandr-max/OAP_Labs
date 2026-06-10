import * as userRepository from "../repositories/user.repository"

const repo: any = (userRepository as any).default || userRepository
import { CreateUserRequestDto } from "../dtos/user.dto"

export const userService = {

    getAll() {
        return repo.findAll()
    },

    getById(id: number) {
        const user = repo.findById(id)

        if (!user) {
            throw { status: 404, message: "User not found" }
        }

        return user
    },

    create(dto: CreateUserRequestDto) {

        if (!dto.name || dto.name.length < 3) {
            throw { status: 400, message: "Name invalid" }
        }

        if (!dto.email || !dto.email.includes("@")) {
            throw { status: 400, message: "Email invalid" }
        }

        const user = {
            id: Date.now(),
            ...dto
        }

        return repo.create(user)
    },

    update(id: number, dto: any) {
        const updated = repo.update(id, dto)

        if (!updated) {
            throw { status: 404, message: "User not found" }
        }

        return updated
    },

    delete(id: number) {
        const ok = repo.delete(id)

        if (!ok) {
            throw { status: 404, message: "User not found" }
        }
    }
}