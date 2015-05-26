game.PlayerPac = me.Entity.extend(   {
    init: function(x, y, settings) {
           this.setSuper();
           this.setPlayerTimer();     
           this.type = "PlayerPac";
           this.setAttributes();
           this.setFlags();
           this.alwaysUpdate = true;
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        //Keep track of  which direction  your character  is going
        
        this.addAnimation();
               
        this.renderable.setCurrentAnimation("idle");
    },
    
    setSuper: function(x, y){
          this._super(me.Entity, 'init', [x, y, {
                image: "player",
                width: 40,
                height: 40,
                spritewidth: "40",
                spriteheight: "40",
                getShape: function() {
                    return(new me.Rect(0, 0, 40, 40)).toPolygon();
                }

            }]);
    },
    
    setPlayerTimer: function(){
         this.lastAttack = new Date().getTime();
         this.now = new Date().getTime();
         this.lastHit = this.now;    
    },
    
    setAttributes: function(){
        this.health = game.data.playerHealth;
        this.body.setVelocity(game.data.playerMoveSpeed, 20);
        this.attack = game.data.playerAttack;
    },
    
    setFlags: function(){
        this.facing = "right";      
        this.dead = false;
        this.attacking = false;
    },
    
    addAnimation: function(){
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("walk", [1, 2], 80);
    },
    
    update: function(delta) {
         console.log(this.pos.x);
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressedAndMove();       
        this.setAnimation();  
       
                    
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this._super(me.Entity, "update", [delta]);
        this.body.update(delta);
        return true;
    },
    
    checkIfDead: function(){
        if(this.health <= 0){
            return true;    
        }
        return false;
    },
    
    checkKeyPressedAndMove: function(){
         if (me.input.isKeyPressed("right")) {
          this.moveRight();
        } else if (me.input.isKeyPressed('Left')) {
          this.moveLeft();
        } else {
            this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed('jump')) {
           this.jump();
            }
           this.attacking = me.input.isKeyPressed("attack");
        },

    moveRight: function(){
       //add to the position of my x by the velocity defined ablove in 
            //setVelocity() and multiplying it by me.timer.tick.
            //me.timer.tick makes the movement look smooth.
            this.body.vel.x += this.body.accel.x * me.timer.tick;
            this.facing = "right";
            this.flipX(true);   
    },
    
    moveLeft: function(){
            this.flipX(false);
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            this.facing = "left";
    },
    
    jump: function(){
       // make sure we are not already jumping or falling
            if (!this.body.jumping && !this.body.falling) {
                // set current vel to the maximum defined value
                // gravity will then do the rest
                this.body.vel.y = -this.body.maxVel.y * me.timer.tick;
                // set the jumping flag
                this.body.jumping = true;
                // play some audio 
                me.audio.play("jump");  
            }
        },  
        
    setAnimation: function(){
      if (this.attacking) {
            if (!this.renderable.isCurrentAnimation("attack")) {
                //Sets the current animation to attack and once that is over
                //goes back to the idle animation
                this.renderable.setCurrentAnimation("attack", "idle");
                //Makes it so that next time we start the sequence we begin
                //from the first animation, not wherever we left off when we
                //switched to another animation
                this.renderable.setAnimationFrame();
            }
        }
        else if (this.body.vel.x !== 0 && !this.renderable.isCurrentAnimation("attack")) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }

        }else if(!this.renderable.isCurrentAnimation("attack")) {
            this.renderable.setCurrentAnimation("idle");
        }  
    },
    
    loseHealth: function(damage) {
        this.health = this.health - damage;
    },
    
    collideHandler: function(response) {
        if (response.b.type === 'EnemyBaseEntity') {
            this.collideEnemyBase(response);
        }
        else if (response.b.type === 'EnemyCreep') {
            this.collideEnemyCreep(response);
        }
    },
  
    collideEnemyBase: function(response){
            var ydif = this.pos.y - response.b.pos.y;
            var xdif = this.pos.x - response.b.pos.x;
            if (ydif < -40 && xdif < 70 && xdif > -35) {
                this.body.falling = false;
                this.body.vel.y = -1;
            }
            else if (xdif > -35 && this.facing === 'right' && (xdif > 0)) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x - 1;
            } else if (xdif < 70 && this.facing === 'left' && xdif > 0) {
                this.body.vel.x = 0;
                this.pos.x = this.pos.x + 1;
            }
            if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer) {
               
                this.lastHit = this.now;
                response.b.loseHealth(game.data.playerAttack);
            }
        },
        
    collideEnemyCreep: function(response){
           var xdif = this.pos.x - response.b.pos.x;
           var ydif = this.pos.y - response.b.pos.y;
           
           this.stopMovement(xdif);
           
           if(this.checkAttack(xdif, ydif)){
             this.hitCreep(response);          
    }
 },           
    
   stopMovement: function(xdif){
        if (xdif > 0) {
                if (this.facing === "left") {
                    this.body.vel.x = 0;
                }
            } else {
                if (this.facing === "right") {
                    this.body.vel.x = 0;
                }
            }
   },
   
   checkAttack: function(xdif, ydif){
        if (this.renderable.isCurrentAnimation("attack") && this.now - this.lastHit >= game.data.playerAttackTimer
                    && (Math.abs(ydif) <= 40) &&
                    (((xdif > 0) && this.facing === "left") || ((xdif < 0) && this.facing === "right"))
                    ) {
                this.lastHit = this.now;
                return true;
           }
           return false;
        },
        
    hitCreep: function(response){
          if(response.b.health <= game.data.playerAttack){
                    game.data.gold += 1;
                    console.log("Current gold: " + game.data.gold);
                }   
                response.b.loseHealth(game.data.playerAttack);
            } 
  }); 
