// import Phaser from 'phaser'

console.log("Phaser loaded")

const config = {
width: 300,
height: 300,
backgroundColor: 0x000000, //hex, JS requires 0xhex prefix
parent: 'task-phaserjs',
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

            // this.load.setBaseURL('https://labs.phaser.io');

            // this.load.image('sky', 'assets/skies/space3.png');
            // this.load.image('logo', 'assets/sprites/phaser3-logo.png');
            // this.load.image('red', 'assets/particles/red.png');
}

let test_text
let test_image

function create() {
  test_text = this.add.text(150, 150, 'test')

  test_image = this.physics.add.image(150, 150, 'test')
  test_image.scale = 0.1;
  test_image.setVelocityX(100)
  test_image.setVelocityY(100)
  test_image.setBounce(1,1)
  test_image.setCollideWorldBounds(true)
}

function update() {
  // test_image.x += 1
  // test_image.y += 1
  test_image.angle += 1
  // test_image.setCollideWorldBounds(true)
  // test_image.setBounce(1,1)
  // test_text.body.setVelocityX(10)
}

const game = new Phaser.Game(config)
