import {
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
} from "typeorm";
import { randomUUID } from "crypto";

/**
 * Shared by every business entity. id is a client-generatable UUID (not
 * DB auto-increment) so offline-created records already have a permanent
 * id before they ever reach the server. updatedAt/deletedAt are what the
 * future sync engine (PowerSync) uses to know what changed and what to
 * soft-delete.
 */
export abstract class SyncableEntity {
  @PrimaryColumn("uuid")
  id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @BeforeInsert()
  assignId() {
    if (!this.id) this.id = randomUUID();
  }
}