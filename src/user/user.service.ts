import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

interface DtoWithHash extends Omit<EditUserDto, 'password'> {
  hash: string,
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async editUser(userId: number, dto: EditUserDto) {
    let dtoWithHash: DtoWithHash;
    if (dto.password) {
      const hash = await argon.hash(dto.password);
      const { password, ...rest } = dto;
      dtoWithHash = {
        ...rest,
        hash
      }
    }
    try {
      const user = await this.prisma.user.update({
        where: {
          id: userId
        },
        data: dto.password ? dtoWithHash : dto
      })

      delete user.hash;

      return user;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException('Credentials taken', HttpStatus.FORBIDDEN);
        }
      } else {
        throw err;
      }
    }
  }
}
