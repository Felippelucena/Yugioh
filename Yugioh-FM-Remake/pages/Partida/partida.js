// GamePage.js - Versão atualizada sem event listeners estáticos

import { PageTemplate } from "../pageTemplate.js";
import { Game } from "./models/game.js";

let game = null;

export default class GamePage extends PageTemplate {
  init() {
    this.startGame();
  }

  startGame() {
    console.log("startGame chamado");

    try {
      // Criar instância do jogo
      game = new Game();

      // Remover os event listeners estáticos - agora são gerenciados pelas fases
      // Os botões são criados/removidos dinamicamente pelas classes de fase
      
      // Apenas manter alguns event listeners globais se necessário
      this.setupGlobalListeners();

    } catch (error) {
      console.error("Erro ao iniciar o jogo:", error);
    }
  }

  setupGlobalListeners() {
    // Listeners que precisam estar sempre ativos, independente da fase

  }

  showSettings() {
    // Implementar modal de configurações se necessário
    console.log("Mostrar configurações");
  }

  destroy() {
    // Limpar referências e listeners globais
    game = null;

  }
}