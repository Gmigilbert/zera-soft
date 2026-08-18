import { Entity, Column } from "typeorm";
import { SyncableEntity } from "../common/syncable.entity";

@Entity("pay_runs")
export class PayRun extends SyncableEntity {
  @Column({ type: "date" })
  periodStart: string;

  @Column({ type: "date" })
  periodEnd: string;

  @Column({ type: "varchar", default: "draft" })
  status: "draft" | "processed" | "paid";

  @Column({ type: "decimal", precision: 14, scale: 2, default: 0 })
  totalNetPay: number;
}