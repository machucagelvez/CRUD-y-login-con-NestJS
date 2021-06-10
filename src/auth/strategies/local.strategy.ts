import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../auth.service";



@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        private readonly authService: AuthService
    ) {
        super({
            usernameField: 'email', //Por defecto el nombre es username
            passwordField: 'password' //Por defecto el nombre es password
        })
    }

    //Verifica que los datos que escribió el usuario coincidan con un usuario en BD
    async validate(email: string, password: string) {
        console.log(email, password)
        const user = await this.authService.validateUser(email, password)
        if(!user) throw new UnauthorizedException('Login user or password does not match')
        return user
    }

}