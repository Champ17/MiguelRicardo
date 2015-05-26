game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        //init = constructor
        this.setSuper();
        //calls set super function
        this.setPlayerTimers();
        this.setAttributes();
        this.type = 'Pacman';
        //sets a type for the player
        this.setFlags();

        this.addAnimation();
        //starts add animation function
    },
    setSuper: function(x, y) {
        this._super(me.Entity, 'init', [x, y, {
                image: "pacman",
                width: 64,
                height: 64,
                spritewidth: "64",
                spriteheight: "64",
                //spritewidth and spriteheight passes us the main information
                getShape: function() {
                    return(new me.Rect(0, 0, 64, 64)).toPolygon();
                    //rectangle of what player entity can walk into/polygon
                }
                //spawns player into world
            }]);
        //_super = reaching to the constructor of entity
    }
});