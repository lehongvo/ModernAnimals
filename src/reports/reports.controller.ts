import { Body, Controller, NotFoundException, Post, Session, UseGuards, Patch, Param, Get } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuardCLT, JwtAuthGuard } from 'src/guards/auth.guard';
import { ReportDto } from './dtos/reportDto.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UsersService } from '../users/users.service';

@Controller('reports')
export class ReportsController {
    constructor(
        private reportsService: ReportsService,
        private usersService: UsersService
    ) { }

    @Post()
    @UseGuards(AuthGuardCLT)
    @UseGuards(JwtAuthGuard)
    @Serialize(ReportDto)
    create(
        @Body() body: CreateReportDto,
        @CurrentUser() user: User
    ) {
        return this.reportsService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AuthGuardCLT)
    @UseGuards(JwtAuthGuard)
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

    @Get('/all')
    @UseGuards(AuthGuardCLT)
    @UseGuards(JwtAuthGuard)

    async getAllReports(@CurrentUser() userAdmin: User) {
        if (!userAdmin.admin) {
            throw new NotFoundException("Not admin permission");
        };
        const reports = await this.reportsService.getAllReports();
        if (reports.length == 0) {
            throw new NotFoundException("No reports found");
        }
        const listUsers = await Promise.all(reports.map(async (report) => {
            const user = await this.usersService.findOne(report.userId);
            return { ...report, email: user.email, admin: user.admin };
        }));
        return listUsers;
    }

    @Get()
    @UseGuards(AuthGuardCLT)
    @UseGuards(JwtAuthGuard)
    async getReportsByUser(@CurrentUser() user: User) {
        const reports = await this.reportsService.getAllReports();
        if (reports.length == 0) {
            throw new NotFoundException("No reports found");
        }
        const listUsers = (await Promise.all(reports.map(async (report) => {
            const userTemp = await this.usersService.findOne(report.userId);
            if (Number(user.id) === userTemp.id) {
                return { ...report, email: userTemp.email, admin: userTemp.admin };
            }
            return null;  // Explicitly return null for non-matching cases
        }))).filter(item => item !== null);  // Filter out null values

        return listUsers;
    }
}