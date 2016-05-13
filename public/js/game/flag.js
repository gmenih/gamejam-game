var createFlag = function() {
  var flag = new Utility.Sprite();
  flag = Utility.Sprite.animatable(flag);
  flag.size = new Utility.Vector2(32, 64);
  flag.direction = 0;  // 0 levo, 1 = desno
  flag.animation.add('hover', {
    speed: 310,
    frames: [
      new Utility.Rectangle(0, 192, 32, 64),
      new Utility.Rectangle(32, 192, 32, 64)
    ]
  });
  flag.animation.add('red-holding-right', {
    speed: 0,
    frames: [
      new Utility.Rectangle(64, 192, 32, 32)
    ]
  });
  flag.animation.add('red-holding-left', {
    speed: 0,
    frames: [
      new Utility.Rectangle(96, 224, 32, 32)
    ]
  });
  flag.animation.add('blue-holding-right', {
    speed: 0,
    frames: [
      new Utility.Rectangle(96, 192, 32, 32)
    ]
  });
  flag.animation.add('blue-holding-left', {
    speed: 0,
    frames: [
      new Utility.Rectangle(128, 224, 32, 32)
    ]
  });
  flag.animation.play('hover');
  flag.getBounds = function () {
    return new Utility.Rectangle(
        flag.location.x,
        flag.location.y,
        flag.size.x,
        flag.size.y
    );
  };
  return flag;
}