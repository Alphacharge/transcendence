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
import { type } from 'os';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  activeUser: number[] = [];

  async signup(user: User) {
    try {
      //generate the pw hash
      const hash = await argon.hash(user.password);
      //save the new user

      const newUser = await this.prismaService.createUserBySignUp(
        user.username,
        hash,
      );
      if (newUser == null)
        throw new GatewayTimeoutException('Database unreachable');
      // console.log(this.signToken(user.id, user.username));
      const bToken = await this.signToken(newUser.id, newUser.username);
      // return this.signToken(newUser.id, newUser.username);
      this.activeUser.push(newUser.id);
      return {
        access_token: bToken,
        userId: newUser.id,
        userName: newUser.username,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
    }
  }

  async signin(user: User) {
    //find the user by username
    const newUser = await this.prismaService.getUserByName(user.username);
    //if user does not exist throw exception
    if (!newUser) {
      throw new ForbiddenException('User not found');
    }
    //compare password
    const pwMatches = await argon.verify(newUser.hash, user.password);
    //if password wrong throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const bToken = await this.signToken(newUser.id, newUser.username);
    // return this.signToken(newUser.id, newUser.username);

    console.log('AUTH.SERVICE: SIGNIN, Logged in ', newUser.username);
    console.log(newUser.id);
    this.activeUser.push(newUser.id);
    console.log(this.activeUser);
    return {
      access_token: bToken,
      userId: newUser.id,
      userName: newUser.username,
    };
  }

  async signToken(userId: number, username: string): Promise<string> {
    const payload = {
      sub: userId,
      username,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '60m',
      secret: secret,
    });

    return token;
  }

  /* This function takes an object or a token directly and returns its validity. */
  async validateToken(
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
        const index = this.activeUser.indexOf(userId);
        if (index !== -1) {
          this.activeUser.splice(index, 1);
        }

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
      console.error('Error validating token:', error);
      return { valid: false };
    }
  }
}
