function initCanvas(){
    let ctx = document.getElementById('my_canvas').getContext('2d');
    let backgroundImage = new Image();
    let naveImage   = new Image(); // Bombardero
    let enemiespic1  = new Image(); // Enemigo 1
    let enemiespic2 = new Image(); // Enemigo 2
    //let gameOver = new Image();  // Imagen Game Over

    // Fondo y aviones
    backgroundImage.src = "./images/fondo_nubes.jpeg"; //Imagen fondo
    naveImage.src       = "./images/Bombardero.png"; //Imagen Bombardero
    //gameOver.src        = "./images/GameOver.png";  // Imagen Game Over
    // Enemigos fotos
    enemiespic1.src     = "./images/enemigo3.png"; // Imagen Enemigo 1
    enemiespic2.src     = "./images/AvionEnemigo2.png"; // Imagen Enemigo 2
    
    // Medidas del  (canvas)
    let cW = ctx.canvas.width; // 750px 
    let cH = ctx.canvas.height;// 600px

    // Aviones enemigos
    let enemyTemplate = function(options){
        return {
            id: options.id || '',
            x: options.x || '',
            y: options.y || '',
            w: options.w || '',
            h: options.h || '',
            image: options.image || enemiespic1
        }
    }

    // Creación de los aviones enemigos, primer grupo
    let enemies = [
                   new enemyTemplate({id: "enemy1", x: 100,  y:-20,  w: 50,  h: 30 }), 
                   new enemyTemplate({id: "enemy2", x: 225,  y:-20,  w: 50,  h: 30 }),
                   new enemyTemplate({id: "enemy3", x: 350,  y:-20,  w: 80,  h: 30 }),
                   new enemyTemplate({id: "enemy4", x: 100,  y:-70,  w: 80,  h: 30}),
                   new enemyTemplate({id: "enemy5", x: 225,  y:-70,  w: 50,  h: 30}),
                   new enemyTemplate({id: "enemy6", x: 350,  y:-70,  w: 50,  h: 30}),
                   new enemyTemplate({id: "enemy7", x: 475,  y:-70,  w: 50,  h: 30}),
                   new enemyTemplate({id: "enemy8", x: 600,  y:-70,  w: 80,  h: 30}),
                   new enemyTemplate({id: "enemy9", x: 475,  y:-20,  w: 50,  h: 30}),
                   new enemyTemplate({id: "enemy10",x: 600,  y:-20,  w: 50,  h: 30}),
                   new enemyTemplate({id: "enemy11",x: 700,  y:-20,  w: 50,  h: 30}),
                   
                   

                   // Segundo grupo de enemigos
                   new enemyTemplate({ id: "enemy11", x: 100, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy12", x: 225, y: -220, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy13", x: 350, y: -220, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy14", x: 100, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy15", x: 225, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy16", x: 350, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy17", x: 475, y: -270, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy18", x: 600, y: -270, w: 80, h: 50, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy19", x: 475, y: -200, w: 50, h: 30, image: enemiespic2 }),
                   new enemyTemplate({ id: "enemy20", x: 600, y: -200, w: 50, h: 30, image: enemiespic2 }),
                  ];

    
    // Comprobaccion si los enemigos colisionan con el jugador.
    let renderEnemies = function (enemyList) {
        for (let i = 0; i < enemyList.length; i++) {
            console.log(enemyList[i]);
            ctx.drawImage(enemyList[i].image, enemyList[i].x, enemyList[i].y += .5, enemyList[i].w, enemyList[i].h);
            // Detecta si los aviones enemigos llegan al mivel inferior.
            launcher.hitDetectLowerLevel(enemyList[i]);
        }
    }

    function Launcher(){
        // Ubicación de los misiles
        this.y = 500, 
        this.x = cW*.5-25, 
        this.w = 100, 
        this.h = 100,       
        this.direccion, 
        this.bg="orange", // Color de los misiles
        this.misiles = [];

         // Tipo de letra 
         this.gameStatus = {
            over: false, 
            message: "",
            fillStyle: 'red',
            font: 'italic bold 36px Arial, sans-serif',
        }
        // Creamos el movimiento del avión princial en en canvas
        this.render = function () {
            if(this.direccion === 'left'){
                this.x-=5;
            } else if(this.direccion === 'right'){
                this.x+=5;
            }else if(this.direccion === "downArrow"){
                this.y+=5;
            }else if(this.direccion === "upArrow"){
                this.y-=5;
            }
            // Creamos el avion en el canvas
            ctx.fillStyle = this.bg;
            ctx.drawImage(backgroundImage, 10,10); // background image
            ctx.drawImage(naveImage,this.x,this.y, 95, 60); // Medidas del avión principal

            for(let i=0; i < this.misiles.length; i++){
                let m = this.misiles[i];
                ctx.fillRect(m.x, m.y-=5, m.w, m.h); // Dirección de los misiles
                this.hitDetect(this.misiles[i],i);
                if(m.y <= 0){ // Si un misil sobrepasa los limites del canvas, eliminalo
                    this.misiles.splice(i,1); 
                }
            }
            // Lo que ocurre uando ganas
            if (enemies.length === 0) {
                clearInterval(animateInterval); // Para la animación del juego
                ctx.fillStyle = 'yellow';
                ctx.font = this.gameStatus.font;
                ctx.fillText('You win!', cW * .5 - 80, 50);
            }
        }
        // Detectar impacto del misil
        this.hitDetect = function (m, mi) {
            console.log('crush');
            for (let i = 0; i < enemies.length; i++) {
                let e = enemies[i];
                if(m.x+m.w >= e.x && 
                   m.x <= e.x+e.w && 
                   m.y >= e.y && 
                   m.y <= e.y+e.h){
                    this.misiles.splice(this.misiles[mi],1); // Elimina el misil
                    enemies.splice(i, 1); // Elimina al enemiga tras el impacto 
                    document.querySelector('.barra').innerHTML = "Destroyed "+ e.id+ " ";
                }
            }
        }
        // Pregunta si el avion del jugador a pasado ó golpeado a un aenemigo.
        this.hitDetectLowerLevel = function(enemy){
            // Si la ubicación del barco es mayor que 550, entonces sabemos que pasó el nivel inferior
            if(enemy.y > 550){
                this.gameStatus.over = true;
                //ctx.style.display = none;
                //gameOver.style.diplay = "flex";
                //this.gameStatus.message = "Game Over";
                const gameOver = document.getElementById("gameover-screen")
                const canvasDivOcult = document.getElementById("canvasDiv")

                gameOver.classList.remove("hidden")
                canvasDivOcult.classList.add("hidden")
                
            }
            // Esto detecta un choque de la nave con enemigos
            //console.log(this);
            // this.y -> where is spaceship location
            if(enemy.id === 'enemy3'){
                //console.log(this.y);
                console.log(this.x);
            }
            // a) Si el enemigo y es mayor que este.y - 25 => entonces sabemos que hay una colisión.
            // b) Si el enemigo x es menor que this.x + 45 && enemy x > this.x - 45 entonces sabemos que hay una colisión
            if ((enemy.y < this.y + 25 && enemy.y > this.y - 25) &&
                (enemy.x < this.x + 45 && enemy.x > this.x - 45)) { // Comprueba si el enemigo está a la izquierda o a la derecha de la nave
                    this.gameStatus.over = true;
                    const gameOver = document.getElementById("gameover-screen")
                    const canvasDivOcult = document.getElementById("canvasDiv")
    
                    gameOver.classList.remove("hidden")
                    canvasDivOcult.classList.add("hidden")
                }

            if(this.gameStatus.over === true){  
                clearInterval(animateInterval); // Parar la animación
                ctx.fillStyle = this.gameStatus.fillStyle; 
                ctx.font = this.gameStatus.font;
                // Muestra los textos en el canvas
                ctx.fillText(this.gameStatus.message, cW * .5 - 80, 50); // text x , y
            }
        }
    }
    
    let launcher = new Launcher();
    function animate(){
        ctx.clearRect(0, 0, cW, cH);
        launcher.render();
        renderEnemies(enemies);
    }
    let animateInterval = setInterval(animate, 9);
    
    let left_btn  = document.getElementById('left_btn');
    let right_btn = document.getElementById('right_btn');
    let fire_btn  = document.getElementById('fire_btn'); 

   document.addEventListener('keydown', function(event) {
        if(event.keyCode == 37) // left arrow
        {
         launcher.direccion = 'left';  
            if(launcher.x < cW*.2-130){
                launcher.x+=0;
                launcher.direccion = '';
            }
       }    
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 37)
        {
         launcher.x+=0;
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 39) // right arrow
        {
         launcher.direccion = 'right';
         if(launcher.x > cW-110){
            launcher.x-=0;
            launcher.direccion = '';
         }
        
        }
    });

    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 39) // right arrow
        {
         launcher.x-=0;   
         launcher.direccion = '';
        }
    }); 

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.direccion = 'upArrow';  
           if(launcher.y < cH*.2-80){
              launcher.y += 0;
              launcher.direccion = '';
            }
         }
    });

    document.addEventListener('keyup', function(event){
         if(event.keyCode == 38) // up arrow
         {
           launcher.y -= 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 40) // down arrow
         {
           launcher.direccion = 'downArrow';  
          if(launcher.y > cH - 110){
            launcher.y -= 0;
            launcher.direccion = '';
           }
         }
    });
    document.addEventListener('keyup', function(event){
         if(event.keyCode == 40) // down arrow
         {
           launcher.y += 0;
           launcher.direccion = '';
         }
    });

    document.addEventListener('keydown', function(event){
         if(event.keyCode == 80) // restart game
         {
          location.reload();
         }
    });

    // control buttons
    left_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'left';
    });

    left_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });

    right_btn.addEventListener('mousedown', function(event) {
        launcher.direccion = 'right';
    });

    right_btn.addEventListener('mouseup', function(event) {
        launcher.direccion = '';
    });
    // Disparos de los misiles 
    fire_btn.addEventListener('mousedown', function(event) {
        launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3, h: 10});
    });
    // Dispara los misiles pulsando la tecla espacio
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 32) {
           launcher.misiles.push({x: launcher.x + launcher.w*.5, y: launcher.y, w: 3,h: 10});
        }
    });
}
 const botonStart = document.getElementById("start-btn")
 const canvasDiv = document.getElementById("canvasDiv")
const menuStart = document.getElementById("splash-screen")

 botonStart.addEventListener('click', function(){
 canvasDiv.classList.remove("hidden")
 menuStart.classList.add("hidden")
 initCanvas();
 
});

//window.addEventListener('load', function(event) {
//    initCanvas();
//});
const botonRetry = document.getElementById("back-to-menu")
botonRetry.addEventListener('click', function(){
location.reload();
    
   });