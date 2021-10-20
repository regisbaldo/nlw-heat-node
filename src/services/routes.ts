import express from "express";
import { AuthenticateUserController } from "../controllers/AuthenticateUserController";
import { CreateMessageController } from "../controllers/CreateMessageController";
import { GetLastMessagesController } from "../controllers/GetLastMessagesController";
import { ProfileUserController } from "../controllers/ProfileUserController";
import { EnsureAuthenticateUser } from "../middlewares/EnsureAuthenticateUser";

const router = express.Router();

router.get("/github", (request, response) => {
  response.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`
  );
});

router.get("/signin/callback", (request, response) => {
  const { code } = request.query;
  return response.json(code);
});

router.post("/authenticate", new AuthenticateUserController().handle);
router.post(
  "/messages",
  EnsureAuthenticateUser,
  new CreateMessageController().handle
);
router.get("/messages/last", new GetLastMessagesController().handle);

router.post("/authenticate", new AuthenticateUserController().handle);
router.post(
  "/profile",
  EnsureAuthenticateUser,
  new ProfileUserController().handle
);

export { router };
