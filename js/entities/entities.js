game.PlayerPac = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, "init", [x, y, {
                image: 'YPacman',
                width: 40,
                height: 40,
                spritewidth: "40",
                spriteheight: "40",
                getShape: function() {
                    return (new me.Rect(0, 0, 40, 40)).toPolygon();
                }

            }]);
        this.addAnimation();
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.renderable.setCurrentAnimation("idle");
    },
    addAnimation: function(){
        this.renderable.addAnimation("idle", [0]);
        this.renderable.addAnimation("walk", [1, 2], 80);
    },
     update: function(delta) {
        this.now = new Date().getTime();
        this.dead = this.checkIfDead();
        this.checkKeyPressedAndMove();       
        this.setAnimation();  
                    
        me.collision.check(this, true, this.collideHandler.bind(this), true);
        this._super(me.Entity, "update", [delta]);
        this.body.update(delta);
        return true;
    },
     checkKeyPressedAndMove: function(){
         if (me.input.isKeyPressed("right")) {
          this.moveRight();
        } else if (me.input.isKeyPressed('Left')) {
          this.moveLeft();
        } else {
            this.body.vel.x = 0;
        }
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
    }
    
    
    
});