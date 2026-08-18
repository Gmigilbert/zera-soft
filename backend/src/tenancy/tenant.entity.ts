import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

export type IsolationMode = "shared_schema" | "dedicated_db";

/**
 * Control-plane record. Lives in the public/control database, NOT in any
 * tenant schema. This is the only table every tenant''s existence is
 * looked up against.
 */
@Entity("tenants")
export class Tenant {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  slug: string; // used as subdomain / X-Tenant-Id in dev

  @Column()
  name: string;

  @Column({ type: "varchar", default: "shared_schema" })
  isolationMode: IsolationMode;

  // For shared_schema tenants: the Postgres schema name (e.g. "tenant_acme").
  @Column({ nullable: true })
  schemaName: string;

  // For dedicated_db tenants: full connection info. In production, store
  // credentials in a secrets manager and keep only a reference here.
  @Column({ nullable: true })
  dbHost: string;

  @Column({ nullable: true })
  dbName: string;

  @Column({ nullable: true })
  dbUser: string;

  @Column({ nullable: true })
  dbPasswordSecretRef: string;

  @CreateDateColumn()
  createdAt: Date;
}
