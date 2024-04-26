import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  createUser(data: Prisma.UserCreateInput) {
    // this.prisma.user.create();
    return this.prisma.user.create({
      data: {
        ...data,
        userSetting: {
          create: {
            smsEnabled: true,
            notificationOn: true,
          },
        },
      },
    });
  }

  getUsers() {
    return this.prisma.user.findMany({
      include: {
        userSetting: true,
      },
    });
  }

  getUsersById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        userSetting: {
          select: {
            smsEnabled: true,
            notificationOn: true,
          },
        },
        posts: true,
      },
    });
  }

  async deleteUserById(id: number) {
    const findUser = await this.getUsersById(id);
    if (!findUser) throw new HttpException('User not found', 404);
    return this.prisma.user.delete({ where: { id } });
  }

  async updateUsersById(id: number, data: Prisma.UserUpdateInput) {
    const findUser = await this.getUsersById(id);
    if (!findUser) throw new HttpException('User not found', 404);

    if (data.username) {
      const findUser = await this.prisma.user.findUnique({
        where: { username: data.username as string },
      });

      if (findUser) throw new HttpException('User already exists', 400);
    }

    return this.prisma.user.update({ where: { id }, data });
  }

  async updateUserSettings(
    userId: number,
    data: Prisma.UserSettingUpdateInput,
  ) {
    const findUser = await this.getUsersById(userId);
    if (!findUser) throw new HttpException('User not found', 404);
    if (!findUser.userSetting) throw new HttpException('Bad Request', 404);
    return this.prisma.userSetting.update({
      where: { userId },
      data,
    });
  }
}
