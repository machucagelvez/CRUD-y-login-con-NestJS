import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreatePostDto, EditPostDto } from './dtos';
import { Post } from './entities/post.entity';

@Injectable()
export class PostService {

    constructor(
        @InjectRepository(Post)
        private readonly postRepository: Repository<Post>
    ) {}

    async getMany(): Promise<Post[]> { //Promise<Post[]> no es necesario
        return await this.postRepository.find();
    }

    async getOne(id: number, author?: User) {
        const post = await this.postRepository
      .findOne(id)
      .then(p => (!author ? p : !!p && author.id === p.author.id ? p : null));
    if (!post)
      throw new NotFoundException('Post does not exist or unauthorized');
    return post;
    }

    async createOne(dto: CreatePostDto, author: User) {
        const post = this.postRepository.create({ ...dto, author }); //Crea un objeto badado en el dto
        return await this.postRepository.save(post); //Guarda en la BD el objeto creado
    }

    async editOne(id: number, dto: EditPostDto) {
        const post = await this.postRepository.findOne(id);

        if(!post) throw new NotFoundException('El post no existe')
        const editedPost = Object.assign(post, dto); //Lo que viene del dto se guarda en el post
        return this.postRepository.save(editedPost); //Se guarda el objeto editado
    }

    async deleteOne(id: number) {
        return await this.postRepository.delete(id);
    }
}
