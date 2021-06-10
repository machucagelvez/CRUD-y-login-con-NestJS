import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { InjectRolesBuilder, RolesBuilder } from 'nest-access-control';
import { AppResource } from 'src/app.roles';
import { Auth } from 'src/common/helpers/decorators/auth.decorator';
import { User } from 'src/common/helpers/decorators/user.decorator';
import { CreatePostDto, EditPostDto } from './dtos';
import { PostService } from './post.service';
import { User as UserEntity } from 'src/user/entities/user.entity'


@ApiTags('Posts') //Esto es para la documentación de la API
@Controller('post')
export class PostController {

    constructor(
        private readonly postService: PostService,
        @InjectRolesBuilder()
        private readonly rolesBuilder: RolesBuilder
        ) {} //PostService es un repositorio

    @Get()
    async getMany() {
        const data = await this.postService.getMany();
        return {
            message: 'Petición correcta',
            data
        }
    }

    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number) { //ParseIntPipe convierte a number el parámetro que se recibe
        return this.postService.getOne(id);
    }

    @Auth({
        resource: AppResource.POST,
        action: 'create',
        possession: 'own',
    })
    @Post()
    async createOne(
        @Body() dto: CreatePostDto,
        @User() author: UserEntity
    ) {
        const data = await this.postService.createOne(dto, author);
        return { message: 'Post created', data };
    }

    @Auth()
    @Put(':id')
    editOne(
        @Param('id') id: number,
        @Body() dto: EditPostDto
    ) {
        return this.postService.editOne(id, dto);
    }

    @Auth()
    @Delete(':id')
    deleteOne(@Param('id') id: number) {
        return this.postService.deleteOne(id)
    }

}
