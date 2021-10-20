import { GetLastMessagesService } from "../services/GetLastMessagesService";
import { Request, Response } from "express";

class GetLastMessagesController {
  async handle(request: Request, response: Response) {
    const service = new GetLastMessagesService();
    const result = await service.execute();
    return response.json(result);
  }
}
export { GetLastMessagesController };
