import { Controller, Post, Body, UseInterceptors, Req, UploadedFile } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Avatars } from '@prisma/client';
import { Request } from 'express';


export class AvatarCreationFailedException extends HttpException {
  constructor() {
    super('Failed to create a new avatar entry', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

@Controller('data')
export class PrismaController {
  constructor(
    private readonly prismaService: PrismaService,
    readonly authService: AuthService,
    ) {}

  @Post('userstats')
  async getHistoryMatches(
    @Body() body: { userId: number },
  ): Promise<{ userHistory: any[] | null; userProfil: any | null }> {
    const { userId } = body;
    try {
      const userHistory =
        await this.prismaService.getHistoryMatchesById(userId);
      const userProfil = await this.prismaService.getUserById(userId);
      return { userHistory, userProfil };
    } catch (error) {
      console.error('Error fetching user statistics:', error);
      return { userHistory: null, userProfil: null };
    }
  }

  @Post('allstats')
  async getUserStatistics(): Promise<any | null> {
    return await this.prismaService.getUserStatistics();
  }

  @Post('friends')
  async getFriendsById(
    @Body() body: { userId: number },
  ): Promise<{ friends: any[] | null }> {
    const { userId } = body;
    try {
      const friends = await this.prismaService.getFriendsById(userId);
      friends.forEach((element) => {
        if (this.authService.activeUser.includes(element.id)) {
          element.status = 1;
        }
      });
      return { friends };
    } catch (error) {
      console.error('Error fetching friends:', error);
      return { friends: null };
    }
  }

  // @Post('upload')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './',
  //       filename: async (req: Request, file, callback) => {
  //         try {
  //           const prismaService = (req as any).prismaService;
  //           // Get the user ID from the request
  //           const userId = req.body.userId;
  //           // Create a new avatar entry in the database
  //           console.error("trap");
  //           const avatar: Avatars = await prismaService.createNewAvatarById(userId);
  //           console.error(avatar)
  //           if (!avatar)
  //             throw new AvatarCreationFailedException();
  //           // Use the avatar ID as the filename
  //           const filename = `${avatar.id}${extname(file.originalname)}`;
  
  //           // Callback with the generated filename
  //           callback(null, filename);
  //         } catch (error) {
  //           // Handle errors
  //           callback(error, null);
  //         }
  //       },
  //     }),
  //   }),
  // )

  // async uploadFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
  //   // Access the file information from the request object
  //   // Handle the uploaded file here
  //   // 'file' contains information about the uploaded file, including the path

  //   return { filename: file.filename };
  // }
  @Post('upload')
@UseInterceptors(
  FileInterceptor('file', {
    storage: diskStorage({
      destination: './',
      filename: (req, file, callback) => {
        // Get the user ID from the request
        const userId = req.body.userId;

        // Use a simple filename for now (you can customize this as needed)
        const filename = `${userId}_${Date.now()}${extname(file.originalname)}`;

        // Callback with the generated filename
        callback(null, filename);
      },
    }),
  }),
)
async uploadFile(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
  try {
    // Get the user ID from the request
    const userId = req.body.userId;

    // Create a new avatar entry in the database
    const avatar: Avatars = await this.prismaService.createNewAvatarById(userId);

    if (!avatar) {
      throw new AvatarCreationFailedException();
    }

    // Handle the uploaded file here (you can save the filename or avatar ID in the database)
    console.log('File uploaded successfully:', file);

    // Return the appropriate response
    return { filename: file.filename, avatarId: avatar.id }; 
  } catch (error) {
    // Handle errors
    console.error('Error uploading file:', error);
    throw new AvatarCreationFailedException();
  }
}
}
