import {
  ForbiddenException,
  GatewayTimeoutException,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from './interfaces/user.interface';
import { Users } from '@prisma/client';
import { Request } from 'express';
import { AuthDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  waitingFor2FA: Set<number> = new Set<number>();
  activeUser: Set<number> = new Set<number>();

  async signup(user: User, oauth: boolean) {
    let obj = {
      access_token: '',
      userId: 0,
      userName: '',
      twoFactorEnabled: false,
      errorCode: '',
    };
    try {
      // Validate password
      let error = this.validatePassword(user.password);
      if (error != null) {
        obj.errorCode = error;
        return obj;
      }
      // Validate username
      error = this.validateUsername(user.username);
      if (error != null) {
        obj.errorCode = error;
        return obj;
      }
      //generate the pw hash
      const hash = await argon.hash(user.password);
      //create new user in the database
      const newUser = await this.prismaService.createUserBySignUp(
        user.username,
        hash,
        oauth,
      );
      if (newUser == null) {
        obj.errorCode = '8';
        return obj;
      }
      //create sessiontoken
      const bToken = await this.signToken(newUser.id, newUser.username);
      //push userid to the activeuser list
      if (!this.activeUser.has(newUser.id)) {
        this.activeUser.add(newUser.id);
      }
      console.log('AUTH.SERVICE: SIGNUP, Registered: ', newUser.username);

      obj.access_token = bToken;
      obj.userId = newUser.id;
      obj.userName = newUser.username;
      obj.errorCode = null;
      obj.twoFactorEnabled = newUser.two_factor_enabled;
      return obj;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          obj.errorCode = '8';
          return obj;
        }
      }
    }
  }

  async pwChange(userId: number, oldPassword: string, newPassword: string) {
    try {
      //compare old password
      const passwordHashFromDatabase: string =
        await this.prismaService.getUserHashById(userId);
      const pwMatches = await argon.verify(
        passwordHashFromDatabase,
        oldPassword,
      );
      //if password is wrong throw exception
      if (!pwMatches) {
        return { success: false, message: '2' };
      }

      //validate syntax new password
      const error = this.validatePassword(newPassword);
      if (error != null) {
        return { success: false, message: error };
      }
      //generate the pw hash
      const hash = await argon.hash(newPassword);
      //update user in the database
      const newPasswordHash = await this.prismaService.updateUserPasswordById(
        userId,
        hash,
      );

      if (newPasswordHash == null) {
        return { success: false, message: '50' };
      }

      return { success: true, message: '99' };
    } catch (error) {
      console.error('change Password: Failed to change Password.');
      return { success: false, message: error.message };
    }
  }

  async checkUserInDB(user: User): Promise<Users> {
    const newUser = await this.prismaService.getUserByName(user.username);
    return newUser;
  }

  async signin(user: User) {
    let obj = {
      access_token: '',
      userId: 0,
      userName: '',
      requires2FA: false,
      errorCode: '',
    };
    //find the user by username in database
    const newUser = await this.checkUserInDB(user);
    //if user does not exist throw exception
    if (!newUser) {
      obj.errorCode = '7';
      return obj;
    }
    //compare password
    const pwMatches = await argon.verify(newUser.hash, user.password);
    //if password is wrong throw exception
    if (!pwMatches) {
      obj.errorCode = '2';
      return obj;
    }
    if (!this.activeUser.has(newUser.id)) {
      this.activeUser.add(newUser.id);
    }
    obj.userId = newUser.id;
    obj.userName = newUser.username;
    obj.requires2FA = newUser.two_factor_enabled;
    // if 2fa code is needed we send no JWT token
    if (newUser.two_factor_enabled) {
      obj.access_token = '';
      obj.errorCode = '0';
      return obj;
    }

    //create sessiontoken
    const bToken = await this.signToken(newUser.id, newUser.username);

    console.log('AUTH.SERVICE: SIGNIN, Logged in:', newUser.username);

    obj.access_token = bToken;
    obj.errorCode = '0';
    return obj;
  }

  async signToken(userId: number, username: string): Promise<string> {
    const payload = { sub: userId, username };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('JWT_EXPIRE'),
      secret: secret,
    });

    return token;
  }

  async validateToken(token: string): Promise<boolean> {
    const secret = this.config.get('JWT_SECRET');

    try {
      const decodedToken: any = (await this.jwt.verifyAsync(token, {
        secret: secret,
      })) as { sub: number; username: string } | null;
      if (decodedToken) {
        return true;
      }
    } catch (error) {
      console.error('validateToken: JWT invalid or expired.');
      return false;
    }
  }

  async validateUserByToken(token: string): Promise<number> {
    const secret = this.config.get('JWT_SECRET');

    try {
      const decodedToken: any = (await this.jwt.verifyAsync(token, {
        secret: secret,
      })) as { sub: number; username: string } | null;

      const user = this.prismaService.getUserById(decodedToken.sub);

      if (user) return decodedToken.sub;
    } catch (error) {
      console.log('validateToken: JWT invalid or expired.');
      return 0;
    }
  }

  async validateAndRenewToken(
    token: string,
  ): Promise<{ valid: boolean; renewedToken?: string }> {
    const secret = this.config.get('JWT_SECRET');
    try {
      const decodedToken: any = await this.jwt.verifyAsync(token, {
        secret: secret,
      });
      // Check if the token is expired
      if (decodedToken.exp <= Math.floor(Date.now() / 1000)) {
        // Token is expired
        // Remove the user ID from the activeUser array
        const userId = decodedToken.sub;
        this.activeUser.delete(userId);
        return { valid: false };
      }
      // Token is valid and not expired
      // Renew the token and return it
      const renewedToken = await this.signToken(
        decodedToken.sub,
        decodedToken.username,
      );
      return { valid: true, renewedToken };
    } catch (error) {
      // Handle token verification errors
      console.log('validateToken: JWT invalid or expired.');
      return { valid: false };
    }
  }

  async verifyId(userId: number, token: string): Promise<boolean> {
    const secret = this.config.get('JWT_SECRET');

    try {
      const decodedToken: any = await this.jwt.verifyAsync(token, {
        secret: secret,
      });
      if (Number(userId) === decodedToken.sub) {
        return true;
      }
      console.error('User ID does not match decoded token sub');
      return false;
    } catch (error) {
      console.error('token verification failed', error);
      return false;
    }
  }

  private validatePassword(password: string): string | null {
    if (password.length < 8) {
      return '3';
    }
    // Define a whitelist of allowed characters (ASCII and common symbols)
    const allowedCharsRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/;
    if (!allowedCharsRegex.test(password)) {
      return '4';
    }
    return null;
  }

  validateUsername(username: string): string | null {
    if (username.length < 4) {
      return '11';
    }
    if (username.length > 16) {
      return '12';
    }
    // Define a whitelist of allowed characters (ASCII and common symbols)
    const allowedCharsRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]+$/;

    if (!allowedCharsRegex.test(username)) {
      return '13';
    }
    return null;
  }

  async handleCallback(request: Request) {
    const authorizationCode = request.query.code as string;
    const clientId = process.env.VUE_APP_FORTYTWO_APP_ID;
    const clientSecret = process.env.VUE_APP_FORTYTWO_APP_SECRET;
    const redirectUri = `https://${process.env.VUE_APP_SERVER_IP}:${process.env.VUE_APP_BACKEND_PORT}/auth/42/callback`;
    const tokenEndpoint = process.env.TOKEN_ENDPOINT;
    let response = {
      access_token: '',
      userId: 0,
      userName: '',
      errorCode: '0',
      twoFactorEnabled: false,
    };
    try {
      const tokenResponse = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: authorizationCode,
          redirect_uri: redirectUri,
        }),
      });
      let accessToken: string;
      if (tokenResponse.ok) {
        const tokenData = await tokenResponse.json();
        accessToken = tokenData.access_token;
      } else {
        response.errorCode = '5';
        return response;
      }

      const apiResponse = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (apiResponse.ok) {
        const responseData = await apiResponse.json();
        const user: User = {
          username: responseData.login,
          password: process.env.BACKEND_API_PW,
          id: 0,
        };
        const newUser = await this.checkUserInDB(user);
        if (!newUser) {
          response = await this.signup(user, true);
        } else if (newUser.oauth) {
          if (newUser.two_factor_enabled) {
            response.access_token = '';
            response.userId = newUser.id;
            response.userName = newUser.username;
            response.twoFactorEnabled = newUser.two_factor_enabled;
            response.errorCode = '0';
          } else {
            const bToken = await this.signToken(newUser.id, newUser.username);
            response.access_token = bToken;
            response.userId = newUser.id;
            response.userName = newUser.username;
            response.twoFactorEnabled = newUser.two_factor_enabled;
            response.errorCode = '0';
            if (!this.activeUser.has(newUser.id)) {
              this.activeUser.add(newUser.id);
            }
          }
        } else {
          response.errorCode = '1';
          return response;
        }
        return response;
      } else {
        response.errorCode = '5';
        return response;
      }
    } catch (error) {
      // Handle fetch errors
      console.error(`AUTH.SERVICE: HANDLECALLBACK, exception caught: ${error}`);
    }
  }
}
