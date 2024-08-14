import { User } from "./user";

export interface Picture {
    id: number;
    title: string;
    url: string;
    user?: User;
    createdAt: string;
    isFavorite: boolean;
  }
  