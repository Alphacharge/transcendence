import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  PrismaClient,
  Users,
  Games,
  Avatars,
  Tournaments,
} from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      datasources: {
        db: {
          url: config.get('DATABASE_URL'),
        },
      },
    });
  }

  //User
  async createUserBySignUp(
    inName: string,
    inHash: string,
  ): Promise<Users | null> {
    try {
      const newUser = await this.users.create({
        data: {
          username: inName,
          hash: inHash,
        },
      });
      return newUser;
    } catch (error) {
      console.error('Error creating User on SignUp:', error);
      return null;
    }
  }

  async getUserById(userId: number): Promise<any | null> {
    try {
      const userData = await this.users.findUnique({
        where: {
          id: Number(userId),
        },
        select: {
          id: true,
          username: true,
          createdAt: true,
          avatar: {
            select: {
              id: true,
              mime_type: true,
            },
          },
        },
      });

      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async getUserByName(userName: string): Promise<Users | null> {
    console.log('Search User with username: ', userName);

    try {
      const userData = await this.users.findUnique({
        where: { username: userName },
      });
      if (userData) {
        return userData;
      } else {
        console.error(`User with username ${userName} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async getAllUsersIdNaAv(): Promise<
    | {
        id: number;
        username: string;
        avatar: { id: number; mime_type: string };
      }[]
    | null
  > {
    try {
      const allUsers = await this.users.findMany({
        select: {
          id: true,
          username: true,
          avatar: {
            select: {
              id: true,
              mime_type: true,
            },
          },
        },
      });

      return allUsers.map((user) => ({
        id: user.id,
        username: user.username,
        avatar: {
          id: user.avatar.id,
          mime_type: user.avatar.mime_type,
        },
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async createNewGame(leftId: number, rightId: number): Promise<Games | null> {
    // Assuming you're using Prisma to interact with a database
    try {
      const GameData: Games = await this.games.create({
        data: {
          left_user_id: leftId,
          right_user_id: rightId,
          left_user_score: 0,
          right_user_score: 0,
          winner_id: leftId,
          createdAt: new Date(),
        },
      });
      return GameData;
    } catch (error) {
      console.error('Error creating new game:', error);
      return null;
    }
  }

  async updateGameScore(
    gameId: number,
    leftScore: number,
    rightScore: number,
    winnerId: number,
  ) {
    try {
      const updatedGame = await this.games.update({
        where: { id: gameId }, // Specify the condition for the row to be updated (in this case, based on the game's ID)
        data: {
          left_user_score: leftScore,
          right_user_score: rightScore,
          winner_id: winnerId,
        },
      });
      console.log('GAME.STATE: UPDATEGAMESCORE, Updated game:', updatedGame);
    } catch (error) {
      console.error('GAME.STATE: UPDATEGAMESCORE, Error updating game:', error);
    }
  }

  //Tournament
  async createNewTournament(
    firstGameId: number,
    secondGameId: number,
    thirdGameId: number,
    tourWinnerId: number,
  ): Promise<Tournaments | null> {
    // Assuming you're using Prisma to interact with a database
    try {
      const TournamentData: Tournaments = await this.tournaments.create({
        data: {
          first_game_id: firstGameId,
          second_game_id: secondGameId,
          third_game_id: thirdGameId,
          tourwinner_id: tourWinnerId,
          createdAt: new Date(),
        },
      });
      return TournamentData;
    } catch (error) {
      console.error('Error creating new tournament:', error);
      return null;
    }
  }

  //Stats
  async getGameWinsById(userId: number): Promise<number> {
    try {
      const wins: number = await this.games.count({
        where: {
          winner_id: userId,
        },
      });
      return wins;
    } catch (error) {
      console.error('Error counting wins:', error);
      return 0;
    }
  }

  async getGameLossesById(userId: number): Promise<number> {
    try {
      const lost: number = await this.games.count({
        where: {
          OR: [
            {
              left_user_id: userId,
            },
            {
              right_user_id: userId,
            },
          ],
          NOT: {
            winner_id: userId,
          },
        },
      });
      return lost;
    } catch (error) {
      console.error('Error counting losses:', error);
      return 0;
    }
  }

  async getAmountOfMatchesById(userId: number): Promise<number> {
    try {
      const matches: number = await this.games.count({
        where: {
          OR: [
            {
              left_user_id: userId,
            },
            {
              right_user_id: userId,
            },
          ],
        },
      });
      return matches;
    } catch (error) {
      console.error('Error counting losses:', error);
      return 0;
    }
  }

  async getAmountOfTournamentMatchesById(userId: number): Promise<number> {
    try {
      const tournamentCount: number = await this.tournaments.count({
        where: {
          OR: [
            {
              f_game: {
                OR: [{ left_user_id: userId }, { right_user_id: userId }],
              },
            },
            {
              s_game: {
                OR: [{ left_user_id: userId }, { right_user_id: userId }],
              },
            },
            {
              t_game: {
                OR: [{ left_user_id: userId }, { right_user_id: userId }],
              },
            },
          ],
        },
      });
      return tournamentCount;
    } catch (error) {
      console.error('Error counting losses:', error);
      return 0;
    }
  }

  async getTournamentWinsById(userId: number): Promise<number> {
    try {
      const wins: number = await this.tournaments.count({
        where: {
          tourwinner_id: userId,
        },
      });
      return wins;
    } catch (error) {
      console.error('Error counting wins:', error);
      return 0;
    }
  }

  async getUserStatistics() {
    const allUsers = await this.getAllUsersIdNaAv();
    const userStatistics = [];

    for (const user of allUsers) {
      const matches: number = await this.getAmountOfMatchesById(user.id);
      const wins: number = await this.getGameWinsById(user.id);
      const losses: number = await this.getGameLossesById(user.id);
      const tourmatches: number = await this.getAmountOfTournamentMatchesById(
        user.id,
      );
      const tourwins: number = await this.getTournamentWinsById(user.id);

      userStatistics.push({
        userId: user.id,
        username: user.username,
        avatar: user.avatar,
        matches,
        wins,
        losses,
        tourmatches,
        tourwins,
      });
    }
    return userStatistics;
  }

  async getHistoryMatchesById(userId: number): Promise<any[] | null> {
    try {
      const allGames = await this.games.findMany({
        where: {
          OR: [
            { left_user_id: Number(userId) },
            { right_user_id: Number(userId) },
          ],
        },
        orderBy: {
          id: 'desc',
        },
        select: {
          id: true,
          left_user_score: true,
          right_user_score: true,
          l_user: {
            select: {
              id: true,
              username: true,
              avatar: {
                select: {
                  id: true,
                  mime_type: true,
                },
              },
            },
          },
          r_user: {
            select: {
              id: true,
              username: true,
              avatar: {
                select: {
                  id: true,
                  mime_type: true,
                },
              },
            },
          },
        },
      });

      const allData = allGames.map((game) => ({
        id: game.id,
        left_user_score: game.left_user_score,
        right_user_score: game.right_user_score,
        leftUser: {
          id: game.l_user.id,
          username: game.l_user.username,
          avatar: {
            id: game.l_user.avatar.id,
            mime_type: game.l_user.avatar.mime_type,
          },
        },
        rightUser: {
          id: game.r_user.id,
          username: game.r_user.username,
          avatar: {
            id: game.r_user.avatar.id,
            mime_type: game.r_user.avatar.mime_type,
          },
        },
      }));
      return allData;
    } catch (error) {
      console.error('Error fetching match history:', error);
      return null;
    }
  }

  async addFriendByIds(userId: number, friendId: number): Promise<boolean> {
    try {
      const newFriend = await this.friends.create({
        data: {
          user_id: Number(userId),
          friend_id: Number(friendId),
        },
      });
      if (newFriend) return true;
    } catch (error) {
      console.error('Error creating new friend:', error);
      return false;
    }
  }

  async getFriendsById(userId: number): Promise<any[] | null> {
    try {
      const allFriends = await this.friends.findMany({
        where: {
          user_id: Number(userId),
        },
        select: {
          friend: {
            select: {
              id: true,
              username: true,
              avatar: {
                select: {
                  id: true,
                  mime_type: true,
                },
              },
            },
          },
        },
      });

      const friendsData = allFriends.map((friend) => ({
        id: friend.friend.id,
        username: friend.friend.username,
        avatar: {
          id: friend.friend.avatar.id,
          mime_type: friend.friend.avatar.mime_type,
        },
        status: 0,
      }));
      return friendsData;
    } catch (error) {
      console.error('Error fetching friends data:', error);
      return null;
    }
  }

  async getNonFriendsById(userId: number): Promise<any[] | null> {
    try {
      const usersNotFriends = await this.users.findMany({
        where: {
          id: {
            not: Number(userId), // Exclude the current user from the results
          },
          NOT: {
            friend: {
              some: {
                user_id: Number(userId),
              },
            },
          },
        },
        select: {
          id: true,
          username: true,
          avatar: {
            select: {
              id: true,
              mime_type: true,
            },
          },
        },
      });

      const usersNotFriendsData = usersNotFriends.map((user) => ({
        id: user.id,
        username: user.username,
        avatar: {
          id: user.avatar.id,
          mime_type: user.avatar.mime_type,
        },
        status: 0,
      }));
      return usersNotFriendsData;
    } catch (error) {
      console.error('Error fetching non friends data:', error);
      return null;
    }
  }

  async deleteFriendByIds(userId: number, friendId: number): Promise<boolean> {
    try {
      const deletedFriend = await this.friends.deleteMany({
        where: {
          user_id: Number(userId),
          friend_id: Number(friendId),
        },
      });
      return true;
    } catch (error) {
      console.error('Error deleting friend:', error);
      return false;
    }
  }

  async createNewAvatarById(
    userId: number,
    mimeType: string,
  ): Promise<Avatars | null> {
    try {
      const newAvatar = await this.createNewAvatar(mimeType);

      const updatedUser = await this.users.update({
        where: { id: Number(userId) },
        data: {
          avatar_id: newAvatar.id,
        },
      });

      if (updatedUser) {
        return newAvatar;
      }

      return null;
    } catch (error) {
      console.error('Error creating new avatar:', error);
      return null;
    }
  }

  async createNewAvatar(mimeType: string): Promise<Avatars | null> {
    try {
      const newAvatar = await this.avatars.create({
        data: {
          mime_type: mimeType,
        },
      });

      return newAvatar;
    } catch (error) {
      console.error('Error creating new default avatar:', error);
      return null;
    }
  }
}
