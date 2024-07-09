import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dtos/create-task.dto';
import { Tasks } from './task.entity';

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Tasks) private tasks: Repository<Tasks>) { }

    async getAllTasks() {
        let tasks = this.tasks.find();
        if (!tasks) {
            throw new NotFoundException('Tasks not found');
        }
        return this.tasks.find();
    }

    async createNewTask(createDto: CreateTaskDto) {
        const task = this.tasks.create(createDto);
        return this.tasks.save(task);
    }
}
