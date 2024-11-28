import prismaClient from "../config/db.config.js";
import jwt from "jsonwebtoken";
interface loginPayloadType {
  name: string;
  email: string;
  oauth_provider: string;
  image: string;
  password?: string;
}

async function signIn(req: any, res: any) {
  try {
    const body: loginPayloadType = req.body;

    let findUser = await prismaClient.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!findUser) {
      return res.status(403).json({
        message: "User not found!",
      });
    }

    let jwtPayload = {
      name: findUser.name,
      id: findUser.id,
      email: findUser.email,
      oauth_provider: findUser.provider,
      image: findUser.image,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET!, {
      expiresIn: "365d",
    });

    return res.json({
      message: "Logged in successfully!",
      user: {
        ...findUser,
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong.please try again!" });
  }
}
async function signUp(req: any, res: any) {
  try {
    const body: loginPayloadType = req.body;

    let findUser = await prismaClient.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (findUser) {
      return res.status(403).json({
        message: "User already exist!",
      });
    }
    await prismaClient.user.create({
      data: {
        email: body.email,
        name: body.name,
        provider: body.oauth_provider,
        password: body.password,
        image: body.image,
      },
    });
    return res.status(200).json({
      message: "User created successfully!",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Something went wrong.please try again!" });
  }
}

export { signIn, signUp };
