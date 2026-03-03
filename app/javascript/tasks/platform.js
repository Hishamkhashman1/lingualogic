// import Phaser from 'phaser'

console.log("Phaser loaded")

const config = {
width: 300,
height: 300,
backgroundColor: 0x000000, //hex, JS requires 0xhex prefix
parent: 'task-phaserjs-2',
scene: {
  preload,
  create,
  update
},

physics: {
  default: 'arcade',
  arcade: {
    gravity: {y: 100 },
    debug: false
  }

}
}


function preload() {
  this.load.image('test', 'https://res.cloudinary.com/dy23qnruf/image/upload/v1769078637/development/215wus6bl7ta3g3e1m2htd97cg2z.png')

  this.load.image('spark', 'https://cdn.phaserfiles.com/v355/assets/particles/blue.png');
  this.load.atlas('flares', 'https://cdn.phaserfiles.com/v35/5assets/particles/flares.png', 'assets/particles/flares.json');
  this.load.image('red', 'https://labs.phaser.io/assets/particles/red.png');
}

let test_image
let crash_cat
let test_text
let emotion

let keyControl

function create() {
  test_text = this.add.text(150, 150, 'test')

  test_image = this.physics.add.image(150, 150, 'test')
  test_image.scale = 0.1;
  test_image.setVelocityX(100)
  test_image.setVelocityY(0)
  test_image.setBounce(1,1)
  test_image.setCollideWorldBounds(true)

  crash_cat = this.physics.add.image(150,300, 'test')
  crash_cat.setCollideWorldBounds(true)
  crash_cat.scale = 0.1


  //particles test
  var particlesTest = this.add.particles(0, 0, 'red', {
    speed: 100,
    scale: { start: 0.5, end: 0.1 },
    blendMode: 'ADD',
    tint: 0x22BBDD,
    lifespan: 1000
  });

  particlesTest.startFollow(test_image);

  var particlesCollide = this.add.particles(crash_cat.x, crash_cat.y - 20, 'red', {
    speed: 50,
    scale: {start: 0.5, end: 0.05},
    lifespan: 500,
    blendMode: 'ADD',
    duration: 5000,
    emitting: false
  });

  this.physics.add.collider(test_image, crash_cat, () => {
    particlesCollide.start();
  })

  // var particlesCollideStart = { particlesCollide.emitParticleAt(9,9) };

  this.input.on('pointerdown', () => {

            particlesCollide.start();

        });


  // this.imageContainer = this.add.container(test_image, emotion)

  // keyControl = this.input.createCursorKeys()

  // emotion = this.add.text(this.test_image.x,this.test_image.y+50, " :) ")

}


function update() {
  // this.input.keyboard.on('keydown-A', (event) => { test_image.x -=5 });
  // this.input.keyboard.on('keydown-D', (event) => { test_image.x +=5 });
  // this.input.keyboard.on('keydown-W', (event) => { test_image.y +=5 });
  // this.input.keyboard.on('keydown-S', (event) => { test_image.y -=5 });

  // if (keyControl.left.isDown) {
  //   test_image.setVelocityX(-100)}
  // else if(keyControl.right.isDown)
  //   {test_image.setVelocityX(100)}



  // test_image.x += 1
  // test_image.y += 1
  // test_image.angle += 1
  // test_image.setCollideWorldBounds(true)
  // test_image.setBounce(1,1)
  // test_text.body.setVelocityX(10)

  // this.emotion.x = (test_image.x);
  // this.emotion.y = (test_image.y + 10);

  // this.imageContainer.x = this.test_image.x
  // this.imageContainer.y = this.test_image.y
}

const game = new Phaser.Game(config)
