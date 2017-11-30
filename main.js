$(document).ready(function(){
  // Setup Canvas
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");

  // Declare Constants
  const WIDTH = canvas.width;
  const HEIGHT = canvas.height;
  const PIPE_WIDTH = 30;
  const PIPE_HEIGHT = 250;
  const PIPE_TOP_WIDTH = 40;
  const PIPE_TOP_HEIGHT = 20;
  const SPACE_KEY = 32;
  const PIPE_SPACE = 60;

  // Declare Variables
  var pipes = [];
  var gravity = 1; // positive goes down, negative goes up
  var gameOver = true;

  // Pipe Class
  class Pipe {
    constructor(pipeX, pipeY){
      this.pipeX = pipeX;
      this.pipeY = pipeY;
    }

    update(){
      this.pipeX -= 1;
    }

    draw(){
      let pipeX = this.pipeX;
      let pipe1Y = this.pipeY - PIPE_HEIGHT - PIPE_TOP_HEIGHT - PIPE_SPACE; // Move upside down pipe up
      let pipe2Y = this.pipeY + PIPE_SPACE; // Move upright pipe down

      // Upside Down Pipe
      ctx.fillStyle = "green";
      ctx.fillRect(pipeX, pipe1Y, PIPE_WIDTH, PIPE_HEIGHT);
      ctx.fillRect(pipeX - 5, pipe1Y + PIPE_HEIGHT, PIPE_TOP_WIDTH, PIPE_TOP_HEIGHT);

      // Upright Pipe
      ctx.fillStyle = "green";
      ctx.fillRect(pipeX, pipe2Y, PIPE_WIDTH, PIPE_HEIGHT);
      ctx.fillRect(pipeX - 5, pipe2Y - PIPE_TOP_HEIGHT, PIPE_TOP_WIDTH, PIPE_TOP_HEIGHT);
    }
  }

  // Player Object
  var player = {
    x: 50,
    y: HEIGHT / 2,
    size: 30,
    update: function(){
      this.y += gravity;
      gravity += 0.15;

      // Restrict the player to not fall through the ground
      this.y = Math.min(HEIGHT - this.size, this.y);

      // Check if the player falls on the ground
      if(this.y == HEIGHT - this.size){
        gameOver = true;
      }

      // Check if the player hits the pipes
      checkCollision();

      if(gameOver){
        $("h1").html("Game Over!");
        $("#restart").show();
      }
    },
    draw: function(){
      ctx.fillStyle = "yellow";
      ctx.fillRect(this.x, this.y, this.size, this.size);
    }
  }

  function main(){
    init();

    var loop = function(){
      update();
      draw();
      window.requestAnimationFrame(loop, canvas);
    }
    window.requestAnimationFrame(loop, canvas);
  }

  function init(){
    pipes = [];
    gravity = 1;
    gameOver = false;
    $("h1").html("Flappy Box");
    player.x = 50;
    player.y = HEIGHT / 2;
    Materialize.toast('Press SPACE to flap!', 2000)
  }

  function update(){
    if(!gameOver){
      generatePipes();
      for(let i = 0; i < pipes.length; i++){
        pipes[i].update();
      }
      removePipe();
    }

    player.update();
  }

  function draw(){
    // Clear Everything
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw Background
    ctx.fillStyle = "lightblue";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    // Draw Game Objects
    player.draw();

    for(let i = 0; i < pipes.length; i++){
      pipes[i].draw();
    }
  }

  // Generate a new pipe if there's no pipe or the pipe before moved a distance
  function generatePipes(){
    let pipeNum = pipes.length;
    if(pipeNum < 1 || pipes[pipeNum - 1].pipeX < WIDTH - 200){
      let newPipeY = Math.round(Math.random() * 200) + 100;
      let newPipe = new Pipe(WIDTH, newPipeY);
      pipes.push(newPipe);
    }
  }

  // Remove the first pipe if it goes out of screen
  function removePipe(){
    let firstPipe = pipes[0];
    if(firstPipe.pipeX + PIPE_WIDTH < 0){
      pipes.shift();
    }
  }

  // Check for collision
  function checkCollision(){
    let firstPipe = pipes[0];
    // If the player is within the hit zone
    if(player.x + player.size >= firstPipe.pipeX - 5 && player.x <= firstPipe.pipeX - 5 + PIPE_TOP_WIDTH){
      if(!(player.y >= firstPipe.pipeY - PIPE_SPACE && player.y + player.size <= firstPipe.pipeY + PIPE_SPACE)){
        gameOver = true;
      }
    }
  }

  // Handling user key press
  $(window).on("keydown", function(event){
    if(event.which == SPACE_KEY && !gameOver){
      gravity = -3;
    }
  });

  // Restarting the game on button press
  $("#restart").on("click", function(){
    $("#restart").hide();
    init();
  })

  // Starting the game
  main();
});
