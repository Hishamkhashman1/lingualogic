import { Controller } from "@hotwired/stimulus"
import * as PhaserNS from "phaser"

// Connects to data-controller="tasks"
export default class extends Controller {
  static values = {
    imgBackground: String,
    imgMonsterRight: String,
    imgApple: String,
    imgTransparentBox: String,
    imgPinkBox: String,
    rewardExp: Number,
    rewardItem1: String,
    rewardItem2: String,
    rewardMoney: Number,
    rewardEnergy: Number,
    rewardHealth: Number,
    completed: Number,
    taskId: Number,
    monsterId: Number,
    monsterHealth: Number
  }

  static targets = [ 'messagebox', 'message', 'info', 'rewardsclaim', 'modalmessage', 'modalinfo' ]

  connect() {
    console.log("Stimulus connected")
    const Phaser = PhaserNS.default || PhaserNS;

    // from now on use controller. to refer to stimuls controller instead of this.
    const controller = this

    this.TASK_GAME = null;
    this.TASK_SCENE = null;

    let task_status = false;
    let rewards_claimed = false;

    const persistCompletion = () => {
      if (!controller.hasTaskIdValue || !controller.hasMonsterIdValue) return;
      try {
        const key = `lingualogic:monster:${controller.monsterIdValue}:task:${controller.taskIdValue}`;
        localStorage.setItem(key, "done");
      } catch (e) {
        // Ignore storage errors (private mode, blocked storage, etc.)
      }
    };

    const persistPrevHealth = () => {
      if (!controller.hasMonsterIdValue || !controller.hasMonsterHealthValue) return;
      try {
        const key = `lingualogic:monster:${controller.monsterIdValue}:prevHealth`;
        localStorage.setItem(key, String(controller.monsterHealthValue));
      } catch (e) {
        // Ignore storage errors
      }
    };

    // check if task completed and rewards claimed on load of task
    if (controller.completedValue == 2) {
      rewards_claimed = true;
    }

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

    const parseCommands = (source, onError) => {
      const commands = [];
      const lines = source.split(/\r?\n/);
      for (let i = 0; i < lines.length; i++) {
        const raw = lines[i];
        const line = raw.trim();
        if (!line) continue;
        const upper = line.toUpperCase();
        if (upper === "MOVE" || upper === "JUMP") {
          commands.push(upper);
        } else {
          if (onError) onError(`Invalid command on line ${i + 1}. Use MOVE/JUMP.`);
          return null;
        }
      }
      return commands;
    };

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
        console.log(controller.imgBackgroundValue)
        // use stimuulus value instead of asset path
        this.load.image("bg", controller.imgBackgroundValue);
        this.load.spritesheet("monster", controller.imgMonsterRightValue, {
          frameWidth:264,
          frameHeight:512,
        }
        );
        this.load.image("apple", controller.imgAppleValue);

        this.load.image("box_transparent", controller.imgTransparentBoxValue)
        this.load.image("box_pink", controller.imgPinkBoxValue)

        //particles
        this.load.image('spark', 'https://cdn.phaserfiles.com/v355/assets/particles/blue.png');
        this.load.atlas('flares', 'https://cdn.phaserfiles.com/v35/5assets/particles/flares.png', 'assets/particles/flares.json');
        this.load.image('red', 'https://labs.phaser.io/assets/particles/red.png');
      }

