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
        id: string,
        userId:string
    }>;
}