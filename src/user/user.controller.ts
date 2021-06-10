import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource, AppRoles } from 'src/app.roles';
import { Auth } from 'src/common/helpers/decorators/auth.decorator';
import { User } from 'src/common/helpers/decorators/user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { EditUserDto } from './dtos/edit-user.dto';
import { UserRegistrationDto } from './dtos/user-registration.dto';
import { User as UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('Users routes')
@Controller('user')
export class UserController {

    constructor(
        private readonly userService: UserService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder,
    ) {}

    @Get()
    async getMany() {
        const data = await this.userService.getMany()
        return { data }
    }

    @Get(':id')
    async getOne(
        @Param('id') id: number
    ) {
        const data = await this.userService.getOne(id)
        return { data }
    }

    @Post('register')
    async publicRegistration(@Body() dto: UserRegistrationDto) {
        const data = await this.userService.createOne({
            ...dto,
            roles: [AppRoles.AUTHOR],
          });
          return { message: 'User registered', data };
    }

    @Auth({
        possession: 'any',
        action: 'create',
        resource: AppResource.USER
    })
    @Post()
    async createOne(
        @Body() dto: CreateUserDto //Almacena el contenido del cuerpo en el dto
    ) {
        const data = await this.userService.createOne(dto)
        return { message: 'User created', data }
    }

    @Auth({
        possession: 'own',
        action: 'update',
        resource: AppResource.USER
    })
    @Put(':id')
    async editOne(
        @Param('id') id: number,
        @Body() dto: EditUserDto,
        @User() user: UserEntity
    ) {
        let data

        if(this.rolesBuilder
            .can(user.roles)
            .updateAny(AppResource.USER)
            .granted
            ) {
                console.log('Admin')
                //ADMIN
                data = await this.userService.editOne(id, dto);
            } else {
                console.log('Author')
                //AUTHOR
                const { roles, ...rest } = dto;
                data = await this.userService.editOne(id, rest, user);
            }

        
        return { message: 'User edited', data }
    }

    @Auth()
    @Delete(':id')
    async deleteOne(
        @Param('id') id: number,
        @User() user: UserEntity
    ) {
        let data
        if (this.rolesBuilder
            .can(user.roles)
            .updateAny(AppResource.USER)
            .granted) {
            // esto es un admin
            data = await this.userService.deleteOne(id);
          } else {
            // esto es un author
            data = await this.userService.deleteOne(id, user);
          }
          return { message: 'User deleted', data };
    }

}
