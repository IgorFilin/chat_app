import { RoleType } from './types';

export interface ITag {
  id: string;
  title: string;
}

export interface IArticleResponse {
  id: string;
  title: string;
  description: string;
  theme: string;
  date: string;
  tags: ITag[];
  views: Array<{
    id: string;
    userId: string;
  }>;
  user: {
    id: string;
    name: string;
  };
}

export interface AuthType {
  isAuth: boolean;
  isLoading: boolean;
}

export interface GetAuthPesponseType {
  id: string;
  isAcceptKey: boolean;
  isAuth: boolean;
  name: string;
}

export interface IUserInfo {
  isAuth: boolean;
  name: string;
  id: string;
  isAcceptKey: boolean;
  role: RoleType;
}

export interface Tag {
  id: string;
  title: string;
}

export interface View {
  id: string;
  userId: string;
}

export interface IArticle {
  date: string;
  description: string;
  id: string;
  tags: Tag[];
  title: string;
  views: View[];
}

export interface IResponseUserDataWs {
  Name: string
  Message: string
  Event: string
}
