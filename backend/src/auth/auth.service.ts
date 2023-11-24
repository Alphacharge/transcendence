import { ForbiddenException, Injectable } from '@nestjs/common';
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
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signup(user: User) {
    try {
      //generate the pw hash
      const hash = await argon.hash(user.password);
      //save the new user

      const newUser = await this.prisma.users.create({
        data: {
          email: user.email,
          hash,
        },
      });
      // console.log(this.signToken(user.id, user.email));
      const bToken = await this.signToken(newUser.id, newUser.email);
      // return this.signToken(newUser.id, newUser.email);
      return {
        access_token: bToken,
        userId: newUser.id,
        userEmail: newUser.email,
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
    //find the user by email
    const newUser = await this.prisma.users.findUnique({
      where: {
        email: user.email,
      },
    });
    //if user does not exist throw exception
    if (!newUser) {
      throw new ForbiddenException('Credentials incorrect');
    }
    //compare password
    const pwMatches = await argon.verify(newUser.hash, user.password);
    //if password wrong throw exception
    if (!pwMatches) {
      throw new ForbiddenException('Credentials incorrect');
    }
    const bToken = await this.signToken(newUser.id, newUser.email);
    // return this.signToken(newUser.id, newUser.email);

    console.log('AUTH.SERVICE: SIGNIN, Logged in ', newUser.email);

    return {
      access_token: bToken,
      userId: newUser.id,
      userEmail: newUser.email,
    };
  }

  async signToken(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: secret,
    });

    return token;
  }

  /* This function takes an object or a token directly and returns its validity. */
  async validateToken(
    tokenOrUserId: string | { userId: number; token: string },
  ) {
    const secret = this.config.get('JWT_SECRET');

    try {
      let decodedToken: any;

      // no user ID given
      if (typeof tokenOrUserId === 'string') {
        decodedToken = await this.jwt.verifyAsync(tokenOrUserId, {
          secret: secret,
        });
        // user ID given
      } else {
        const { userId, token } = tokenOrUserId;
        decodedToken = await this.jwt.verifyAsync(token, { secret: secret });

        // Check if the stored userId matches the userId from the token
        if (userId !== decodedToken.sub) {
          console.error(
            'AUTH.SERVICE: VALIDATETOKEN, User Identity KO: ',
            userId,
          );
          return false;
        }
      }
      return true;
    } catch (error) {
      // console.error('AUTH.SERVICE: VALIDATETOKEN, User Identity KO: Token verification failed', error);
      return false;
    }
  }
}
