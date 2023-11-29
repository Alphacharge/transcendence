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
import { type } from 'os';
import { Request, Response } from 'express';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async signup(user: User) {
    try {
      //generate the pw hash
      const hash = await argon.hash(user.password);
      //save the new user

      const newUser = await this.prismaService.createUserBySignUp(
        user.email,
        hash,
      );
      if (newUser == null)
        throw new GatewayTimeoutException('Database unreachable');
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

  async checkUserInDB(user: User): Promise<Users> {
    const newUser =  await this.prismaService.getUserByEmail(user.email);
    return newUser;
  }

  async signin(user: User) {
    const newUser = await this.checkUserInDB(user);
    if (!newUser) {
      throw new ForbiddenException('User not found');
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
      console.log('AUTH.SERVICE: VALIDATETOKEN, userId OK');
      return true;
    } catch (error) {
      // console.error('AUTH.SERVICE: VALIDATETOKEN, User Identity KO: Token verification failed', error);
      return false;
    }
  }

  async handleCallback(request: Request) {
    const authorizationCode = request.query.code as string;
    const clientId = `${process.env.FORTYTWO_APP_ID}`;
    const clientSecret = `${process.env.FORTYTWO_APP_SECRET}`;
    const redirectUri = `https://${process.env.BACKEND_IP}:3000/auth/42/callback`;
    const tokenEndpoint = `${process.env.TOKEN_ENDPOINT}`;
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
        console.error(
          'AUTH.SERVICE: HANDLECALLBACK, Problems with the tokenresponse',
        );
      }
      const apiResponse = await fetch('https://api.intra.42.fr/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (apiResponse.ok) {
        const responseData = await apiResponse.json();
        // console.log(
        //   `AUTH.SERVICE: HANDLECALLBACK, intra login: ${responseData.login}, email: ${responseData.email}`,
        // );
        const user:User = {username:responseData.login, password:process.env.BACKEND_API_PW, email:responseData.email, id:0};
        const newUser = await this.checkUserInDB(user);
        let response: {access_token:string, userId: number, userEmail: string};
        if(!newUser) {
          response = await this.signup(user);
        } else {
          const bToken = await this.signToken(newUser.id, newUser.email);
          response = {access_token: bToken, userId: newUser.id, userEmail: newUser.email};
        }
        // console.error(`AUTH.SERVICE, HANDLECALLBACK, response=${response}`);
        return response;
      } else {
        console.error(
          'AUTH.SERVICE: HANDLECALLBACK, API Request failed',
          apiResponse.statusText,
        );
        return null;
      }
    } catch (error) {
      // Handle fetch errors
      console.error(
        `AUTH.SERVICE: HANDLECALLBACK, exception caught: ${error}`,
      );
    }
  }
}
