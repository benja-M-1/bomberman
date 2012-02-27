(function() {
    var BombermanView = Backbone.View.extend({
        tagName: 'div',
        model: Bomberman,

        render: function() {
            this.$el.attr({'id': this.model.get('id')});
            this.$el.text(this.model.get('name'));
            this.$el.css({ 'background-color': '#FF9900' });

            return this;
        }
    });

    this.BombermanView = BombermanView;
}).call(this);