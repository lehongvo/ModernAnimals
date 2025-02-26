import { AfterInsert, AfterRemove, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Report } from "../reports/report.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ default: false })
    admin: boolean;

    @OneToMany(() => Report, (report) => report.user)
    reports: Report[];

    @AfterInsert()
    logInsert() {
        console.log('Inserted User with id', this.id);
    }

    @AfterInsert()
    logInsert2() {
        console.log('Inserted User with id', this.id);
    }

    @AfterRemove()
    logRemove() {
        console.log('Removed User with id', this.id);
    }
}
