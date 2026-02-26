// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"
import "@popperjs/core"
import "bootstrap"
import * as PhaserNS from "phaser"
// import "tasks/hello"
// import "tasks/test"
import "tasks/platform"
import "tasks/task1"

const Phaser = PhaserNS.default || PhaserNS;

let TASK_GAME = null;
let TASK_SCENE = null;

function bootTaskPhaser() {
  const mount = document.getElementById("task-phaser");
  if (!mount) return;

  const codeEl = document.getElementById("task-code");
  const runBtn = document.getElementById("task-run");
  const outputEl = document.getElementById("task-output");

  if (TASK_GAME) {
    try { TASK_GAME.destroy(true); } catch (e) {}
    TASK_GAME = null;
  }

  mount.innerHTML = "";
  if (outputEl) outputEl.textContent = "";
  TASK_SCENE = null;

  const W = mount.clientWidth || 520;
  const H = mount.clientHeight || 360;
  const MOVE_STEP = 40;
  const COMMAND_DELAY = 500;

  const log = (message) => {
    if (!outputEl) return;
    outputEl.textContent += `${message}\n`;
    outputEl.scrollTop = outputEl.scrollHeight;
  };

  const parseCommands = (source) => {
    const commands = [];
    const lines = source.split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      const upper = line.toUpperCase();
      if (upper === "MOVE" || upper === "JUMP") {
        commands.push(upper);
      } else {
        log(`Invalid command: ${line}`);
        return null;
      }
    }
    return commands;
  };

  class TaskScene extends Phaser.Scene {
    constructor() {
      super("TaskScene");
      this.startX = 80;
      this.groundY = 0;
      this.isRunning = false;
      this.monster = null;
      this.apple = null;
      //need to make this change successfully
      this.task_success = false;
    }

    preload() {
      this.load.image("bg", "/assets/background_1.png");
      this.load.image("monster", "/assets/pixel-monster-right.png");
      this.load.image("apple", "/assets/apple.png");

      this.load.image("box_transparent", "/assets/transparent_box.png")
      this.load.image("box_pink", "/assets/pink_box.png")
    }

    create() {

      const bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
      bg.setDisplaySize(this.scale.width, this.scale.height);

      this.groundY = this.scale.height - 130;

      this.monster = this.physics.add.image(this.startX, this.groundY - 10, "monster");
      this.monster.setOrigin(0.5, 1);
      this.monster.setScale(0.11);
      this.monster.body.setCircle(this.monster.scale.width * 0.8)

      this.apple = this.physics.add.image(this.scale.width - 30, this.groundY, "apple");
      this.apple.setOrigin(0.7, 1);
      this.apple.setScale(0.06);
      // this.apple.body.setCircle(this.apple.body.scale.width * 1.2)

      this.apple.body.allowGravity = false;

      // this.physics.addCollider(this.monster, this.apple, function (monster, apple) {
      //   this.monster.setVelocityX(0);
      //   this.monster.setVelocityY(0);
      //   this.monster.angle += 180;
      // })

      this.box1 = this.physics.add.image(this.scale.width - 160, this.groundY - 50, "box_pink")
      this.box1.setScale(3)
      this.box2 = this.physics.add.image(this.scale.width - 160, this.groundY - 20, "box_pink")
      this.box2.setScale(3)
      this.box3 = this.physics.add.image(this.scale.width - 130, this.groundY - 20, "box_pink")
      this.box3.setScale(3)
      this.box1.body.allowGravity = false;
      this.box2.body.allowGravity = false;
      this.box3.body.allowGravity = false;
      //added physics
      this.physics.add.collider(this.monster, [this.box1, this.box2, this.box3], function (monster, box) {
        monster.setVelocityX(0);
        monster.setVelocityY(0);
        box.setVelocityX(0)
        box.setVelocityY(0)
      })


      if (this.textures.exists("monster")) {
        this.textures.get("monster").setFilter(Phaser.Textures.FilterMode.NEAREST);
      }
      if (this.textures.exists("apple")) {
        this.textures.get("apple").setFilter(Phaser.Textures.FilterMode.NEAREST);
      }

      TASK_SCENE = this;
    }

    reset() {
      this.isRunning = false;
      this.tweens.killAll();
      if (this.monster) this.monster.setPosition(this.startX, this.groundY);
    }

    runCommands(commands) {
      this.reset();
      if (!commands.length) return;
      this.isRunning = true;
      const queue = commands.slice();

      const runNext = () => {
        if (!this.isRunning) return;
        if (!queue.length) {
          this.isRunning = false;
          return;
        }
        const cmd = queue.shift();
        if (cmd === "MOVE") {
          this.executeMove(runNext);
        } else if (cmd === "JUMP") {
          this.executeJump(runNext);
        }
      };

      runNext();
    }

    executeMove(done) {
      // problem physics-wise is that this teleports the monster instead of moving it
      const targetX = this.monster.x + MOVE_STEP;
      this.monster.setVelocityX(90)
      // this.time.stopMove({
      //   delay: 250,
      //   callback: this.monster.setVelocityX(0)})

      this.tweens.add({
        targets: this.monster,
        // x: targetX,
        // duration: 250,
        ease: "Quad.easeOut",
        onComplete: () => {
          if (this.monster.x >= this.apple.x - 20) {
            // should set success variable here
            this.task_success = true;
            log("Task Complete!");
            log(task_success);
            this.isRunning = false;
            return;
          }
          setTimeout(done, COMMAND_DELAY);
        },
      });
    }

    executeJump(done) {
      this.monster.setVelocityY(-100)
      this.tweens.add({
        targets: this.monster,
        // y: this.groundY - 60,
        // yoyo: true,
        duration: 220,
        ease: "Quad.easeOut",
        onComplete: () => {
          setTimeout(done, COMMAND_DELAY);
        },
      });
    }

    update(){
      //make sure monster doesn't fall through ground
        if (this.monster.y > this.groundY ) {
          this.monster.setVelocityY(0);
          this.monster.y = this.groundY;
      }

        if (this.monster.x == this.apple.x && this.monster.y == this.apple.y) {
          this.monster.setVelocityX(0);
          this.monster.setVelocityY(0);
        }
    }
  }

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
        gravity: {y: 50 },
        debug: false
      }
    }
  };

  TASK_GAME = new Phaser.Game(config);

  if (runBtn && codeEl) {
    runBtn.onclick = () => {
      if (!TASK_SCENE) return;
      if (outputEl) outputEl.textContent = "";
      const commands = parseCommands(codeEl.value || "");
      if (!commands) return;
      TASK_SCENE.runCommands(commands);
    };
  }
}

document.addEventListener("turbo:load", bootTaskPhaser);
document.addEventListener("DOMContentLoaded", bootTaskPhaser);
document.addEventListener("turbo:before-cache", () => {
  if (TASK_GAME) {
    try { TASK_GAME.destroy(true); } catch (e) {}
    TASK_GAME = null;
  }
});
