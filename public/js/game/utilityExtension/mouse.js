(function () {
    class Mouse
    {
        constructor(canvas) {
            this.canvas = canvas;
            this.x = this.y = null;
            this.isMouseDown = false;
            
            this.canvas.addEventListener('mousemove', this.mouseMove.bind(this));
            this.canvas.addEventListener('mousedown', this.mouseDown.bind(this));
            this.canvas.addEventListener('mouseup', this.mouseUp.bind(this));
        }
        
        mouseMove(args) {
            this.x = args.clientx;
            this.y = args.clienty;
        }
        
        mouseDown() {
            this.isMouseDown = true;
        }
        
        mouseUp() {
            this.isMouseDown = false;
        }
        
        getx() {
            var rect = canvas.getBoundingClientRect();
            return this.x - rect.left;
        }
        
        gety() {
            var rect = canvas.getBoundingClientRect();
            return this.y - rect.top;
        }
        
        getCoordinates() {
            return { x: this.getx(), y: this.gety() };
        }
        
        // Get {x: , y: } and calculate angualar velocity to last mouse position
        getAngularVelocity(params) {
            var x = params.x || 0;
            var y = params.y || 0;
            
            var xDiff = this.x - x;
            var yDiff = this.y - y;
            return Math.atan2(xDiff, yDiff) * 180 / Math.PI;
        }
    }

    // Example:
    // let canvas = document.getElementById('canvas');
    // let mouse = new Mouse(canvas);

    // setInterval(test, 2000);

    // function test(){
    //     console.log(mouse.isMouseDown);
    //     console.log(mouse.getAngularVelocity({x: 50, y: 50}));
    // }

    Utility.Mouse = Mouse;
}());