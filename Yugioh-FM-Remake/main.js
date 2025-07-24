import { RouterManager } from './core/routerManager.js';
import { adicionarRotas } from './core/routers.js';


const router = new RouterManager();
let currentUser = null

function carregarJogo(jogador) {
console.log(jogador)
currentUser = jogador
};

function init() {
adicionarRotas(router);
window.addEventListener('DOMContentLoaded', () => router.start());
window.addEventListener('hashchange', () => router.navigate());
window.carregarJogo = (jogador) => carregarJogo(jogador)

}

init();