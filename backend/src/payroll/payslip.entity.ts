import { Entity, Column } from "typeorm";
import { SyncableEntity } from "../common/syncable.entity";

@Entity("payslips")
export class Payslip extends SyncableEntity {
  @Column({ type: "uuid" })
  payRunId: string;

  @Column({ type: "uuid" })
  employeeId: string;

  @Column()
  employeeName: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  grossPay: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  deductions: number;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  netPay: number;
}