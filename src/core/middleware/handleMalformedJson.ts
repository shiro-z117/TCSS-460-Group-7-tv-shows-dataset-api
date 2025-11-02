import { Request, Response, NextFunction } from "express";

export function handleMalformedJson(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON",
      details: err.message,
    });
  }
  next(err);
}
