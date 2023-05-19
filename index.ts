import express, { Request, Response } from "express";
import cors from "cors";
import fs from "fs";
import bodyParser from "body-parser";

const app = express();

app.use(
  cors({
    origin: "https://chat.openai.com",
  })
);

app.use(bodyParser.json());

let TODOS: { [key: string]: string[] } = {};

app.post("/todos/:username", (req: Request, res: Response) => {
  let username: string = req.params.username!;
  if (!(username in TODOS)) {
    TODOS[username] = [];
  }
  TODOS[username]?.push(req.body.todo);
  res.status(200).send("OK");
});

app.get("/todos/:username", (req: Request, res: Response) => {
  let username: string = req.params.username!;
  res.status(200).send(JSON.stringify(TODOS[username] || []));
});

app.delete("/todos/:username", (req: Request, res: Response) => {
  let username: string = req.params.username!;
  let todo_idx: number = req.body.todo_idx;
  if (0 <= todo_idx && todo_idx < (TODOS[username]?.length ?? 0)) {
    TODOS[username]?.splice(todo_idx, 1);
  }
  res.status(200).send("OK");
});




app.get("/logo.png", (req: Request, res: Response) => {
  res.sendFile("logo.png", { root: "." }, (err: Error) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.get("/.well-known/ai-plugin.json", (req: Request, res: Response) => {
  fs.readFile(
    "./.well-known/ai-plugin.json",
    "utf8",
    (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.send(data);
    }
  );
});

app.get("/openapi.yaml", (req: Request, res: Response) => {
  fs.readFile(
    "openapi.yaml",
    "utf8",
    (err: NodeJS.ErrnoException | null, data: string) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      res.type("yaml").send(data);
    }
  );
});

app.listen(5003, () => {
  console.log("Server is running at http://localhost:5003");
});
