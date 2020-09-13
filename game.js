const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    heigth: 800,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
      preload,
      create,
      update,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 0 },
      },
    }
  };
  
  const game = new Phaser.Game(config);
  
  function preload() {
    // Image layers from Tiled can't be exported to Phaser 3 (as yet)
    // So we add the background image separately
    this.load.image('background', 'assets/images/background.png');
    // Load the tileset image file, needed for the map to know what
    // tiles to draw on the screen
    this.load.image('tiles', 'assets/tilesets/tileset.png');
    // Even though we load the tilesheet with the spike image, we need to
    // load the Spike image separately for Phaser 3 to render it
    this.load.image('spike', 'assets/images/spike.png');
    // Load the export Tiled JSON
    this.load.tilemapTiledJSON('map', 'assets/tilemaps/mapa1.json');
    // Load player animations from the player spritesheet and atlas JSON
    this.load.atlas('player', 'assets/images/tilemap_personaje.png',
      'assets/images/tilemap_personaje_atlas.json'); 
  
  }
  
  function create() {
    // Create a tile map, which is used to bring our level in Tiled
    // to our game world in Phaser
    const map = this.make.tilemap({ key: 'map' });
    // Add the tileset to the map so the images would load correctly in Phaser
    const tileset = map.addTilesetImage('kenny_simple_platformer', 'tiles');
    // Place the background image in our game world
    const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
    // Scale the image to better match our game's resolution
    backgroundImage.setScale(4 , 4);
    // Add the platform layer as a static group, the player would be able
    // to jump on platforms like world collisions but they shouldn't move
    const platforms = map.createStaticLayer('Platforms', tileset, 0, 0);
    // There are many ways to set collision between tiles and players
    // As we want players to collide with all of the platforms, we tell Phaser to
    // set collisions for every tile in our platform layer whose index isn't -1.
    // Tiled indices can only be >= 0, therefore we are colliding with all of
    // the platform layer
    platforms.setCollisionByExclusion(-1, true);
  
    // Add the player to the game world
    this.player = this.physics.add.sprite(448, 448, 'player');
    this.player.setCollideWorldBounds(true); // don't go out of the map
    this.physics.add.collider(this.player, platforms);
  
    // Create the walking animation using the last 2 frames of
    // the atlas' first row
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNames('player', {
        prefix: 'robo_player_',
        start: 2,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1
    });
  
    // Create an idle animation i.e the first frame
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 'robo_player_0' }],
      frameRate: 10,
    });
  
 
  
    // Enable user input via cursor keys
    this.cursors = this.input.keyboard.createCursorKeys();
  
  }
  

  
  function update() {
    // Control the player with left or right keys
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-200);
      if (this.player.body.onFloor()) {
        this.player.play('walk', true);
      }
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(200);
      if (this.player.body.onFloor()) {
        this.player.play('walk', true);
      }
    } else if (this.cursors.up.isDown) {
      this.player.setVelocityY(-200);
      if (this.player.body.onFloor()) {
        this.player.play('walk' , true);
      }
    } else if (this.cursors.down.isDown) {
      this.player.setVelocityY(200);
      if (this.player.body.onFloor()) {
        this.player.play('walk', true);
      }

    } else {
      // If no keys are pressed, the player keeps still
      this.player.setVelocityX(0);
      // Only show the idle animation if the player is footed
      // If this is not included, the player would look idle while jumping
      if (this.player.body.onFloor()) {
        this.player.play('idle', true);
      }
    }
  
    
  
    // If the player is moving to the right, keep them facing forward
    if (this.player.body.velocity.x > 0) {
      this.player.setFlipX(false);
    } else if (this.player.body.velocity.x < 0) {
      // otherwise, make them face the other side
      this.player.setFlipX(true);
    }
  }
  