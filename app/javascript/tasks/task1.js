import * as PhaserNS from "phaser";

const Phaser = PhaserNS.default || PhaserNS;

let bgOverlayPatched = false;

if (Phaser && !bgOverlayPatched) {
  bgOverlayPatched = true;

  const originalImage = Phaser.Loader.LoaderPlugin.prototype.image;
  Phaser.Loader.LoaderPlugin.prototype.image = function (key, url, xhrSettings) {
    const result = originalImage.call(this, key, url, xhrSettings);
    if (key === "bg" && !this.__bgOverlaysQueued) {
      this.__bgOverlaysQueued = true;
      originalImage.call(this, "bgClouds", "/assets/bg_clouds_overlay.png");
      originalImage.call(this, "bgFalls", "/assets/bg_waterfalls_overlay.png");
    }
    return result;
  };

  const applyOverlays = (scene) => {
    if (scene.__bgOverlaysApplied) return;
    if (!scene.textures.exists("bgClouds") || !scene.textures.exists("bgFalls")) return;

    scene.__bgOverlaysApplied = true;

    const width = scene.scale.width;
    const height = scene.scale.height;

    scene.clouds = scene.add
      .tileSprite(0, 0, width, height, "bgClouds")
      .setOrigin(0, 0)
      .setAlpha(0.35)
      .setDepth(1);

    scene.falls = scene.add
      .tileSprite(0, 0, width, height, "bgFalls")
      .setOrigin(0, 0)
      .setAlpha(0.45)
      .setDepth(1);

    const bg = scene.children.list.find(
      (child) => child.texture && child.texture.key === "bg"
    );
    if (bg?.setDepth) bg.setDepth(0);

    scene.children.list.forEach((child) => {
      if (child === bg || child === scene.clouds || child === scene.falls) return;
      if (child?.setDepth) child.setDepth(2);
    });

    scene.events.on("update", (time, delta) => {
      scene.clouds.tilePositionX += 0.015 * delta;
      scene.falls.tilePositionY += 0.08 * delta;
      scene.falls.setAlpha(0.45 + 0.05 * Math.sin(time / 700));
    });

    scene.scale.on("resize", (gameSize) => {
      scene.clouds.setSize(gameSize.width, gameSize.height);
      scene.falls.setSize(gameSize.width, gameSize.height);
    });
  };

  const scheduleOverlays = (scene) => {
    if (scene.__bgOverlaysScheduled) return;
    scene.__bgOverlaysScheduled = true;

    if (scene.time?.delayedCall) {
      scene.time.delayedCall(0, () => applyOverlays(scene));
    } else {
      scene.events.once("update", () => applyOverlays(scene));
    }
  };

  const originalAddImage = Phaser.GameObjects.GameObjectFactory.prototype.image;
  Phaser.GameObjects.GameObjectFactory.prototype.image = function (x, y, key, frame) {
    const obj = originalAddImage.call(this, x, y, key, frame);
    if (key === "bg") {
      scheduleOverlays(this.scene);
    } else if (this.scene?.__bgOverlaysApplied && obj?.setDepth) {
      obj.setDepth(2);
    }
    return obj;
  };

  const originalAddSprite = Phaser.GameObjects.GameObjectFactory.prototype.sprite;
  Phaser.GameObjects.GameObjectFactory.prototype.sprite = function (x, y, key, frame) {
    const obj = originalAddSprite.call(this, x, y, key, frame);
    if (this.scene?.__bgOverlaysApplied && obj?.setDepth) obj.setDepth(2);
    return obj;
  };

  const originalArcadeImage = Phaser.Physics.Arcade.Factory.prototype.image;
  Phaser.Physics.Arcade.Factory.prototype.image = function (x, y, key, frame) {
    const obj = originalArcadeImage.call(this, x, y, key, frame);
    if (this.scene?.__bgOverlaysApplied && obj?.setDepth) obj.setDepth(2);
    return obj;
  };

  const originalArcadeSprite = Phaser.Physics.Arcade.Factory.prototype.sprite;
  Phaser.Physics.Arcade.Factory.prototype.sprite = function (x, y, key, frame) {
    const obj = originalArcadeSprite.call(this, x, y, key, frame);
    if (this.scene?.__bgOverlaysApplied && obj?.setDepth) obj.setDepth(2);
    return obj;
  };
}
