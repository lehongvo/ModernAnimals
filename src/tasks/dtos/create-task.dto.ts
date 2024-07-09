import { IsString, IsNumber, IsOptional, isEnum, IsEnum, MaxLength } from 'class-validator';
import { TaskStatus } from './task-enum';

export class CreateTaskDto {
    @IsString()
    @MaxLength(500)
    title: string;

    @IsString()
    @MaxLength(500)
    description: string;

    @IsEnum(TaskStatus)
    status: TaskStatus
}
