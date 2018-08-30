export class GetDisRequest {
    id: number;
    itemperpage: number;
    page: number;
}

export class GetDisResponse {
    content: DisContain;
    last: boolean;
    totalPages: number;
    totalElements: number;
    first: boolean;
    numberOfElements: number;
    size: number;
    number: number;
}

export class DisContain {
    message: string;
    userId: number;
    name: string;
    since: string;
    discusId: number;
    label: string;
    imageAvatarUrl: string;
    childs: GetChilds[];
}

export class GetChilds {
    message: string;
    userId: number;
    name: string;
    since: string;
    discusId: number;
    label: string;
    imageAvatarUrl: string;
}