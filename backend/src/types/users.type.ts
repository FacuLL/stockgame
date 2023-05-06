
export type UserType = "basicuser" | "team" | "admin" | "institution";

type UserTypeDict = {
    BASICUSER: UserType
    TEAM: UserType
    ADMIN: UserType
    INSTITUTION: UserType
}

export const USER_TYPE: UserTypeDict = {
    BASICUSER: "basicuser",
    TEAM: "team",
    ADMIN: "admin",
    INSTITUTION: "institution"
}