import { Entity, Column } from "typeorm";
import { SyncableEntity } from "../common/syncable.entity";

@Entity("invoices")
export class Invoice extends SyncableEntity {
  @Column({ type: "uuid", nullable: true })
  customerId: string | null;

  @Column({ nullable: true })
  customerName: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  amount: number;

  @Column({ type: "varchar", default: "draft" })
  status: "draft" | "sent" | "paid" | "overdue" | "void";

  @Column({ type: "date", nullable: true })
  dueDate: string;

  @Column({ nullable: true })
  notes: string;
}