import { ObjectType, Field } from '@nestjs/graphql'
import { Attachments } from 'src/posts/entities/attachments.entity'
import { User } from 'src/users/entities/user.entity'
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@ObjectType()
@Entity()
export class Post {
	@Field()
	@PrimaryGeneratedColumn('uuid')
	id: string

	@Field()
	@Column('text')
	caption: string

	@Field({ nullable: true })
	@CreateDateColumn()
	created_at: Date

	@Field({ nullable: true })
	@UpdateDateColumn()
	updated_at: Date

	@Field((type) => User)
	@ManyToOne((type) => User, (author: User) => author.contents)
	author: User

	@Field((type) => Attachments, { nullable: true })
	@OneToOne(() => Attachments)
	@JoinColumn()
	attachments: Attachments
}
