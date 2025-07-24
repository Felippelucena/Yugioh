import { PageTemplate } from "../pageTemplate.js";
import { Game } from "./models/game.js";

let game = null;

export default class GamePage extends PageTemplate {
  init() {
    const startBtn = document.getElementById("start-game-btn");
    if (startBtn && !startBtn.onclick) {
      console.log("Configurando evento via window.onload");
      startBtn.onclick = () => {
        console.log("Botão clicado via window.onload!");
        this.startGame();
      };
    } else {
      console.error("Botão start-game-btn não encontrado");
    }
  }


  startGame() {
    console.log("startGame chamado");

    try {
      // Esconder menu inicial
      const startMenu = document.getElementById("start-menu");
      const gameBoard = document.getElementById("game-board");

      if (startMenu && gameBoard) {
        startMenu.style.display = "none";
        gameBoard.style.display = "block";

        // Criar instância do jogo
        game = new Game();

        // Configurar event listeners para os botões
        const fusionBtn = document.getElementById("fusion-btn");
        const clearFusionBtn = document.getElementById("clear-fusion-btn");
        const summonBtn = document.getElementById("summon-btn");
        const attackBtn = document.getElementById("attack-btn");
        const endTurnBtn = document.getElementById("end-turn-btn");

        if (fusionBtn) fusionBtn.onclick = () => game.attemptFusion();
        if (clearFusionBtn) clearFusionBtn.onclick = () => game.clearFusion();
        if (summonBtn) summonBtn.onclick = () => game.summonSelected();
        if (attackBtn) attackBtn.onclick = () => game.enterBattlePhase();
        if (endTurnBtn) endTurnBtn.onclick = () => game.endTurn();

      } else {
        console.error("Elementos do DOM não encontrados");
      }
    } catch (error) {
      console.error("Erro ao iniciar o jogo:", error);
      alert("Erro ao iniciar o jogo: " + error.message);
    }
  }

  destroy() {
    game = null;
  }
}
