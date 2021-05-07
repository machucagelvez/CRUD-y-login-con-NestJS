import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DATABASE_HOST, DATABASE_NAME, DATABASE_PASSWORD, DATABASE_PORT, DATABASE_USERNAME } from './config/constants';
import { PostModule } from './post/post.module';
import { UserModule } from './user/user.module';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'mysql',
                host: config.get<string>(DATABASE_HOST),
                port: parseInt(config.get<string>(DATABASE_PORT), 10),
                username: config.get<string>(DATABASE_USERNAME),
                password: config.get<string>(DATABASE_PASSWORD),
                database: config.get<string>(DATABASE_NAME),
                entities: [__dirname + './**/**/*entity{.ts,.js}'],
                autoLoadEntities: true,
                synchronize: true,
                logging: true,
                logger: 'file'
            })
        }),
        PostModule,
        ConfigModule.forRoot({
            isGlobal: true, //Sirve para que sea global y no se tenga que usar el .forFeature
            envFilePath: '.env' //Indica donde va a estar el archivos con las var de entorno, en este caso en la raíz
        }),
        UserModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
