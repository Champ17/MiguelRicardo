
/* Game namespace */
var game = {
    // an object where to store game information
    data: {
        // score
        score: 0,
        playerHealth: 10,
        playerMoveSpeed: 5,
        playerAttack: 1,
        playerAttackTimer: 1000,
        player: ""
    },
    // Run on page load.
    "onload": function() {
        // Initialize the video.
        if (!me.video.init("screen", me.video.CANVAS, 1067, 600, true, 'auto')) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // add "#debug" to the URL to enable the debug Panel
        if (document.location.hash === "#debug") {
            window.onReady(function() {
                me.plugin.register.defer(this, debugPanel, "debug");
            });


        }
        me.state.NEW = 113;
        me.state.LOAD = 114;

        // Initialize the audio.
        me.audio.init("mp3");

        // Set a callback to run when loading is complete.
        me.loader.onload = this.loaded.bind(this);

        // Load the resources.
        me.loader.preload(game.resources);

        // Initialize melonJS and display a loading screen.
        me.state.change(me.state.LOADING);
    },
    // Run on game resources loaded.
    "loaded": function() {
        me.pool.register("player", game.PlayerPac, true);

        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.NEW, new game.NewProfile());
        me.state.set(me.state.LOAD, new game.LoadProfile());


        // Start the game.
        me.state.change(me.state.PLAY);
    }
};
