import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from 'src/users/user.entity';
import { Report } from './report.entity';
import * as crypto from 'crypto';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private repo: Repository<Report>) { }

    private generateReportHash(reportData: CreateReportDto): string {
        const dataString = JSON.stringify(reportData);
        return crypto.createHash('sha256').update(dataString).digest('hex');
    }

    async create(reportDto: CreateReportDto, user: User) {
        const report = this.repo.create(reportDto);
        const listHash = await this.getAllHashes();
        const data = this.generateReportHash(reportDto);

        if (listHash.includes(data)) {
            throw new NotFoundException('Report data already exists');
        }

        report.user = user;
        report.hash = data;

        return this.repo.save(report);
    }

    async changeApproval(id: number, approved: boolean) {
        const report = await this.repo.findOne(id);
        if (!report) {
            throw new NotFoundException('Report not found');
        }
        report.approved = approved;
        return this.repo.save(report);
    }

    private async getAllHashes(): Promise<string[]> {
        const reports = await this.repo.find({ select: ['hash'] });
        return reports.map(report => report.hash);
    }
}
