import { ConfigService } from "@nestjs/config";
import { User } from "src/user/entities/user.entity";
import { getRepository } from "typeorm";
import { DEFAULT_USER_EMAIL, DEFAULT_USER_PASSWORD } from "./constants";


export const setDefaultUser = async (config: ConfigService) => {
    const userRepository = getRepository<User>(User) //Usar el repositorio de User
    const defaultUser = await userRepository //Verificar si el usuario ya existe
        .createQueryBuilder()
        .where('email = :email', { email: config.get<string>('DEFAULT_USER_EMAIL')})
        .getOne()

    if(!defaultUser) {
        const adminUser = userRepository.create({ //Crea el usuario con los siguientes datos:
            email: config.get<string>(DEFAULT_USER_EMAIL),
            password: config.get<string>(DEFAULT_USER_PASSWORD),
            roles: ['ADMIN']
        })

        return await userRepository.save(adminUser)
    }
}