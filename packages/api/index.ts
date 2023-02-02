import express, { Application, Request, Response } from "express";
import { Provider, Contract } from 'starknet';

const app: Application = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req: Request, res: Response): Promise<Response> => {

  const abi = [];
  const address = '0x';
  const provider = new Provider({
    sequencer: {
      network: 'goerli-alpha'
    }
  });

  const test = new Contract([], '0x', provider);
  return res.status(200).send({
      message: "Hello World!",
  });
});

try {
  app.listen(port, (): void => {
      console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${error}`);
}