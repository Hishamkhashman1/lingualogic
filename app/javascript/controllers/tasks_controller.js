import { Controller } from "@hotwired/stimulus"
import * as PhaserNS from "phaser"

// Connects to data-controller="tasks"
export default class extends Controller {
  static values = {
    // images
    taskName: String,
    assets: Object,

    // rewards
    rewardExp: Number,
    rewardItem1: String,
    rewardItem2: String,
    rewardMoney: Number,
    rewardEnergy: Number,
    rewardHealth: Number,
    completed: Number
  }

  static targets = [ 'messagebox', 'message', 'info', 'rewardsclaim', 'modalmessage', 'modalinfo' ]

  connect() {
    console.log("Stimulus connected")
    const Phaser = PhaserNS.default || PhaserNS;

    // from now on use controller. to refer to stimulus controller instead of this.
    const controller = this

    this.TASK_GAME = null;
    this.TASK_SCENE = null;

    let task_status = false;
    let rewards_claimed = false;

    // check if task completed and rewards claimed on load of task
    if (controller.completedValue == 2) {
      rewards_claimed = true;
    }

    //above is same for every task, below is task dependent

    const mount = document.getElementById("task-phaser");
    if (!mount) return;

    const codeEl = document.getElementById("task-code");
    const runBtn = document.getElementById("task-run");
    const outputEl = document.getElementById("task-output");
    const challengeEl = document.getElementById("task-mini-challenge");

    if (this.TASK_GAME) {
      try { this.TASK_GAME.destroy(true); } catch (e) { }
      this.TASK_GAME = null;
    }

    mount.innerHTML = "";
    if (outputEl) outputEl.textContent = "";
    this.TASK_SCENE = null;

    const W = mount.clientWidth || 520;
    const H = mount.clientHeight || 360;
    const MOVE_STEP = 40;
    const COMMAND_DELAY = 500;
    const COMMAND_DELAY_P = 1000;

    const log = (message) => {
      if (!outputEl) return;
      outputEl.textContent += `${message}\n`;
      outputEl.scrollTop = outputEl.scrollHeight;
    };

    const setOutput = (message) => {
      if (!outputEl) return;
      outputEl.textContent = message ? `${message}\n` : "";
      outputEl.scrollTop = outputEl.scrollHeight;
    };

    //parseCommands

    const initMiniChallenge = () => {
      if (!challengeEl) return null;
      const blockEls = Array.from(challengeEl.querySelectorAll(".task-block"));
      const slotEls = Array.from(challengeEl.querySelectorAll(".task-slot"));
      const slotMap = {};
      slotEls.forEach((slot) => {
        slotMap[slot.dataset.slot] = slot;
        slot.ondragover = (event) => {
          event.preventDefault();
          if (event.dataTransfer) event.dataTransfer.dropEffect = "copy";
        };
        slot.ondrop = (event) => {
          event.preventDefault();
          const value = event.dataTransfer ? event.dataTransfer.getData("text/plain") : "";
          if (!value) return;
          slot.dataset.value = value;
          slot.textContent = value;
        };
      });

      blockEls.forEach((block) => {
        block.ondragstart = (event) => {
          if (!event.dataTransfer) return;
          event.dataTransfer.setData("text/plain", block.dataset.value || "");
          event.dataTransfer.effectAllowed = "copy";
        };
      });

      const getSlotValue = (slotId) => {
        const slot = slotMap[slotId];
        return slot ? (slot.dataset.value || "") : "";
      };

      return { getSlotValue, slotEls };
    };

    const miniChallenge = initMiniChallenge();


    //PhaserJS starts here

    //Task Scene goes here

    //use same config for each task, just change the TaskScene
    const config = {
      type: Phaser.AUTO,
      parent: "task-phaser",
      width: W,
      height: H,
      backgroundColor: "#07161f",
      pixelArt: true,
      scene: [TaskScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 50 },
          debug: false
        }
      }
    };

    this.TASK_GAME = new Phaser.Game(config);

    // PhaserJS ends here above

    if (runBtn && codeEl) {
      runBtn.onclick = () => {
        console.log("Clicked button!")
        if (!this.TASK_SCENE) return;
        setOutput("");

        if (miniChallenge && miniChallenge.slotEls.length) {
          const required = [
            { slot: "1", value: "isRunning" },
            { slot: "2", value: "queue.length" },
            { slot: "3", value: "executeMove()" },
            { slot: "4", value: "executeJump()" },
          ];

          const missing = required.some((rule) => !miniChallenge.getSlotValue(rule.slot));
          if (missing) {
            setOutput("Fill all blanks.");
            return;
          }

          const correct = required.every((rule) => miniChallenge.getSlotValue(rule.slot) === rule.value);
          if (!correct) {
            setOutput("Hint: one blank checks if commands are left.");
            return;
          }

          setOutput("Correct! Running...");
        }

        const commands = parseCommands(codeEl.value || "", (message) => setOutput(message));
        if (!commands) return;
        this.TASK_SCENE.runCommands(commands);
      };
    }
  }
}
