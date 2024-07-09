import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class ReportDto {
    @Expose()
    id: number;

    @Expose()
    price: number;

    @Expose()
    year: number;

    @Expose()
    lng: number;

    @Expose()
    lat: number;

    @Expose()
    make: string;

    @Expose()
    model: string;

    @Expose()
    mileage: number;

    @Expose()
    approved: boolean;

    @Expose()
    @IsOptional()
    hash: string

    @Transform(({ obj }) => obj.user.id)
    @Expose()
    userId: number

    @Transform(({ obj }) => obj.user.email)
    @Expose()
    email: number

    @Transform(({ obj }) => obj.user.admin)
    @Expose()
    isAdmin: boolean
}