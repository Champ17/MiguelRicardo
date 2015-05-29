game.PlayScreen = me.ScreenObject.extend({
	/**
	 *  action to perform on state change
	 */
	onResetEvent: function() {
		// reset the score
		game.data.score = 0;
                me.audio.playTrack("PAC");
                
                
                me.levelDirector.loadLevel("level01");
                this.resetPlayer(460, 460);
                console.log('stupid');
                
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
            me.audio.stopTrack();
		// remove the HUD from the game world
		me.game.world.removeChild(this.HUD);
	},
        
    resetPlayer: function(x, y){
        game.data.player = me.pool.pull("player", x, y, {});
        me.game.world.addChild(game.data.player, 500); 
    }    
});
