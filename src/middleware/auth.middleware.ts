import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { E } from "../../types";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      hasError: true,
      error: {
        type: "UnauthorizedError",
        message: "Authentication token is missing.",
      },
      value: null,
    });
  }

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      hasError: true,
      error: {
        type: "UnknownRuntimeError",
        message: "JWT_SECRET is not defined in env.",
      },
      value: null,
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        hasError: true,
        error: {
          type: "UnauthorizedError",
          message: "Invalid authentication token.",
        },
        value: null,
      });
    }
    // Attach decoded token payload to request object
    req.user = decoded;
    next();
  });
};
export const isAdmin: MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userRole = req.user?.user?.role;

  // Check if user role is admin
  if (userRole === "admin") {
    next();
  } else {
    return res.status(403).json({
      hasError: true,
      error: {
        type: "PermisssionDenied",
        message: "User does not have permission to do.",
      },
      value: null,
    });
  }
};

// Define a type for middleware functions
type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Extend Express Request type to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
