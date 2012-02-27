(function() {
    var GameView = Backbone.View.extend({
        el: 'body',
        combatZone: '#combat-zone',
        scoreZone: '#score-zone',

        bombermans: {},

        socket: {},

        initialize: function(socket) {
            this._ensureCombatZone();
            this._ensureScoreZone();

            this.bombermans = new Bombermans();

            this.socket = socket;

            var name = prompt('Who are you ?');
            this.socket.emit('subscribe', { name: name });

            this._bindToSocket('connected', function(data) {
                this.bombermans.add(data.players);
            });

            this._bindToSocket('player:new', function(data) {
                this.bombermans.add(new Bomberman(data.player));
            });

            this.bombermans.bind('add', this.addOne, this);
            this.bombermans.bind('reset', this.addAll, this);
        },

        /**
         * Create a bomberman view for a bomberman
         * and add the rendered template to the combat zone.
         *
         * @param bomberman
         */
        addOne: function(bomberman) {
            var view = new BombermanView({model: bomberman});
            this.$combatZone.append(view.render().$el);
            this.$scoreZone.append($('<li/>', { 'text': view.model.get('name') }));
        },

        /**
         * Add all bombermans to the game.
         */
        addAll: function() {
            this.bombermans.each(this.addOne, this);
        },

        /**
         * Set the combat zone.
         *
         * @param element
         */
        setCombatZone: function(element) {
            this.$combatZone = this.$(element);
            this.combatZone = this.$combatZone[0];
        },

        /**
         * Set the score zone.
         *
         * @param element
         */
        setScoreZone: function(element) {
            this.$scoreZone = this.$(element);
            this.scoreZone = this.$scoreZone[0];
        },

        /**
         * Render the game.
         */
        render: function() {
            this.renderScoreZone();
            this.renderCombatZone();
        },

        /**
         * Render the score zone.
         */
        renderScoreZone: function() {
            this.$el.append(this.$scoreZone);
        },

        /**
         * Render the combat zone.
         */
        renderCombatZone: function() {
            this.$el.append(this.$combatZone);
        },

        /**
         * Initialize the combat zone element.
         */
        _ensureCombatZone: function() {
            this.setCombatZone(this.combatZone);
        },

        /**
         * Initialize the score zone.
         */
        _ensureScoreZone: function () {
            this.setScoreZone(this.scoreZone);
        },

        /**
         * Bind an event on the socket object.
         * It uses internally $.proxy to affect
         * a context to the event.
         *
         * @param eventName
         * @param callback
         * @param context
         */
        _bindToSocket: function(eventName, callback, context) {
            if (typeof context === 'undefined') {
                context = this;
            }

            this.socket.on(eventName, $.proxy(callback, context));
        }
    });

    this.GameView = GameView;
}).call(this);