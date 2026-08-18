import { Entity, Column } from "typeorm";
import { SyncableEntity } from "../common/syncable.entity";

@Entity("customers")
export class Customer extends SyncableEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  company: string;

  @Column({ nullable: true })
  address: string;

  @Column({ type: "varchar", default: "lead" })
  stage: "lead" | "prospect" | "active" | "inactive";
}