      create() {

        const bg = this.add.image(0, 0, "bg").setOrigin(0, 0);
        bg.setDisplaySize(this.scale.width, this.scale.height);

        this.groundY = this.scale.height - 135;

        this.monster = this.physics.add.sprite(this.startX, this.groundY - 15, "monster");
        this.monster.setOrigin(0.5, 1);
        this.monster.setScale(0.25);
        // this.monster.body.setCircle(this.monster.scale.width * 0.8)

        this.anims.create({
        key: 'walk', // A unique key to reference the animation
        frames: this.anims.generateFrameNumbers('monster', {
            frames: [0,1,2]
        }),
        frameRate: 2, // Frames per second
        repeat: -1    // -1 means loop forever
        });
        this.monster.play("walk", true);

        this.apple = this.physics.add.image(this.scale.width - 30, this.groundY, "apple");
        this.apple.setOrigin(0.7, 1);
        this.apple.setScale(0.8);
        // this.apple.body.setCircle(this.apple.body.scale.width * 1.2)

        this.apple.body.allowGravity = false;

        // this.physics.addCollider(this.monster, this.apple, function (monster, apple) {
        //   this.monster.setVelocityX(0);
        //   this.monster.setVelocityY(0);
        //   this.monster.angle += 180;
        // })

        this.box1 = this.physics.add.image(this.scale.width - 160, this.groundY - 50, "box_transparent")
        this.box1.setScale(3)
        this.box2 = this.physics.add.image(this.scale.width - 160, this.groundY - 20, "box_transparent")
        this.box2.setScale(3)
        this.box3 = this.physics.add.image(this.scale.width - 130, this.groundY - 20, "box_transparent")
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

        //particle effects

         //particles test
        // var particlesTest = this.add.particles(0, 0, 'red', {
        //   speed: 100,
        //   scale: { start: 0.5, end: 0.1 },
        //   blendMode: 'ADD'
        // });

        // particlesTest.startFollow(this.monster);

        var particlesApple = this.add.particles(this.apple.x -5, this.apple.y -15,'red', {
          speed: 50,
          scale: {start: 0.5, end: 0.1},
          blendMode: 'ADD',
          duration: 1500,
          lifespan: 3000,
          tint: 0x22BB44,
          emitting: false
        })

        // Emit particles if monster and apple touch, only once
        this.physics.add.overlap(this.monster, this.apple, () => {
          if (task_status == false) {
            particlesApple.start();
          }
        })

            //particles end


        if (this.textures.exists("monster")) {
          this.textures.get("monster").setFilter(Phaser.Textures.FilterMode.NEAREST);
        }
        if (this.textures.exists("apple")) {
          this.textures.get("apple").setFilter(Phaser.Textures.FilterMode.NEAREST);
        }

        controller.TASK_SCENE = this;
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
        this.monster.setVelocityX(80)
        setTimeout(done, COMMAND_DELAY_P);
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
              task_status = true;
              persistCompletion();
              log("Task Complete!");
              log(task_success);
              log(task_status);
              this.isRunning = false;
              return;
            }
            setTimeout(done, COMMAND_DELAY);
          },
        });
      }

      executeJump(done) {
        this.monster.setVelocityY(-120)
        setTimeout(done, COMMAND_DELAY_P);
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

      update() {
        //make sure monster doesn't fall through ground
        if (this.monster.y > this.groundY) {
          this.monster.setVelocityY(0);
          this.monster.y = this.groundY;
        }

        //check for task success
        if ((this.monster.x >= this.apple.x - 20) && (this.monster.y >= this.apple.y - 20) && (this.monster.y <= this.apple.y) && (this.task_success == false)) {
          this.monster.setVelocityX(0);
          log("Task Complete!");
          this.task_success = true;
          log(this.task_success);

          task_status = true;
          persistCompletion();
          console.log(task_status);
          console.log(rewards_claimed);

          // success message popup
          controller.messageTarget.innerText = "Task Completed!";
          controller.messageTarget.classList.toggle('success-message');
          controller.infoTarget.innerText = "Rewards:";
          if (controller.rewardExpValue != null && controller.rewardExpValue > 0) {controller.infoTarget.insertAdjacentHTML("beforeend", ` +${controller.rewardExpValue} exp`) };
          if (controller.rewardHealthValue != null && controller.rewardHealthValue > 0) {controller.infoTarget.insertAdjacentHTML("beforeend", ` +${controller.rewardHealthValue} health`) };
          if (controller.rewardEnergyValue != null && controller.rewardEnergyValue > 0) {controller.infoTarget.insertAdjacentHTML("beforeend", ` +${controller.rewardEnergyValue} energy`) };
          if (controller.rewardMoneyValue != null && controller.rewardMoneyValue > 0) {controller.infoTarget.insertAdjacentHTML("beforeend", ` +${controller.rewardMoneyValue} money`) };
          controller.messageboxTarget.classList.toggle('hidden');

          controller.modalmessageTarget.innerHTML = controller.messageTarget.innerHTML;
          controller.modalinfoTarget.innerHTML = controller.infoTarget.innerHTML;

          // hint message popup
          // controller.messageTarget.innerText = "Here's a hint!";
          // controller.messageTarget.classList.toggle('hint-message');
          // controller.infoTarget.innerText = "Try using a combination of MOVE then JUMP commands";
          // controller.messageboxTarget.classList.toggle('hidden');

          return;
        }

        //submit update of rewards when task completed
        if (task_status == true) {
          if (rewards_claimed == false) {
            //submit hidden form that runs the monster_tasks#rewards function to update models with rewards
            console.log("Claiming rewards")
            persistPrevHealth();
            controller.rewardsclaimTarget.requestSubmit();
            rewards_claimed = true;
          }
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

  //message box


  message_success() {

  }

}
