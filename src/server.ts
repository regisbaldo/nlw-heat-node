import { serverHttp } from "./app";
const port = 4000;

serverHttp.listen(port, () => console.log(`Server is running in PORT ${port}`));