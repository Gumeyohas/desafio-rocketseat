export class GithubUser {
    static async search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        const response = await fetch(endpoint)
        const data = await response.json()
        return data
        // .then(data => data.json())
        // .then(({login, name, public_repos, followers}) => ({
        //     login,
        //     name,
        //     public_repos,
        //     followers
        // }))
    }
}