declare global {
  namespace Express {
    interface Request {
      customer?: { id: string; email: string; name: string };
      cmsUser?: { id: string; email: string; name: string; role: string };
    }
  }
}

export {};
