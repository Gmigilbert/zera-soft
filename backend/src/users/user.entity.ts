import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";

export type UserRole = "owner" | "admin" | "manager" | "employee";

/**
 * Lives inside a tenant''s own schema/database â€” never in the control DB.
 */
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  fullName: string;

  @Column({ type: "varchar", default: "employee" })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}
