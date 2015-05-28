game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
                
                
                me.levelDirector.loadLevel("Level02");
                this.resetPlayer(50, 50);
                
                me.input.bindKey(me.input.KEY.LEFT, "Left");
                me.input.bindKey(me.input.KEY.RIGHT, "Right");
                me.input.bindKey(me.input.KEY.UP, "Up");
                me.input.bindKey(me.input.KEY.DOWN, "Down");

		// add our HUD to the game world
		this.HUD = new game.HUD.Container();
		me.game.world.addChild(this.HUD);
	},


	/**
	 *  action to perform when leaving this screen (state change)
	 */
	onDestroyEvent: function() {
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},
        
    resetPlayer: function(x, y){
        game.data.player = me.pool.pull("player", x, y, {});
        me.game.world.addChild(game.data.player, 500); 
    }    
});
