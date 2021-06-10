import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService
        ) {}
    
    async validateUser(email: string, pass: string): Promise<any> {
        const user = await this.userService.findUser({ email })
        console.log(user)

        if(user && await compare(pass, user.password)) { //Compara lo que recibe en el login con lo que hay en BD
            const {password, ...rest} = user
            return rest
        }

        return null
    }

    login(user: User) {
        const { id } = user //Saca el id del resto de los datos
        const payload = { sub: id } //Sirve para identificar el usuario

        return {
            user,
            accessToken: this.jwtService.sign(payload)
        }
    }
}
