import express, { Express } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { getS$ } from "./septa/septa";
import { App, FBLog } from "@mchirico/fblog";

import * as path from "path";

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

export const getApp = (): Express => {
  const app = express();
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(cors());

  const angularDirectoryPath = path.join(__dirname, "../static/html");

  app.use("/", express.static(angularDirectoryPath));

  app.get("/send", (_, res) => {
    const databaseURL = "https://septapig.firebaseio.com";
    const db = App(databaseURL).firestore();
    const fbLog = new FBLog(db);
    fbLog.set("fblog", { desc: "description to log", action: "activate" });
    res.json({ ok: true });
  });

  app.get("/api/v1/test", (_, res) => {
    res.json({ ok: true });
  });

  app.get("/data", cors(corsOptions), function (req, res) {
    const heroes = [
      { id: 11, name: "Dr Nice" },
      { id: 12, name: "Narco" },
      { id: 13, name: "Bombasto" },
      { id: 14, name: "Celeritas" },
      { id: 15, name: "Magneta" },
      { id: 16, name: "RubberMan" },
      { id: 17, name: "Dynama" },
      { id: 18, name: "Dr IQ" },
      { id: 19, name: "Magma" },
      { id: 20, name: "Tornado" },
    ];
    res.json(heroes);
  });

  app.get("/trainview", (_, res) => {
    getS$.subscribe((x: unknown) => res.json(x));
  });

  app.get("/trainviewp", (_, res) => {
    getS$.subscribe((x: unknown) => res.jsonp(x));
  });

  // Default ... keep last
  app.use("*", express.static(angularDirectoryPath));
  return app;
};
