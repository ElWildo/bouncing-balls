var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var width = 500;
var height = 500;
var app = new PIXI.Application({
    width: width,
    height: height,
    antialias: true,
    transparent: false,
    resolution: 1,
    backgroundColor: 0xeeeeee
});
document.body.appendChild(app.view);
var stage = app.stage;
var running = true;
var ButtonTextstyle = new PIXI.TextStyle({
    fontFamily: 'Arial',
    fontSize: 24,
    fill: ['#ffffff', '#00ff99'],
    stroke: '#4a1850',
    strokeThickness: 1,
    wordWrap: true,
    wordWrapWidth: 440,
    lineJoin: 'round'
});
var Ball = /** @class */ (function () {
    function Ball(x, y, r, color) {
        this.myGraphic = new PIXI.Graphics();
        this.myGraphic.lineStyle(0);
        this.myGraphic.beginFill(color, 1);
        this.myGraphic.drawCircle(x, y, r);
        this.myGraphic.endFill();
        this.myMask = new PIXI.Graphics();
        this.myMask.beginFill(0xFFFFFF, 1);
        this.myMask.drawCircle(x, y, r);
        this.myMask.endFill();
        this.myContainer = new PIXI.Container();
        this.myContainer.addChild(this.myGraphic);
        this.myContainer.radius = r;
        this.myContainer.starting_x = x;
        this.myContainer.starting_y = y;
        this.myContainer.direction = Math.random() * Math.PI * 2;
        this.myContainer.dir_x = Math.sin(this.myContainer.direction);
        this.myContainer.dir_y = Math.cos(this.myContainer.direction);
        this.myContainer.speed = 2 + Math.random() * 2;
    }
    return Ball;
}());
var Button = /** @class */ (function () {
    function Button(x, y, width, height, color, text, callback) {
        this.myGraphic = new PIXI.Graphics();
        this.myGraphic.beginFill(color, 1);
        this.myGraphic.drawRect(x, y, width, height);
        this.myGraphic.endFill();
        this.myGraphic.interactive = true;
        this.myGraphic.buttonMode = true;
        this.setCallback(callback);
        this.buttonText = new PIXI.Text(text, ButtonTextstyle);
        this.buttonText.x = x + width / 2 - this.buttonText.width / 2;
        this.buttonText.y = y + height / 2 - this.buttonText.height / 2;
        this.myGraphic.addChild(this.buttonText);
        app.stage.addChild(this.myGraphic);
    }
    Button.prototype.setCallback = function (callback) {
        this.myGraphic.on('pointerdown', callback);
    };
    return Button;
}());
var ButtonTextSwap = /** @class */ (function (_super) {
    __extends(ButtonTextSwap, _super);
    function ButtonTextSwap(x, y, width, height, color, text, altText, callback) {
        var _this = _super.call(this, x, y, width, height, color, text, callback) || this;
        _this.altText = altText;
        return _this;
    }
    ButtonTextSwap.prototype.setCallback = function (callback) {
        var _this = this;
        this.myGraphic.on('pointerdown', function () {
            var supp = _this.altText;
            _this.altText = _this.buttonText.text;
            _this.buttonText.text = supp;
            callback();
        });
    };
    return ButtonTextSwap;
}(Button));
var balls = [];
var n = randRange(30, 20);
// const n= 1;
for (var i = 0; i < n; i++) {
    var r = randRange(30, 10);
    var x = randRange(width - r, r);
    var y = randRange(height - r, r);
    var color = Math.random() * 0xFFFFFF;
    var ball = new Ball(x, y, r, color);
    balls.push(ball);
    app.stage.addChild(ball.myContainer);
}
var ButtonPlayPause = new ButtonTextSwap(50, 50, 100, 50, 0xeba134, '❚❚', '►', function () {
    running = !running;
});
var ButtonAddBall = new Button(200, 50, 100, 50, 0xeba134, '+1 Ball', function () {
    var r = randRange(30, 10);
    var x = randRange(width - r, r);
    var y = randRange(height - r, r);
    var color = Math.random() * 0xFFFFFF;
    var ball = new Ball(x, y, r, color);
    balls.push(ball);
    app.stage.addChildAt(ball.myContainer, 0);
    FadeIn(ball.myContainer);
});
var ButtonRemoveBall = new Button(350, 50, 100, 50, 0xeba134, '-1 Ball', function () {
    var ball = balls[balls.length - 1];
    FadeOut(ball.myContainer, destroyBall);
    balls.pop();
    function destroyBall() {
        app.stage.removeChild(ball.myContainer);
    }
});
app.ticker.add(function () {
    if (running) {
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i].myContainer;
            ball.x += ball.dir_x * ball.speed;
            ball.y += ball.dir_y * ball.speed;
            if (ball.x + ball.starting_x <= ball.radius ||
                ball.x + ball.starting_x >= width - ball.radius) {
                ball.dir_x = -1 * ball.dir_x;
                Blink(ball);
            }
            if (ball.y + ball.starting_y <= ball.radius ||
                ball.y + ball.starting_y >= height - ball.radius) {
                ball.dir_y = -1 * ball.dir_y;
                Blink(ball);
            }
        }
    }
});
function Blink(obj) {
    var tween = new TweenMax.to(obj, 0.1, {
        alpha: 0.2,
        ease: "bounce.inOut",
        yoyo: true,
        repeat: 3,
        onComplete: resetAlpha
    });
    function resetAlpha() {
        obj.alpha = 1;
    }
}
function FadeIn(obj) {
    var tween = new TweenMax.from(obj, 0.8, {
        alpha: 0,
        ease: "power2.in"
    });
    function resetAlpha() {
        obj.alpha = 1;
    }
}
function FadeOut(obj, callback) {
    var tween = new TweenMax.to(obj, 0.5, {
        alpha: 0,
        ease: "power2.out",
        onComplete: callback
    });
}
function randRange(max, min) {
    return Math.random() * (max - min) + min;
}
