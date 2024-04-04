import { Request, Response } from 'express';
import { join } from "path";

const buildPath: string = join(__dirname, "../../frontend/build");

export function handleGetRequest(_req: Request, res: Response) {
    res.sendFile("index.html", {
        root: buildPath
    });
}
