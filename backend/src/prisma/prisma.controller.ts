import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  Req,
  UploadedFile,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Avatars } from '@prisma/client';
import { Request } from 'express';
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

// @UseGuards(JwtAuthGuard)
@Controller('data')
export class PrismaController {
  constructor(
    private readonly prismaService: PrismaService,
    readonly authService: AuthService,
  ) {}

  @Post('editname')
  async updateUsername(
    @Body() body: { userId: number; accessToken: string; newUsername: string },
  ): Promise<{ userName: string | null }> {
    const { userId, accessToken, newUsername } = body;
    try {
      if (!(await this.authService.verifyId(userId, accessToken))) {
        throw new ForbiddenException();
      }
      const newUser: string = await this.prismaService.updateUsername(
        userId,
        newUsername,
      );
      if (newUser) {
        return { userName: newUser };
      }
      return { userName: null };
    } catch (error) {
      console.error('Error update Username:', error);
      return { userName: null };
    }
  }

  @Post('userstats')
  async getHistoryMatches(@Body() body: { userId: number }): Promise<{
    userHistory: any[] | null;
    userProfil: any | null;
    userMilestones: any | null;
  }> {
    const { userId } = body;
    try {
      const userHistory =
        await this.prismaService.getHistoryMatchesById(userId);
      const userProfil = await this.prismaService.getUserById(userId);
      const userMilestones =
        await this.prismaService.getUserMilestonesById(userId);
		console.log("userstats user id:", userId);
		console.log("user data:", userProfil);
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
    @Body() body: { userId: number },
  ): Promise<{ friends: any[] | null }> {
    const { userId } = body;
    try {
      const friends = await this.prismaService.getFriendsById(userId);
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
    @Body() body: { userId: number },
  ): Promise<{ friends: any[] | null }> {
    const { userId } = body;
    try {
      const friends = await this.prismaService.getNonFriendsById(userId);
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
    @Body() body: { userId: number; friendIds: number[] },
  ): Promise<void> {
    const { userId, friendIds } = body;
    try {
      // Add each friend in a loop
      for (const friendId of friendIds) {
        await this.prismaService.addFriendByIds(userId, friendId);
      }
    } catch (error) {
      console.error('Error adding friends:', error);
      // You can choose to handle the error as needed
    }
  }

  @Post('removefriend')
  async deleteFriendByIds(
    @Body() body: { userId: number; friendId: number },
  ): Promise<{ friends: any[] | null }> {
    const { userId, friendId } = body;
    try {
      const response = await this.prismaService.deleteFriendByIds(
        userId,
        friendId,
      );
      if (response) {
        const friends = await this.prismaService.getFriendsById(userId);
        if (friends) {
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
          // Use a simple filename for now (you can customize this as needed)
          const filename = `${Date.now()}${extname(file.originalname)}`;

          // Callback with the generated filename
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
        // Get the user ID from the request
        const userId = req.body.userId;
        const token = req.body.accessToken;

        if (!(await this.authService.verifyId(userId, token))) {
          throw new ForbiddenException();
        }
        // Create a new avatar entry in the database
        const avatar: Avatars = await this.prismaService.createNewAvatarById(
          userId,
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

        // Handle the uploaded file here (you can save the filename or avatar ID in the database)
        console.log('File uploaded successfully:', file);

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
}
