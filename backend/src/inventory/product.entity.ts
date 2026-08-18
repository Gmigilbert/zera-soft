import { Entity, Column } from "typeorm";
import { SyncableEntity } from "../common/syncable.entity";

@Entity("products")
export class Product extends SyncableEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ type: "decimal", precision: 12, scale: 2, default: 0 })
  price: number;

  @Column({ type: "int", default: 0 })
  stockQuantity: number;

  @Column({ nullable: true })
  location: string;
}