var createFlag = function() {
  var flag = new Utility.Sprite();
  flag.size.set(32);
  flag.location = new Utility.Vector2();
  flag.onPlayer = false;

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