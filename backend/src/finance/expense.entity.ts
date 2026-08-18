import { Entity, Column } from "typeorm";
import { SyncableEntity } from "../common/syncable.entity";

@Entity("expenses")
export class Expense extends SyncableEntity {
  @Column()
  description: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  amount: number;

  @Column({ nullable: true })
  category: string;

  @Column({ nullable: true })
  vendor: string;

  @Column({ type: "date", nullable: true })
  expenseDate: string;
}