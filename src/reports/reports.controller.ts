import { Body, Controller, NotFoundException, Post, Session, UseGuards, Patch, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuard } from 'src/guards/auth.guard';
import { ReportDto } from './dtos/reportDto.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';

@Controller('reports')
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    create(
        @Body() body: CreateReportDto,
        @CurrentUser() user: User
    ) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AuthGuard)
    changeApproval(
        @Param('id') id: string,
        @Body() body: { approved: boolean },
        @CurrentUser() user: User
    ) {
        if (!user.admin) {
            throw new NotFoundException("Not admin permission");
        };

        return this.reportsService.changeApproval(parseInt(id), body.approved);
    }
}