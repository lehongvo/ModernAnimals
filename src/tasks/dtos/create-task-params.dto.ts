import { IsString } from "class-validator";

export class CreateTaskParamsDto {
    @IsString()
    title: string

    @IsString()
    description: string
}