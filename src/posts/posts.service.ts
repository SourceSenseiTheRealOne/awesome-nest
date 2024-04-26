import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class PostsService {
  constructor(private prisma: PrismaService) {}
  createPost(userId: number, data: Prisma.PostCreateWithoutUserInput) {
    return this.prisma.post.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  createGroupPost(
    userIds: number[],
    data: Prisma.GroupPostCreateWithoutUsersInput,
  ) {
    return this.prisma.groupPost.create({
      data: {
        ...data,
        users: {
          create: userIds.map((userId) => ({ userId })),
        },
      },
    });
  }

  getGroupPosts() {
    return this.prisma.groupPost.findMany({
      include: {
        users: {
          select: {
            user: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
