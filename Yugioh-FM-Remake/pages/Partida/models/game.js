// game.js - Versão atualizada com sistema de turnos refatorado

import { CardDatabase } from "./card.js";
import { FusionSystem } from "./fusionSystem.js";
import { Deck } from "./deck.js";
import { Player } from "./player.js";
import { AIPlayer } from "./aiPlayer.js";
import { TurnSystem } from "./turnSystem.js";

export class Game {
  constructor() {
    this.cardDatabase = new CardDatabase();
    this.fusionSystem = new FusionSystem();
    this.player = new Player("Jogador");
    this.opponent = new AIPlayer("Oponente");
    this.turnSystem = new TurnSystem(this);
    this.selectedCard = null;
    this.selectedOpponentCard = null;
    this.fusionCards = [];
    this.gameOver = false;

    this.initGame();
  }

  initGame() {

    this.player.deck = new Deck(this.cardDatabase, false);
    this.opponent.deck = new Deck(this.cardDatabase, true);


    for (let i = 0; i < 4; i++) {
      this.player.drawCard();
      this.opponent.drawCard();
    }

    this.turnSystem.currentPlayer = this.player;
    this.updateUI();

    this.turnSystem.executeCurrentPhase();

    // ESC para remover seleções
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.selectedCard = null;
        this.selectedOpponentCard = null;
        this.updateUI();
      }
    });
  }

  // Métodos de batalha simplificados
  attackMonster(attackerCard, targetCard) {
    const currentPhaseName = this.turnSystem.getCurrentPhaseName();
    if (currentPhaseName !== "battle") return;

    this.battleMonsters(attackerCard, targetCard);
  }

  battleMonsters(attacker, defender) {
    const damage = Math.abs(attacker.attack - defender.attack);

    if (attacker.attack > defender.attack) {
      this.removeMonsterFromField(defender);
      defender.owner.takeDamage(damage);
      this.log(`${attacker.name} destruiu ${defender.name}! ${defender.owner.name} perdeu ${damage} LP.`);
    } else if (attacker.attack < defender.attack) {
      this.removeMonsterFromField(attacker);
      attacker.owner.takeDamage(damage);
      this.log(`${defender.name} destruiu ${attacker.name}! ${attacker.owner.name} perdeu ${damage} LP.`);
    } else {
      this.removeMonsterFromField(attacker);
      this.removeMonsterFromField(defender);
      this.log(`${attacker.name} e ${defender.name} se destruíram mutuamente!`);
    }

    this.checkGameEnd();
    this.updateUI();
  }

  directAttack(attackerCard, target) {
    target.takeDamage(attackerCard.attack);
    this.log(`${attackerCard.name} atacou diretamente! ${target.name} perdeu ${attackerCard.attack} LP.`);
    this.checkGameEnd();
    this.updateUI();
  }

  removeMonsterFromField(card) {
    const owner = card.owner;
    const fieldIndex = owner.field.indexOf(card);
    if (fieldIndex > -1) {
      owner.field[fieldIndex] = null;
    }
  }

  // Métodos de controle de jogo simplificados
  checkGameEnd() {
    if (this.player.lifePoints <= 0) {
      this.endGame(this.opponent);
    } else if (this.opponent.lifePoints <= 0) {
      this.endGame(this.player);
    } else if (this.player.deck.isEmpty() && this.player.hand.length === 0) {
      this.endGame(this.opponent);
    } else if (this.opponent.deck.isEmpty() && this.opponent.hand.length === 0) {
      this.endGame(this.player);
    }
  }

  endGame(winner) {
    this.gameOver = true;
    this.log(`🎉 ${winner.name} venceu o duelo! 🎉`);
  }

  getOpponentOf(player) {
    return player === this.player ? this.opponent : this.player;
  }

  log(message) {
    const logElement = document.getElementById("battle-log");
    if (logElement) {
      const div = document.createElement("div");
      div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
      logElement.appendChild(div);
      logElement.scrollTop = logElement.scrollHeight;
    } else {
      console.log(message);
    }
  }

  // UI Methods - simplificados pois os comportamentos agora estão nas fases
  updateUI() {
    // Atualizar LP
    const playerLPElement = document.getElementById("player-lp");
    const opponentLPElement = document.getElementById("opponent-lp");
    const playerDeckCountElement = document.getElementById("player-deck-count");
    const opponentDeckCountElement = document.getElementById("opponent-deck-count");
    if (playerLPElement) playerLPElement.textContent = this.player.lifePoints;
    if (opponentLPElement) opponentLPElement.textContent = this.opponent.lifePoints;
    if (playerDeckCountElement) playerDeckCountElement.textContent = this.player.deck.cards.length;
    if (opponentDeckCountElement) opponentDeckCountElement.textContent = this.opponent.deck.cards.length;

    // Atualizar fase e turno
    const currentPhaseElement = document.getElementById("current-phase");
    const currentTurnElement = document.getElementById("current-turn");
    if (currentPhaseElement) currentPhaseElement.textContent = this.turnSystem.getPhaseDisplay();
    if (currentTurnElement) currentTurnElement.textContent = this.turnSystem.currentPlayer.name;

    // Atualizar mão do jogador
    this.updatePlayerHand();

    // Atualizar campos
    this.updatePlayerField();
    this.updateOpponentField();

    // Atualizar contador de cartas do oponente
    const opponentHandCountElement = document.getElementById("opponent-hand-count");
    if (opponentHandCountElement) opponentHandCountElement.textContent = this.opponent.hand.length;

    // Atualizar área de fusão
    this.updateFusionArea();
  }

  updatePlayerHand() {
    const handElement = document.getElementById("player-hand");
    if (!handElement) return;

    handElement.innerHTML = "";

    this.player.hand.forEach((card) => {
      const cardDiv = this.createCardElement(card, true);
      handElement.appendChild(cardDiv);
    });
  }

  updatePlayerField() {
    const fieldElement = document.getElementById("player-field");
    if (!fieldElement) return;

    const slots = fieldElement.querySelectorAll(".card-slot");

    slots.forEach((slot, index) => {
      slot.innerHTML = "";
      if (this.player.field[index]) {
        const cardDiv = this.createCardElement(this.player.field[index], false);
        slot.appendChild(cardDiv);
      }
    });
  }

  updateOpponentField() {
    const fieldElement = document.getElementById("opponent-field");
    if (!fieldElement) return;

    const slots = fieldElement.querySelectorAll(".card-slot");

    slots.forEach((slot, index) => {
      slot.innerHTML = "";
      if (this.opponent.field[index]) {
        const cardDiv = this.createCardElement(this.opponent.field[index], false, true);
        slot.appendChild(cardDiv);
      }
    });
  }

  updateFusionArea() {
    const fusionElement = document.getElementById("fusion-area");
    if (!fusionElement) return;

    fusionElement.innerHTML = "";
    if (!this.turnSystem.currentPhase.fusionCards) return;

    this.turnSystem.currentPhase.fusionCards.forEach((card) => {
      const cardDiv = this.createCardElement(card, false);
      fusionElement.appendChild(cardDiv);
    });
  }

  createCardElement(card, isInHand, isOpponent = false) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "yugioh-card";
    cardDiv.dataset.id = card.uniqueIdDeck;
    cardDiv.innerHTML = `
      <div class="fw-bold text-truncate" style="font-size: 12px;">${card.name}</div>
      <div class="d-flex justify-content-between align-items-center" style="font-size: 12px;">
        <div class="text-danger" style="font-size: 10px;">ATK: ${card.attack}</div>
        <div class="text-primary" style="font-size: 10px;">DEF: ${card.defense}</div>
      </div>
      <div class="text-muted" style="font-size: 12px;">${card.attribute}</div>
      <div class="text-secondary" style="font-size: 12px;">${card.monsterType}</div>
    `;

    if (this.turnSystem.currentPhase.selectedCard === card) {
      cardDiv.classList.add("selected");
    }

    //adicionando classe se a carta etiver na lista de fusão

    if (this.turnSystem.currentPhase.fusionCards && this.turnSystem.currentPhase.fusionCards.includes(card)) {
      cardDiv.classList.add("in-fusion");
      // Adicionando numero da ordem de fusão
      const fusionIndex = this.turnSystem.currentPhase.fusionCards.indexOf(card) + 1;
      cardDiv.innerHTML += `
        <div class="fusion-indicator" style="font-size: 15px">🔥 ${fusionIndex}</div>
      `;
    }

    return cardDiv;
  }
}