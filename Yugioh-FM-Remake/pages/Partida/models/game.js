import { CardDatabase } from "./card.js";
import { FusionSystem } from "./fusionSystem.js";
import { Deck } from "./deck.js";
import { Player } from "./player.js";
import { AIPlayer } from "./aiPlayer.js";
import { TurnSystem } from "./turnSystem.js";

// Classe principal do jogo
export class Game {
  constructor() {
    this.cardDatabase = new CardDatabase();
    this.fusionSystem = new FusionSystem();
    this.player = new Player("Jogador");
    this.opponent = new AIPlayer("Oponente");
    this.turnSystem = new TurnSystem();
    this.selectedCard = null;
    this.selectedOpponentCard = null;
    this.fusionCards = [];
    this.gameOver = false;

    this.initGame();
  }

  initGame() {
    // Inicializar decks
    this.player.deck = new Deck(this.cardDatabase, false);
    this.opponent.deck = new Deck(this.cardDatabase, true);

    // Distribuir cartas iniciais
    for (let i = 0; i < 5; i++) {
      this.player.drawCard();
      this.opponent.drawCard();
    }

    this.turnSystem.currentPlayer = this.player;
    this.turnSystem.currentPhase = "main1"; // Começar na fase principal
    this.updateUI();

    // se ESC for pressionado, remover seleções
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        this.selectedCard = null;
        this.selectedOpponentCard = null;
        this.updateUI();
      }
    });
  }

  drawPhase() {
    if (this.turnSystem.currentPlayer === this.player) {
      const card = this.player.drawCard();
      if (card) {
        this.log(`Jogador comprou uma carta`);
      } else {
        this.endGame(this.opponent); // Deck vazio
        return;
      }
    } else {
      const card = this.opponent.drawCard();
      if (card) {
        this.log(`Oponente comprou uma carta`);
      } else {
        this.endGame(this.player); // Deck vazio
        return;
      }
    }

    this.turnSystem.nextPhase();
    this.updateUI();

    // Se for turno da IA, executar ações automaticamente
    if (this.turnSystem.currentPlayer === this.opponent) {
      setTimeout(() => {
        this.opponent.makeMove(this);
        this.updateUI();
        setTimeout(() => this.endTurn(), 1000);
      }, 1000);
    }
  }

  selectCard(card) {
    if (this.turnSystem.currentPlayer !== this.player) return;

    this.selectedCard = card;
    this.updateUI();
  }

  summonSelected() {
    if (!this.selectedCard || this.turnSystem.currentPlayer !== this.player) return;
    if (this.turnSystem.currentPhase !== "main1" && this.turnSystem.currentPhase !== "main2") {
      alert("Você só pode invocar na fase principal!");
      return;
    }

    const emptySlot = this.player.getEmptyFieldSlot();
    if (emptySlot !== -1) {
      this.player.summonMonster(this.selectedCard, emptySlot);
      this.log(`Jogador invocou ${this.selectedCard.name} (ATK: ${this.selectedCard.attack})`);
      this.selectedCard = null;
      this.updateUI();
    } else {
      alert("Não há espaços vazios no campo!");
    }
  }

  addToFusion(card) {
    if (this.fusionCards.length < 5 && !this.fusionCards.includes(card)) {
      this.fusionCards.push(card);
      this.updateUI();
    }
  }

  clearFusion() {
    this.fusionCards = [];
    this.updateUI();
  }

  attemptFusion() {
    if (this.fusionCards.length !== 2) {
      alert("Selecione exatamente 2 cartas para fusão!");
      return;
    }

    if (this.turnSystem.currentPlayer !== this.player) return;
    if (this.turnSystem.currentPhase !== "main1" && this.turnSystem.currentPhase !== "main2") {
      alert("Você só pode fusionar na fase principal!");
      return;
    }

    const cardIds = this.fusionCards.map((card) => card.id);
    const fusionResultId = this.fusionSystem.canFuse(cardIds, this.cardDatabase);

    if (fusionResultId) {
      const fusionCard = this.cardDatabase.getCard(fusionResultId).clone();
      fusionCard.owner = this.player;

      // Remover cartas da mão
      this.fusionCards.forEach((card) => {
        const index = this.player.hand.indexOf(card);
        if (index > -1) {
          this.player.hand.splice(index, 1);
        }
      });

      // Adicionar carta fundida à mão
      this.player.hand.push(fusionCard);

      this.log(`Fusão realizada! ${this.fusionCards[0].name} + ${this.fusionCards[1].name} = ${fusionCard.name}`);
      this.clearFusion();
      this.updateUI();
    } else {
      alert("Essas cartas não podem ser fundidas!");
    }
  }

  enterBattlePhase() {
    if (this.turnSystem.currentPlayer !== this.player) return;

    this.turnSystem.currentPhase = "battle";
    this.updateUI();
    alert("Fase de batalha! Clique nos monstros do oponente para atacar.");
  }

  attackMonster(attackerCard, targetCard) {
    if (this.turnSystem.currentPhase !== "battle") return;

    this.battleMonsters(attackerCard, targetCard);
  }

  battleMonsters(attacker, defender) {
    const damage = Math.abs(attacker.attack - defender.attack);

    if (attacker.attack > defender.attack) {
      // Atacante vence
      this.removeMonsterFromField(defender);
      defender.owner.takeDamage(damage);
      this.log(`${attacker.name} destruiu ${defender.name}! ${defender.owner.name} perdeu ${damage} LP.`);
    } else if (attacker.attack < defender.attack) {
      // Defensor vence
      this.removeMonsterFromField(attacker);
      attacker.owner.takeDamage(damage);
      this.log(`${defender.name} destruiu ${attacker.name}! ${attacker.owner.name} perdeu ${damage} LP.`);
    } else {
      // Empate
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

  endTurn() {
    // Trocar jogador
    this.turnSystem.currentPlayer = this.turnSystem.currentPlayer === this.player ? this.opponent : this.player;
    this.turnSystem.currentPhase = "draw";

    this.updateUI();

    // Executar fase de compra
    setTimeout(() => {
      this.drawPhase();
    }, 500);
  }

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
    alert(`${winner.name} venceu o duelo!`);
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

  updateUI() {
    // Atualizar LP
    const playerLPElement = document.getElementById("player-lp");
    const opponentLPElement = document.getElementById("opponent-lp");
    if (playerLPElement) playerLPElement.textContent = this.player.lifePoints;
    if (opponentLPElement) opponentLPElement.textContent = this.opponent.lifePoints;

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

    this.fusionCards.forEach((card) => {
      const cardDiv = this.createCardElement(card, false);
      fusionElement.appendChild(cardDiv);
    });
  }
  createContextMenu(event, options) {
    event.preventDefault();

    // Fechar outros menus de contexto abertos
    const existingMenus = document.querySelectorAll(".context-menu");
    existingMenus.forEach((menu) => menu.remove());

    const contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";
    contextMenu.style.position = "absolute";
    contextMenu.style.top = `${event.pageY}px`;
    contextMenu.style.left = `${event.pageX}px`;
    contextMenu.style.backgroundColor = "#fff";
    contextMenu.style.border = "1px solid #ccc";
    contextMenu.style.padding = "5px";
    contextMenu.style.zIndex = "1000";

    // Adicionar opções ao menu
    options.forEach((option) => {
      const optionElement = document.createElement("div");
      optionElement.textContent = option.label;
      optionElement.style.cursor = "pointer";
      optionElement.onclick = () => {
        option.action();
        if (document.body.contains(contextMenu)) {
          document.body.removeChild(contextMenu);
        }
      };
      contextMenu.appendChild(optionElement);
    });

    document.body.appendChild(contextMenu);

    // Fechar o menu ao clicar fora
    document.addEventListener(
      "click",
      () => {
        if (document.body.contains(contextMenu)) {
          document.body.removeChild(contextMenu);
        }
      },
      { once: true }
    );
  }
  createCardElement(card, isInHand, isOpponent = false) {
    const cardDiv = document.createElement("div");
    cardDiv.className = "yugioh-card";
    cardDiv.innerHTML = `
            <div class="fw-bold text-truncate" style="font-size: 8px;">${card.name}</div>
            <div class="text-danger" style="font-size: 8px;">ATK: ${card.attack}</div>
            <div class="text-primary" style="font-size: 8px;">DEF: ${card.defense}</div>
            <div class="text-muted" style="font-size: 7px;">${card.attribute}</div>
            <div class="text-secondary" style="font-size: 7px;">${card.monsterType}</div>
        `;

    if (this.selectedCard === card ) {
      cardDiv.classList.add("selected");
    }

    if (isInHand && !isOpponent && this.turnSystem.currentPhase === "main1") {
      cardDiv.oncontextmenu = (event) => {
        this.createContextMenu(event, [
          {
            label: "Adicionar para fusão",
            action: () => {
              if (this.fusionCards.length < 5 && !this.fusionCards.includes(card)) {
                this.addToFusion(card);
              }
            },
          },
        ]);
      };

      cardDiv.onclick = () => {
        if (this.fusionCards.length > 0 && this.fusionCards.length < 5) {
          if (!this.fusionCards.includes(card)) {
            this.addToFusion(card);
          }
        } else {
          this.selectCard(card);
        }
      };
    }

    if (!isInHand && !isOpponent && this.turnSystem.currentPhase === "battle") {
      cardDiv.style.cursor = "pointer";
      cardDiv.onclick = () => {
          this.selectCard(card);
      };
    }
    if (isOpponent) {
      if (this.turnSystem.currentPhase === "battle" && this.selectedCard) {
      cardDiv.onclick = () => {
          if (this.selectedOpponentCard === card) {
            this.attackMonster(this.selectedCard, card);
            this.selectedCard = null;
            this.selectedOpponentCard = null;
          } else {
            this.selectedOpponentCard = card;
            console.log(this.selectedOpponentCard);
            cardDiv.classList.add("selected");
          }
        };
      }
    }
    return cardDiv;
  }
}
