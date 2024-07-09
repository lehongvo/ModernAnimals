import { Body, Controller, Get, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dtos/create-task.dto';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    async getAllTasks() {
        return this.tasksService.getAllTasks();
    }

    @Post()
    async createNewTask(@Body() task: CreateTaskDto) {
        return this.tasksService.createNewTask(task);
    }
}
