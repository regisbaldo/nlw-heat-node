import "dotenv/config";
import axios from "axios";
import prismaClient from "../prisma";
import { sign } from "jsonwebtoken";

interface IAccessTokenResonse {
  access_token: string;
}
interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

class AuthenticateUserService {
  async execute(code: string) {
    const accessTokenUrl = "https://github.com/login/oauth/access_token";
    const userUrl = "https://api.github.com/user";

    const { data: accessTokenResponse } = await axios.post<IAccessTokenResonse>(
      accessTokenUrl,
      null,
      {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: { Accept: "application/json" },
      }
    );

    const { data: userDataResponse } = await axios.get<IUserResponse>(userUrl, {
      headers: {
        authorization: `Bearer ${accessTokenResponse.access_token}`,
      },
    });

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: userDataResponse.id,
      },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: userDataResponse.id,
          login: userDataResponse.login,
          avatar_url: userDataResponse.avatar_url,
          name: userDataResponse.name,
        },
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return { token, user };
  }
}

export { AuthenticateUserService };
