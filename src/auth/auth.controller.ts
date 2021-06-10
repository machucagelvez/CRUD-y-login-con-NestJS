import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/common/helpers/decorators/auth.decorator';
import { User } from 'src/common/helpers/decorators/user.decorator';
import { User as UserEntity} from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@ApiTags('Auth routes')
@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(
        @Body() loginDto: LoginDto,
        @User() user: UserEntity
    ) {
        const data = this.authService.login(user)
        return {
            message: 'Login exitoso',
            data
        }
    }

    @Auth()
    @Get('profile')
    profile(
        @User() user: UserEntity
    ) {
        return {
            message: 'Petición correcta',
            user
        }
    }

    //Esto sirve para refrescar el token. No está implementado en este proyecto
    @Auth()
    @Get('refresh')
    refreshToken(@User() user: UserEntity) {
        const data = this.authService.login(user);
        return {
        message: 'Refresh exitoso',
        data,
        };
    }
}
