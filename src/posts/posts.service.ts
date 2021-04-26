import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { Repository } from 'typeorm'
import { CreatePostInput } from './dto/create-post.input'
import { DeletePostResponse } from './dto/delete-response.dto'
import { UpdatePostInput } from './dto/update-post.input'
import { Post } from './entities/post.entity'

@Injectable()
export class PostsService {
	constructor(
		@InjectRepository(Post)
		private readonly postsRepository: Repository<Post>,
		private readonly usersService: UsersService
	) {}

	async create(createPostInput: CreatePostInput) {
		const createdPost = this.postsRepository.create(createPostInput)
		return await this.postsRepository.save(createdPost)
	}

	async getAuthor(authorId: string) {
		return await this.usersService.findById(authorId)
	}

	async findAll() {
		return await this.postsRepository.find()
	}

	async findById(postId: string) {
		try {
			return await this.postsRepository.findOneOrFail(postId)
		} catch (e) {
			/**
			 * @Error here means that client fails to get
			 * correct data from the database/data not found
			 */
			throw new NotFoundException(e.message)
		}
	}

	async update(currentUser: User, updatePostInput: UpdatePostInput) {
		try {
			const relatedPost = await this.postsRepository.findOneOrFail(
				updatePostInput.id
			)

			/**
			 * Check if current post is related to
			 * the current user, if not, throw an exception
			 */
			if (relatedPost.author_id !== currentUser.id)
				throw new NotFoundException()

			/**
			 * update given input from @UpdatePostInput
			 */
			await this.postsRepository.update(
				updatePostInput.id,
				Object.assign({}, updatePostInput)
			)

			/**
			 * @Returns updated Post object
			 */
			return await this.postsRepository.findOneOrFail(updatePostInput.id)
		} catch (e) {
			switch (e.status) {
				case 401:
					throw new UnauthorizedException(e.message)
					break

				case 404:
					throw new NotFoundException(e.message)

				default:
					throw new BadRequestException(e.message)
					break
			}
		}
	}

	async remove(currentUser: User, postId: string) {
		try {
			const relatedPost = await this.postsRepository.findOneOrFail(postId)

			/**
			 * Check if current post is related to
			 * the current user, if not, throw an exception
			 */
			if (relatedPost.author_id !== currentUser.id)
				throw new NotFoundException()

			await this.postsRepository.delete(postId)

			/**
			 * Return formatted delete result
			 * Which is highly customizeable response
			 * @see delete-response.dto.ts
			 */
			return new DeletePostResponse(relatedPost, 'DELETED', 200)
		} catch (e) {
			switch (e.status) {
				case 401:
					throw new UnauthorizedException(e.message)
					break

				case 404:
					throw new NotFoundException(e.message)

				default:
					throw new BadRequestException(e.message)
					break
			}
		}
	}
}