import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async getBookmarks(userId: number) {
    const bookmarks = await this.prisma.bookmark.findMany({
      where: {
        userId
      }
    })

    return { bookmarks };
  }

  async getBookmarkById(bookmarkId: number, userId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId,
      }
    });

    if (!bookmark) throw new NotFoundException('Bookmark not found...');
    if (bookmark.userId !== userId) throw new ForbiddenException('Access to resource denied...');
    return bookmark;
  }

  async createBookmark(userId: number, dto: CreateBookmarkDto) {
    try {
      const bookmark = await this.prisma.bookmark.create({
        data: {
          ...dto,
          user: {
            connect: {
              id: userId
            }
          }
        }
      });

      return bookmark;
    } catch (err) {
      if (err instanceof PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('The user does not exists...', HttpStatus.BAD_REQUEST);
        }
      }
      throw err;
    }
  }

  async editBookmarkById(bookmarkId: number, userId: number, dto: EditBookmarkDto) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId
      }
    });

    if (!bookmark) throw new NotFoundException('bookmark not found...');
    if (bookmark.userId !== userId) throw new ForbiddenException('Access to resource denied...');

    try {
      return this.prisma.bookmark.update({
        where: {
          id: bookmarkId
        },
        data: dto
      });
    } catch (err) {
      throw err;
    }
  }

  async deleteBookmarkById(bookmarkId: number, userId: number) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: {
        id: bookmarkId
      }
    });

    if (!bookmark) throw new NotFoundException('bookmark not found...');
    if (bookmark.userId !== userId) throw new ForbiddenException('Access to resource denied...');

    await this.prisma.bookmark.delete({
      where: {
        id: bookmarkId
      }
    });

    return { message: 'bookmark succesfully deleted' }
  }
}
