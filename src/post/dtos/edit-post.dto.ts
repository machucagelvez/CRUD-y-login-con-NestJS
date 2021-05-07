import { OmitType, PartialType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";


export class EditPostDto extends PartialType(
    //Omite el campo slug de CreatePostDto.
    //Si se van a omitir varios se pone ['campo1'] as const, ['campo2'] as const
    //Si no quiero omitir solo se pone CreatePostDto.
    OmitType(CreatePostDto, ['slug'] as const)
) {}