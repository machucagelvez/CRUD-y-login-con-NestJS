import { hash } from "bcryptjs";
import { Post } from "src/post/entities/post.entity";
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255})
    name: string;

    @Column({ name: 'last_name', type: 'varchar', length: 255}) //name: 'last_name' es como se guarda en la BD
    lastName: string;

    @Column({ type: 'varchar', length: 255, nullable: false})
    email:string;

    @Column({ type: 'varchar', length: 128, nullable: false, select: false}) //select: false oculta este campo cuando se hace un select *
    password: string;

    @Column({ type: 'simple-array'})
    roles: string[];

    @Column({ type: 'bool', default: true })
    status: boolean;
  
    @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
    createdAt: Date;
  
    /* @UpdateDateColumn({ name: 'updated_at', type: 'timestamp'})
    updatedAt: Date;  */   
  
    @BeforeInsert() //Verifica antes de insertar
    @BeforeUpdate() ////Verifica antes de actualizar
    //Método para encriptar el password:
    async hashPassword() {
      if (!this.password) {
        return;
      }
      this.password = await hash(this.password, 10); //
    }

    @OneToOne(
      _ => Post,
      post => post.author,
      { cascade: true },
    )
    posts: Post;
}

