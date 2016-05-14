Utility.Game.addState('winning', {
    update: function () {

    },

    render: function (canvas) {
        // canvas.clear();
        canvas.drawText('A winrar is ' + this.winner.name + ' !!', this.winner.location.add(1), 20, false, 'black');
        canvas.drawText('A winrar is ' + this.winner.name + ' !!', this.winner.location, 20, false, 'red');
    }
});