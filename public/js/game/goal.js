var createGoal = function (index) {
  var goal = new Utility.Sprite();
  goal.size = new Utility.Vector2(32, 32);
  goal = Utility.Sprite.animatable(goal);
  goal.getBounds = function () {
    return this.getDrawRect();
  }
  
  var src_rekt = new Utility.Rectangle(128, 192, 32, 32);
  if (index === 1) {
    src_rekt = new Utility.Rectangle(160, 192, 32, 32);
  }
  goal.animation.add('default', {
    speed: 0,
    frames: [
      src_rekt
    ]
  });
  goal.animation.play('default');
  return goal;
}