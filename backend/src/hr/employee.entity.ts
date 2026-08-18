import { Entity, Column } from "typeorm";
import { SyncableEntity } from "../common/syncable.entity";

@Entity("employees")
export class Employee extends SyncableEntity {
  @Column()
  fullName: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  jobTitle: string;

  @Column({ nullable: true })
  department: string;

  @Column({ type: "date", nullable: true })
  hireDate: string;

  @Column({ type: "varchar", default: "active" })
  status: "active" | "on_leave" | "terminated";

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  baseSalary: number;
}