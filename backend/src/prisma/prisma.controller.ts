import {
  Controller,
  Post,
  Get,
  Body,
  UseInterceptors,
  Req,
  UploadedFile,
  UseGuards,
  Request,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Avatars } from '@prisma/client';
import { promises as fsPromises } from 'fs';
import { JwtAuthGuard } from 'src/auth/auth.guard';

export class AvatarCreationFailedException extends HttpException {
  constructor() {
    super(
      'Failed to create a new avatar entry',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

export class ForbiddenFileExtensionException extends HttpException {
  constructor() {
    super(
      'Forbidden Fileextension. Use png or jpg',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

@UseGuards(JwtAuthGuard)
@Controller('data')
export class PrismaController {
  constructor(
    private readonly prismaService: PrismaService,
    readonly authService: AuthService,
  ) {}

  @Post('editname')
  async updateNickname(
    @Req() req: Request,
    @Body() body: { newNickname: string },
  ): Promise<{ nickName: string | null; errorCode: string }> {
    try {
      const error = this.authService.validateUsername(body.newNickname);
      if (error != null) {
        return { nickName: null, errorCode: error };
      }
      const newUser: string = await this.prismaService.updateNickname(
        req['user'],
        body.newNickname,
      );
      if (newUser) {
        return { nickName: newUser, errorCode: '0' };
      }
      return { nickName: null, errorCode: '1' };
    } catch (error) {
      return { nickName: null, errorCode: '1' };
    }
  }

  @Post('userstats')
  async getHistoryMatches(@Req() req: Request): Promise<{
    userHistory: any[] | null;
    userProfil: any | null;
    userMilestones: any | null;
  }> {
    try {
      const userHistory = await this.prismaService.getHistoryMatchesById(
        req['user'],
      );
      const userProfil = await this.prismaService.getUserById(req['user']);
      const userMilestones = await this.prismaService.getUserMilestonesById(
        req['user'],
      );
      return { userHistory, userProfil, userMilestones };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      return { userHistory: null, userProfil: null, userMilestones: null };
    }
  }

  @Post('allstats')
  async getUserStatistics(): Promise<any | null> {
    return await this.prismaService.getUserStatistics();
  }

  @Post('milestones')
  async getMilestones(): Promise<any | null> {
    return await this.prismaService.getMilestones();
  }

  @Post('friends')
  async getFriendsById(
    @Req() req: Request,
  ): Promise<{ friends: any[] | null }> {
    try {
      const friends = await this.prismaService.getFriendsById(req['user']);
      friends.forEach((element) => {
        if (this.authService.activeUser.has(element.id)) {
          element.status = 1;
        }
      });
      return { friends };
    } catch (error) {
      console.error('Error fetching friends:', error);
      return { friends: null };
    }
  }

  @Post('nofriends')
  async getNONFriendsById(
    @Req() req: Request,
  ): Promise<{ friends: any[] | null }> {
    try {
      const friends = await this.prismaService.getNonFriendsById(req['user']);
      friends.forEach((element) => {
        if (this.authService.activeUser.has(element.id)) {
          element.status = 1;
        }
      });
      return { friends };
    } catch (error) {
      console.error('Error fetching nonfriends:', error);
      return { friends: null };
    }
  }

  @Post('addfriends')
  async addFriendsByIds(
    @Req() req: Request,
    @Body() body: { friendIds: number[] },
  ): Promise<void> {
    try {
      for (const friendId of body.friendIds) {
        await this.prismaService.addFriendByIds(req['user'], friendId);
      }
    } catch (error) {
      console.error('Error adding friends:', error);
    }
  }

  @Post('removefriend')
  async deleteFriendByIds(
    @Req() req: Request,
    @Body() body: { friendId: number },
  ): Promise<{ friends: any[] | null }> {
    try {
      const response = await this.prismaService.deleteFriendByIds(
        req['user'],
        body.friendId,
      );
      if (response) {
        const friends = await this.prismaService.getFriendsById(req['user']);
        if (friends) {
          friends.forEach((element) => {
            if (this.authService.activeUser.has(element.id)) {
              element.status = 1;
            }
          });
          return { friends };
        }
      }
      return { friends: null };
    } catch (error) {
      console.error('Error deleting friend:', error);
      return { friends: null };
    }
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './avatars',
        filename: (req, file, callback) => {
          const filename = `${Date.now()}${extname(file.originalname)}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const originalFilename = 'avatars/' + file.filename;
      if (
        extname(file.originalname) == '.png' ||
        extname(file.originalname) == '.jpg'
      ) {
        // Create a new avatar entry in the database
        const avatar: Avatars = await this.prismaService.createNewAvatarById(
          req['user'],
          extname(file.originalname),
        );

        if (!avatar) {
          throw new AvatarCreationFailedException();
        }

        // Get the original filename of the uploaded file
        const newFilename = `avatars/${avatar.id.toString()}${extname(
          file.originalname,
        )}`;

        // Rename the file with the new filename
        await fsPromises.rename(originalFilename, newFilename);

        // Return the appropriate response
        return {
          id: avatar.id,
          mime_type: avatar.mime_type,
        };
      } else {
        await fsPromises.unlink(originalFilename);
        throw new ForbiddenFileExtensionException();
      }
    } catch (error) {
      // Handle errors
      console.error('Error uploading file:', error);
      throw new AvatarCreationFailedException();
    }
  }

  @Post('setlanguage')
  async setLanguage(
    @Req() req: Request,
    @Body() body: { newLanguage: string },
  ): Promise<{ success: boolean }> {
    try {
      return {
        success: await this.prismaService.setLanguage(
          req['user'],
          body.newLanguage,
        ),
      };
    } catch (error) {
      return { success: false };
    }
  }

  @Get('getlanguage')
  async getLanguage(@Req() req: Request): Promise<{ language: string }> {
    return { language: await this.prismaService.getLanguage(req['user']) };
  }

  /* Returns information about your authentication methods. */
  @Get('authstatus')
  async checkAuth(@Req() req: Request) {
    try {
      const userInfo = await this.prismaService.authStatusById(req['user']);

      return {
        twoFactorEnabled: userInfo.twoFactorEnabled,
        oauthEnabled: userInfo.oauthEnabled,
      };
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
