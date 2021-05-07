import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Post]) //Post es la entity que se creó
    ],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule {}
