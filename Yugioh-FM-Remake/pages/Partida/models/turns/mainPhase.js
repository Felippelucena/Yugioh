import { TurnTemplate } from "./turnTemplate.js";

// Fase Principal
export class MainPhase extends TurnTemplate {
  constructor(game) {
    super(game);
    this.name = "main";
    this.displayName = "Principal";
    this.selectedCard = null;
    this.fusionCards = [];
  }

  onEnter() {
    this.game.log(`${this.game.turnSystem.currentPlayer.name} - Fase Principal`);
  }

  setupBehaviors() {
    if (this.game.turnSystem.currentPlayer === this.game.player) {
      this.setupPlayerBehaviors();
    }
    // precionar ESC para remover seleções
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            this.selectedCard = null;
            this.fusionCards = [];
            this.game.updateUI();
        }
        });

  }

  setupPlayerBehaviors() {
    const handContainer = document.getElementById("player-hand");

    if (!handContainer) return;

    // Adicionar um único listener ao contêiner
    handContainer.onclick = (e) => {
      const cardElement = e.target.closest(".yugioh-card");
      if (!cardElement) return;

      const card = this.getCardFromElement(cardElement);
      if (this.fusionCards.length > 0) {
        this.addToFusion(card);
      } else {
        this.selectCard(card);
      }
    };

    handContainer.oncontextmenu = (e) => {
      e.preventDefault();
      const cardElement = e.target.closest(".yugioh-card");
      if (!cardElement) return;

      const card = this.getCardFromElement(cardElement);
      this.createContextMenu(e, [
        {
          label: "Adicionar para fusão",
          action: () => {
            if (this.fusionCards.length < 5) {
              this.addToFusion(card);
            }
          },
        },
      ]);
    };
  }

  summonSelected() {
    if (!this.selectedCard || this.game.turnSystem.currentPlayer !== this.game.player) return;

    const currentPhaseName = this.game.turnSystem.getCurrentPhaseName();
    if (currentPhaseName !== "main") {
      alert("Você só pode invocar na fase principal!");
      return;
    }

    const emptySlot = this.game.player.getEmptyFieldSlot();
    if (emptySlot !== -1) {
      this.game.player.summonMonster(this.selectedCard, emptySlot);
      this.game.log(`Jogador invocou ${this.selectedCard.name} (ATK: ${this.selectedCard.attack})`);
      this.selectedCard = null;
      this.game.turnSystem.nextPhase();
    } else {
      alert("Não há espaços vazios no campo!");
    }
  }

  selectCard(card) {
    if (this.game.turnSystem.currentPlayer !== this.game.player) return;
    this.selectedCard = card;
    this.updateUI();
  }

  addToFusion(card) {
    if (!this.fusionCards.includes(card)) {
      this.fusionCards.push(card);
      this.selectedCard = null;
      this.updateUI();
    } else {
        const index = this.fusionCards.indexOf(card);
        if (index > -1) {
          this.fusionCards.splice(index, 1);
        }
      this.updateUI();
    }
      
  }

  attemptFusion() {
    if (this.fusionCards.length !== 2) {
      alert("Selecione exatamente 2 cartas para fusão!");
      return;
    }

    if (this.turnSystem.currentPlayer !== this.player) return;
    
    const currentPhaseName = this.turnSystem.getCurrentPhaseName();
    if (currentPhaseName !== "main") {
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

  setupButtons() {

    if (this.game.turnSystem.currentPlayer === this.game.player) {
      // Botão Invocar
      this.createButton("summon-btn", "Invocar/Fundir", "btn-game", () => {
        if (this.fusionCards.length > 0) {
            this.attemptFusion();
        } else {
            this.summonSelected();
        }
      });
      /*
      // Botão Fusionar
      this.createButton("fusion-btn", "⚡ Fusionar", "btn-warning", () => {
        this.game.attemptFusion();
      });

      // Botão Limpar Fusão
      this.createButton("clear-fusion-btn", "🗑️ Limpar", "btn-outline-secondary", () => {
        this.game.clearFusion();
      });

      // Botão Batalhar
      this.createButton("attack-btn", "⚔️ Batalhar", "btn-battle", () => {
        this.game.turnSystem.nextPhase(); // Vai para battle phase
      });

      // Botão Finalizar Turno
      this.createButton("end-turn-btn", "⏭️ Finalizar Turno", "btn-outline-primary", () => {
        this.game.turnSystem.goToEndPhase();
      });
      */
    }
  }

  getCardFromElement(cardElement) {
    const cardUniqueIdDeck = Number(cardElement.dataset.id);
    return this.game.player.hand.find((card) => card.uniqueIdDeck === cardUniqueIdDeck);
  }
}
