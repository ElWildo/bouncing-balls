const width = 500;
const height = 500;

const app = new PIXI.Application({
  width: width,
  height: height,
  antialias: true,
  transparent: false,
  resolution: 1,
  backgroundColor: 0xeeeeee
});

document.body.appendChild(app.view);
const stage = app.stage
const running = true;


const ButtonTextstyle = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 24,
  fill: ['#ffffff', '#00ff99'], // gradient
  stroke: '#4a1850',
  strokeThickness: 1,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
});


class Ball {
  myGraphic: any;
  myContainer: any;
  myMask: any;
  constructor(x?: number, y?: number, r?: number, color?: number) {

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
    this.myContainer.addChild(this.myGraphic)
    this.myContainer.radius = r;
    this.myContainer.starting_x = x;
    this.myContainer.starting_y = y;
    this.myContainer.direction = Math.random() * Math.PI * 2
    this.myContainer.dir_x = Math.sin(this.myContainer.direction);
    this.myContainer.dir_y = Math.cos(this.myContainer.direction);
    this.myContainer.speed = 2 + Math.random() * 2;
  }
}

class Button {
  myGraphic: any;
  buttonText: any;
  constructor(x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    text: string,
    callback: any) {
    this.myGraphic = new PIXI.Graphics();
    this.myGraphic.beginFill(color, 1);
    this.myGraphic.drawRect(x, y, width, height);
    this.myGraphic.endFill();
    this.myGraphic.interactive = true;
    this.myGraphic.buttonMode = true;
    this.setCallback(callback)
    this.buttonText = new PIXI.Text(text, ButtonTextstyle);
    this.buttonText.x = x + width / 2 - this.buttonText.width / 2;
    this.buttonText.y = y + height / 2 - this.buttonText.height / 2;
    this.myGraphic.addChild(this.buttonText);
    app.stage.addChild(this.myGraphic)
  }

  setCallback(callback: any) {
    this.myGraphic.on('pointerdown', callback)
  }
}

class ButtonTextSwap extends Button {
  altText: string;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    text: string,
    altText: string,
    callback: any) {
    super(x, y, width, height, color, text, callback);
    this.altText = altText;
  }

  setCallback(callback) {
    this.myGraphic.on('pointerdown', () => {
      let supp = this.altText;
      this.altText = this.buttonText.text;
      this.buttonText.text = supp;
      callback();
    })
  }
}
const balls = [];
const n = randRange(30, 20);
// const n= 1;


for (let i = 0; i < n; i++) {
  let r = randRange(30, 10);
  let x = randRange(width - r, r);
  let y = randRange(height - r, r);
  let color = Math.random() * 0xFFFFFF;
  let ball = new Ball(x, y, r, color)
  balls.push(ball);

  app.stage.addChild(ball.myContainer)
}

const ButtonPlayPause = new ButtonTextSwap(50, 50, 100, 50, 0xeba134, '❚❚', '►', () => {
  running = !running;
});
const ButtonAddBall = new Button(200, 50, 100, 50, 0xeba134, '+1 Ball', () => {
  let r = randRange(30, 10);
  let x = randRange(width - r, r);
  let y = randRange(height - r, r);
  let color = Math.random() * 0xFFFFFF;
  let ball = new Ball(x, y, r, color)
  balls.push(ball);
  app.stage.addChildAt(ball.myContainer, 0)
  FadeIn(ball.myContainer)
});

const ButtonRemoveBall = new Button(350, 50, 100, 50, 0xeba134, '-1 Ball', () => {
  let ball = balls[balls.length - 1]
  FadeOut(ball.myContainer, destroyBall)
  balls.pop();
  function destroyBall() {
    app.stage.removeChild(ball.myContainer)
  }
});

app.ticker.add(() => {
  if (running) {
    for (let i = 0; i < balls.length; i++) {
      let ball = balls[i].myContainer;
      ball.x += ball.dir_x * ball.speed;
      ball.y += ball.dir_y * ball.speed;
      if (ball.x + ball.starting_x <= ball.radius ||
        ball.x + ball.starting_x >= width - ball.radius) {
        ball.dir_x = -1 * ball.dir_x;
        Blink(ball)

      }
      if (ball.y + ball.starting_y <= ball.radius ||
        ball.y + ball.starting_y >= height - ball.radius) {
        ball.dir_y = -1 * ball.dir_y;
        Blink(ball)
      }
    }
  }
});

function Blink(obj: any) {
  var tween = new TweenMax.to(obj, 0.1,
    {
      alpha: 0.2,
      ease: "bounce.inOut",
      yoyo: true,
      repeat: 3,
      onComplete: resetAlpha
    }
  );
  function resetAlpha() {
    obj.alpha = 1;
  }
}

function FadeIn(obj: any) {
  var tween = new TweenMax.from(obj, 0.8,
    {
      alpha: 0,
      ease: "power2.in",
    }
  );
  function resetAlpha() {
    obj.alpha = 1;
  }
}

function FadeOut(obj: any, callback: any) {
  var tween = new TweenMax.to(obj, 0.5,
    {
      alpha: 0,
      ease: "power2.out",
      onComplete: callback
    }
  );
}


function randRange(max, min) {
  return Math.random() * (max - min) + min;
}