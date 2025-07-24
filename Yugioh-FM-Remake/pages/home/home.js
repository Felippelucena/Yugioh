import { PageTemplate } from '../pageTemplate.js';
import { buscarDados } from '../../core/apiManager.js';

export default class HomePage extends PageTemplate {
  init() {
    this.carregarUsuarios();
  }

  async carregarUsuarios() {

    const dados = await buscarDados('users')
    const divUsuarios = document.getElementById('lista_usuarios')
    let usuarios = ''
    dados.forEach(user => {
      console.log(user)
      usuarios += `<button class='btn btn-primary' data-id='${user.id}' onclick='carregarJogo("${user.nome}")'>${user.nome}</button>`
    });

    divUsuarios.innerHTML = usuarios

  }
  destroy() {
  }
}