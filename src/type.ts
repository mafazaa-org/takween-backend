declare global {
  namespace NestApplication {
    export interface Request {
      user?: {
        id: string;
        name: string;
        phone: string;
      };
    }
  }
}
