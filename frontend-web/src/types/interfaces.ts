export interface User {
    token: string,
    type: string,
    userid: number,
    name: string,
    image?: string,
    publicprofile: boolean,
    institution?: Institution,
    basicuser?: BasicUser
}

interface Institution {
    institutionid: number,
    email: string
}

interface BasicUser {
    basicuserid: number,
    email: string,
    username: string
}