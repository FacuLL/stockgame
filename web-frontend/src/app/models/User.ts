interface LoginUser {
    username: string
    password: string
}

interface LoggedUser {
    userid: number
    name: string
    image: string
    team: number
    publicprofile: number
    username: string
    creatorid: number
}

export { LoginUser, LoggedUser }