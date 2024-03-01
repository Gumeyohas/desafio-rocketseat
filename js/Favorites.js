import { GithubUser } from "./GithubUser.js";

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("github-user:")) || []

        if(this.entries == []){
            const table = this.root.querySelector("table")
            console.log(table)
        }
    }

    async add(username) {
        try{
            const userExists = this.entries.find(entry => entry.login === username)
            
            if(userExists) {
               throw new Error('Usuário já cadastrado!') 
            }
            const {login, name, public_repos, followers} = await GithubUser.search(username)
            
            if(login === undefined ) {
                throw new Error('Usuário não encontrado! Coloque um nome válido')
            }
            this.entries = [{login, name, public_repos, followers}, ...this.entries]

            this.update()
            this.save()

        } catch(error) {
            alert(error.message)
        } 
    }

    save() {
        localStorage.setItem("github-user:", JSON.stringify(this.entries))
    }

    delete(user) {
        this.entries = this.entries.filter(entry => entry.login !== user.login)
        
        this.update();
        this.save()
    }

}


export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector("tbody")
        
        this.update()
        this.onAdd()
    }

    onAdd() {
        const buttonSearch = this.root.querySelector("#button-search")
        buttonSearch.onclick = () => {
            const { value } = this.root.querySelector("#input-search")

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        this.entries.forEach( user => {
            const row = this.createRow()

            row.querySelector(".user img").src = `https://github.com/${user.login}.png`
            row.querySelector(".user img").alt = `Imagem de ${user.name}`
            row.querySelector(".user a").href = `https://github.com/${user.login}`
            row.querySelector(".user a p").textContent = user.name
            row.querySelector(".user a span").textContent = `/${user.login}`
            row.querySelector(".repositories").textContent = user.public_repos
            row.querySelector(".followers").textContent = user.followers

            row.querySelector(".remove").onclick = () => {
                //Essa linha abre um popup com a mensagem que escrevemos abaixo, com a opção de Ok ou cancelar, retornando true ou false
                const isOk = confirm('Tem certeza que deseja deletar essa lista?')
                if(isOk) {
                    this.delete(user)
                }
            }
            //Essa linha que faz a row aparecer dentro do tbody
            this.tbody.append(row)
        })
    }

    createRow() {
        const tr = document.createElement("tr")
        tr.innerHTML = `
            <td class="user">
                <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
                <a href="https://github.com/maybrito" target="_blank">
                    <p>Mayk Brito</p>
                    <span>/maykbrito</span>
                </a>
            </td>
            <td class="repositories">
                76
            </td>
            <td class="followers">
                9589
            </td>
            <td>
                <button class="remove">Remover</button>
            </td>
        `

        return tr
    }

    removeAllTr() {
        this.tbody.querySelectorAll("tbody tr")
            .forEach( tr => {
                tr.remove();
            })
    }
}