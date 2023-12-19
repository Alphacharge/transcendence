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
    inOauth: boolean,
  ): Promise<Users | null> {
    try {
      const newUser = await this.users.create({
        data: {
          username: inName,
          nickname: inName,
          hash: inHash,
          oauth: inOauth,
        },
      });
      return newUser;
    } catch (error) {
      console.error('Error creating User on SignUp:', error);
      return null;
    }
  }

  async getUserById(userId: number): Promise<any> {
    try {
      const userData = await this.users.findUnique({
        where: {
          id: Number(userId),
        },
        select: {
          id: true,
          username: true,
          nickname: true,
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

  async updateUserPasswordById(
    userId: number,
    newHash: string,
  ): Promise<number | null> {
    try {
      const updatedUser = await this.users.update({
        where: { id: Number(userId) },
        data: {
          hash: newHash,
        },
      });
      return userId;
    } catch (error) {
      console.error('Failed to update Passwordhash', error);
      return null;
    }
  }

  async getUserHashById(userId: number): Promise<string | null> {
    try {
      const userData = await this.users.findUnique({
        where: { id: Number(userId) },
      });
      if (userData) {
        return userData.hash;
      } else {
        console.error(`User with id ${userId} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async getUser2FAById(userId: number): Promise<any | null> {
    try {
      const databaseUser = await this.users.findUnique({
        where: {
          id: Number(userId),
        },
        select: {
          id: true,
          username: true,
          two_factor_enabled: true,
        },
      });

      return databaseUser;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }

  async getUserByName(userName: string): Promise<Users | null> {
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

  async updateNickname(
    userId: number,
    newNickname: string,
  ): Promise<string | null> {
    try {
      const updatedGame = await this.users.update({
        where: { id: Number(userId) },
        data: {
          nickname: newNickname,
        },
      });
      return newNickname;
    } catch (error) {
      console.error('Failed to update nickname', error);
      return null;
    }
  }

  async getAllUsersIdNaAv(): Promise<
    | {
        id: number;
        nickname: string;
        avatar: { id: number; mime_type: string };
      }[]
    | null
  > {
    try {
      const allUsers = await this.users.findMany({
        select: {
          id: true,
          nickname: true,
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
        nickname: user.nickname,
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

  async authStatusById(userId: number): Promise<any> {
    const user = await this.users.findUnique({
      where: {
        id: Number(userId),
      }
    });

    return { twoFactorEnabled: user.two_factor_enabled, oauthEnabled: user. oauth };
  }

  async is2FAEnabledById(userId: number): Promise<boolean> {
    const user = await this.users.findUnique({
      where: {
        id: Number(userId),
        two_factor_enabled: true,
      },
    });
    return !!user;
  }

  async enable2FAById(userId: number): Promise<void> {
    await this.users.update({
      where: {
        id: Number(userId),
      },
      data: {
        two_factor_enabled: true,
      },
    });
  }

  async disable2FAById(userId: number): Promise<void> {
    await this.users.update({
      where: {
        id: Number(userId),
      },
      data: {
        two_factor_enabled: false,
        two_factor_secret: '',
      },
    });
  }

  async set2FASecretById(userId: number, secret: string): Promise<void> {
    await this.users.update({
      where: {
        id: Number(userId),
      },
      data: {
        two_factor_secret: secret,
      },
    });
  }

  async get2FASecretById(userId: number): Promise<string | null> {
    const user = await this.users.findUnique({
      where: {
        id: Number(userId),
      },
      select: {
        two_factor_secret: true,
      },
    });

    return user?.two_factor_secret || null;
  }

  async createNewGame(leftId: number, rightId: number): Promise<Games | null> {
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
    longestBreak: number,
    leftContacts: number,
    rightContacts: number,
    winnerId: number,
  ) {
    try {
      const updatedGame = await this.games.update({
        where: { id: Number(gameId) },
        data: {
          left_user_score: Number(leftScore),
          right_user_score: Number(rightScore),
          left_user_contacts: Number(leftContacts),
          right_user_contacts: Number(rightContacts),
          longest_break: Number(longestBreak),
          winner_id: Number(winnerId),
        },
      });
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
    try {
      const TournamentData: Tournaments = await this.tournaments.create({
        data: {
          first_game_id: Number(firstGameId),
          second_game_id: Number(secondGameId),
          third_game_id: Number(thirdGameId),
          tourwinner_id: Number(tourWinnerId),
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
          winner_id: Number(userId),
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
              left_user_id: Number(userId),
            },
            {
              right_user_id: Number(userId),
            },
          ],
          NOT: {
            winner_id: Number(userId),
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
              left_user_id: Number(userId),
            },
            {
              right_user_id: Number(userId),
            },
          ],
        },
      });
      return matches;
    } catch (error) {
      console.error('Error counting matches:', error);
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
                OR: [
                  { left_user_id: Number(userId) },
                  { right_user_id: Number(userId) },
                ],
              },
            },
            {
              s_game: {
                OR: [
                  { left_user_id: Number(userId) },
                  { right_user_id: Number(userId) },
                ],
              },
            },
            {
              t_game: {
                OR: [
                  { left_user_id: Number(userId) },
                  { right_user_id: Number(userId) },
                ],
              },
            },
          ],
        },
      });
      return tournamentCount;
    } catch (error) {
      console.error('Error counting Tournamentmatches:', error);
      return 0;
    }
  }

  async getTournamentWinsById(userId: number): Promise<number> {
    try {
      const wins: number = await this.tournaments.count({
        where: {
          tourwinner_id: Number(userId),
        },
      });
      return wins;
    } catch (error) {
      console.error('Error counting tournament wins:', error);
      return 0;
    }
  }

  async getContactsById(userId: number): Promise<any> {
    try {
      const userContacts: number = await this.$queryRaw`
        WITH UserContacts AS (
          SELECT
            left_user_id AS user_id,
            left_user_contacts AS contacts
          FROM "Games"
          WHERE left_user_id = ${Number(userId)}
        UNION ALL
          SELECT
            right_user_id AS user_id,
            right_user_contacts AS contacts
          FROM "Games"
          WHERE right_user_id = ${Number(userId)}
        )
        SELECT
          CAST(SUM(uc.contacts) AS VARCHAR) AS total_contacts
        FROM UserContacts uc
      `;
      return userContacts || 0;
    } catch (error) {
      console.error('Error finding user contacts:', error);
      return 0;
    }
  }

  async getUserMilestonesById(userId: number) {
    const matches: number = await this.getAmountOfMatchesById(userId);
    const wins: number = await this.getGameWinsById(userId);
    const losses: number = await this.getGameLossesById(userId);
    const tourmatches: number =
      await this.getAmountOfTournamentMatchesById(userId);
    const tourwins: number = await this.getTournamentWinsById(userId);
    const contacts: number = await this.getContactsById(userId);
    const userStatistics: {
      matches: number;
      wins: number;
      losses: number;
      tourmatches: number;
      tourwins: number;
      contacts: number;
    } = {
      matches: matches,
      wins: wins,
      losses: losses,
      tourmatches: tourmatches,
      tourwins: tourwins,
      contacts: contacts,
    };

    return userStatistics;
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
      const contacts = await this.getContactsById(user.id);

      userStatistics.push({
        userId: user.id,
        nickname: user.nickname,
        avatar: user.avatar,
        matches,
        wins,
        losses,
        tourmatches,
        tourwins,
        contacts,
      });
    }
    return userStatistics;
  }

  async getLongestGame(): Promise<any | null> {
    try {
      const longestSpanGame = await this.$queryRaw`
        SELECT
          "Games".id,
          "Games"."createdAt",
          "Games"."updatedAt",
          "Games"."left_user_id",
          "Games"."right_user_id",
          "Games".left_user_score,
          "Games".right_user_score,
          TO_CHAR(TO_TIMESTAMP(EXTRACT(EPOCH FROM ("Games"."updatedAt" - "Games"."createdAt"))), 'HH24:MI:SS') AS duration,
          l_user.nickname as l_nickname,
          l_user.avatar_id as l_avatar_id,
          l_avatar.mime_type as l_avatar_mime_type,
          r_user.nickname as r_nickname,
          r_user.avatar_id as r_avatar_id,
          r_avatar.mime_type as r_avatar_mime_type
        FROM
          "Games"
        LEFT JOIN
          "Users" AS l_user ON "Games".left_user_id = l_user.id
        LEFT JOIN
          "Avatars" AS l_avatar ON l_user.avatar_id = l_avatar.id
        LEFT JOIN
          "Users" AS r_user ON "Games".right_user_id = r_user.id
        LEFT JOIN
          "Avatars" AS r_avatar ON r_user.avatar_id = r_avatar.id
        ORDER BY
          duration DESC
        LIMIT 1
      `;
      return longestSpanGame[0] || null;
    } catch (error) {
      console.error('Error finding longest Game:', error);
      return null;
    }
  }

  async getShortestGame(): Promise<any | null> {
    try {
      const shortestGame = await this.$queryRaw`
        SELECT
          "Games".id,
          "Games"."createdAt",
          "Games"."updatedAt",
          "Games"."left_user_id",
          "Games"."right_user_id",
          "Games".left_user_score,
          "Games".right_user_score,
          TO_CHAR(TO_TIMESTAMP(EXTRACT(EPOCH FROM ("Games"."updatedAt" - "Games"."createdAt"))), 'HH24:MI:SS') AS duration,
          l_user.nickname as l_nickname,
          l_user.avatar_id as l_avatar_id,
          l_avatar.mime_type as l_avatar_mime_type,
          r_user.nickname as r_nickname,
          r_user.avatar_id as r_avatar_id,
          r_avatar.mime_type as r_avatar_mime_type
        FROM
          "Games"
        LEFT JOIN
          "Users" AS l_user ON "Games".left_user_id = l_user.id
        LEFT JOIN
          "Avatars" AS l_avatar ON l_user.avatar_id = l_avatar.id
        LEFT JOIN
          "Users" AS r_user ON "Games".right_user_id = r_user.id
        LEFT JOIN
          "Avatars" AS r_avatar ON r_user.avatar_id = r_avatar.id
        ORDER BY
          duration ASC
        LIMIT 1
      `;
      return shortestGame[0] || null;
    } catch (error) {
      console.error('Error finding shortest Game:', error);
      return null;
    }
  }

  async getMostContacts(): Promise<any | null> {
    try {
      const mostContacts = await this.$queryRaw`
        WITH UserContacts AS (
          SELECT
            left_user_id AS user_id,
            left_user_contacts AS contacts
          FROM "Games"
          UNION ALL
          SELECT
            right_user_id AS user_id,
            right_user_contacts AS contacts
          FROM "Games"
        )
        SELECT
          uc.user_id,
          CAST(SUM(uc.contacts) AS VARCHAR) AS total_contacts,
          u.nickname AS nickname,
          a.id AS avatar_id,
          a.mime_type AS avatar_mime_type
        FROM UserContacts uc
        INNER JOIN "Users" AS u ON uc.user_id = u.id
        LEFT JOIN "Avatars" AS a ON u.avatar_id = a.id
        GROUP BY uc.user_id, u.nickname, a.id, a.mime_type
        ORDER BY total_contacts DESC
        LIMIT 1;
      `;
      return mostContacts[0] || null;
    } catch (error) {
      console.error('Error finding most Contacts:', error);
      return null;
    }
  }

  async getLeastContacts(): Promise<any | null> {
    try {
      const leastContacts = await this.$queryRaw`
        WITH UserContacts AS (
          SELECT
            left_user_id AS user_id,
            left_user_contacts AS contacts
          FROM "Games"
          UNION ALL
          SELECT
            right_user_id AS user_id,
            right_user_contacts AS contacts
          FROM "Games"
        )
        SELECT
          uc.user_id,
          CAST(SUM(uc.contacts) AS VARCHAR) AS total_contacts,
          u.nickname AS nickname,
          a.id AS avatar_id,
          a.mime_type AS avatar_mime_type
        FROM UserContacts uc
        INNER JOIN "Users" AS u ON uc.user_id = u.id
        LEFT JOIN "Avatars" AS a ON u.avatar_id = a.id
        GROUP BY uc.user_id, u.nickname, a.id, a.mime_type
        ORDER BY total_contacts ASC
        LIMIT 1;
      `;
      return leastContacts[0] || null;
    } catch (error) {
      console.error('Error finding Least Contacts:', error);
      return null;
    }
  }

  async getLongestBreak(): Promise<any | null> {
    try {
      const longestBreak = await this.games.findFirst({
        orderBy: {
          longest_break: 'desc',
        },
        select: {
          id: true,
          left_user_score: true,
          right_user_score: true,
          longest_break: true,
          l_user: {
            select: {
              nickname: true,
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
              nickname: true,
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
      return longestBreak || null;
    } catch (error) {
      console.error('Error finding longest Break:', error);
      return null;
    }
  }

  async getHighestWin(): Promise<any | null> {
    try {
      const highestWin = await this.$queryRaw`
        SELECT
          user_id,
          MAX(win_diff) AS max_win_diff,
          u.nickname AS nickname,
          a.id AS avatar_id,
          a.mime_type AS avatar_mime_type
        FROM (
          SELECT
            left_user_id AS user_id,
            left_user_score - right_user_score AS win_diff
          FROM "Games"
          UNION ALL
          SELECT
            right_user_id AS user_id,
            right_user_score - left_user_score AS win_diff
          FROM "Games"
        ) AS UserWins
        INNER JOIN "Users" AS u ON UserWins.user_id = u.id
        LEFT JOIN "Avatars" AS a ON u.avatar_id = a.id
        GROUP BY user_id, u.nickname, a.id, a.mime_type
        ORDER BY max_win_diff DESC
        LIMIT 1;
      `;
      return highestWin[0] || null;
    } catch (error) {
      console.error('Error finding highest win:', error);
      return null;
    }
  }

  async getMilestones() {
    const longestGame = await this.getLongestGame();
    const shortestGame = await this.getShortestGame();
    const mostContacts = await this.getMostContacts();
    const leastContacts = await this.getLeastContacts();
    const longestBreak = await this.getLongestBreak();
    const highestWin = await this.getHighestWin();
    const obj = {
      longestGame,
      shortestGame,
      mostContacts,
      leastContacts,
      longestBreak,
      highestWin,
    };
    return obj;
  }

  async getHistoryMatchesById(userId: number): Promise<any[] | null> {
    try {
      await this.getMilestones();
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
              nickname: true,
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
              nickname: true,
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
          nickname: game.l_user.nickname,
          avatar: {
            id: game.l_user.avatar.id,
            mime_type: game.l_user.avatar.mime_type,
          },
        },
        rightUser: {
          id: game.r_user.id,
          nickname: game.r_user.nickname,
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

  //Friends
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
              nickname: true,
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
        nickname: friend.friend.nickname,
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
          nickname: true,
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
        nickname: user.nickname,
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

  //Avatar
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

  async setLanguage(userId: number, newLanguage: string): Promise<boolean> {
    try {
      await this.users.update({
        where: { id: Number(userId) },
        data: {
          language: newLanguage,
        },
      });
      return true;
    } catch (error) {
      console.error('Failed to update user language', error);
      return false;
    }
  }

  async getLanguage(userId: number) {
    const user = await this.users.findUnique({
      where: {
        id: Number(userId),
      },
    });

    if (user) {
      return user.language;
    } else {
      return 'en';
    }
  }
}
