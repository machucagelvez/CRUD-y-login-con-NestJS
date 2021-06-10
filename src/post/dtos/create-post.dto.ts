import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { EnumToString } from "src/common/helpers/enumToString";
import { PostCategory } from "../enums";


export class CreatePostDto{

    @IsString()
    title: string;

    @IsString()
    slug: string;

    @IsString()
    excerpt: string;

    @IsString()
    content: string;

    //Valida que sea de tipo Enum. El parámetro que se le da es el Enum que se creo (PostCategory):
    @IsNotEmpty()
    @IsEnum(PostCategory, {
        message: `Opción inválida. Las opciones correctas son: ${EnumToString(PostCategory)}`
    }) 
    category: string;

    @IsArray()
    @IsString({each: true}) //Valida que cada elemento sea string
    tags: string[];

    @IsBoolean()
    status: boolean;
}