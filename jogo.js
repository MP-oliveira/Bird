let frames =0;
const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const mensagemGetReady = {
    spriteX: 134,
    spriteY: 0,
    largura: 200,
    altura: 152,
    x: (canvas.width / 2.4) - (174 / 2),
    y: 50,
    desenha() {
        contexto.drawImage(
            sprites, 
            mensagemGetReady.spriteX, mensagemGetReady.spriteY, // sprite x e sprite y
            mensagemGetReady.largura, mensagemGetReady.altura, //  tamanho do recorte na sprite
            mensagemGetReady.x, mensagemGetReady.y, 
            mensagemGetReady.largura, mensagemGetReady.altura,
        );
    },
};



function fazColizao(flappyBird, chao){
    const flappyBirdY = flappyBird.y + flappyBird.altura;
    const chaoY = chao.y

    if(flappyBirdY >= chaoY){
        return true;
    }
    return false;
}

function criaFlappyBird(){
    const flappyBird = {
        spriteX: 6,
        spriteY: 0,
        largura: 108,
        altura: 31,
        x: 6,
        y: 20,
        pulo: 2.0,
        pula(){
            flappyBird.velocidade = - flappyBird.pulo;
        },
        gravidade: 0.12,
        velocidade: 0,
        atualiza(){
            if(fazColizao(flappyBird, globais.chao)){
    
                mudaParaTela(Telas.INICIO)
                return
            }
            flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
            flappyBird.y = flappyBird.y + flappyBird.velocidade;
        },
        movimentos: [
            { spriteX: 6, spriteY: 0},
            { spriteX: 6, spriteY: 31},
            { spriteX: 6, spriteY: 62},
            { spriteX: 6, spriteY: 31},
        ],
        frameAtual:0,
        atualizaOFrameAtual() {     
            const intervaloDeFrames = 10;
            const passouOIntervalo = frames % intervaloDeFrames === 0;
            // console.log('passouOIntervalo', passouOIntervalo)
      
            if(passouOIntervalo) {
              const baseDoIncremento = 1;
              const incremento = baseDoIncremento + flappyBird.frameAtual;
              const baseRepeticao = flappyBird.movimentos.length;
              flappyBird.frameAtual = incremento % baseRepeticao
            }
            
          },
        desenha(){
            flappyBird.atualizaOFrameAtual();
            const { spriteX, spriteY } = flappyBird.movimentos[flappyBird.frameAtual];
            contexto.drawImage(
                sprites, 
                spriteX, spriteY, // sprite x e sprite y
                flappyBird.largura, flappyBird.altura, //  tamanho do recorte na sprite
                flappyBird.x, flappyBird.y, 
                flappyBird.largura, flappyBird.altura,
            );
        },
    };
    return flappyBird; 
}


const planoDeFundo = {
    spriteX: 373,
    spriteY: -10,
    largura: 359,
    altura: 199,
    x: 0,
    y: canvas.height - 280,
    desenha(){
        contexto.fillStyle = '#00bfff';
        contexto.fillRect(0, 0, canvas.width, canvas.height)

        contexto.drawImage(
            sprites, 
            planoDeFundo.spriteX, planoDeFundo.spriteY, // sprite x e sprite y
            planoDeFundo.largura, planoDeFundo.altura, //  tamanho do recorte na sprite
            planoDeFundo.x, planoDeFundo.y, 
            planoDeFundo.largura, planoDeFundo.altura,
        );

        contexto.drawImage(
            sprites, 
            planoDeFundo.spriteX, planoDeFundo.spriteY, // sprite x e sprite y
            planoDeFundo.largura, planoDeFundo.altura, //  tamanho do recorte na sprite
            (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y, 
            planoDeFundo.largura, planoDeFundo.altura,
        );
    },
};


function criaChao(){
    const chao = {
        spriteX: 442.5,
        spriteY: 333,
        largura: 221,
        altura: 112,
        x: 0,
        y: canvas.height - 112,
        atualiza(){
            const movimentoDoChao = 1;
            const repeteEm = chao.largura / 2.8;
            const movimentacao = chao.x - movimentoDoChao;

            chao.x = movimentacao % repeteEm;   
        },
        desenha() {
            contexto.drawImage(
              sprites,
              chao.spriteX, chao.spriteY,
              chao.largura, chao.altura,
              chao.x, chao.y,
              chao.largura, chao.altura,
            );
        
            contexto.drawImage(
              sprites,
              chao.spriteX, chao.spriteY,
              chao.largura, chao.altura,
              (chao.x + chao.largura), chao.y,
              chao.largura, chao.altura,
            );
          },
        };
        return chao;
};

function criaNuvens(){
    const nuvens = {
        spriteX: 300,
        spriteY: 458,
        largura: 864,
        altura: 231,
        desenha(){
            const yRandom = 0;

            const nuvemCeuX = 0;
            const nuvemCeuY = yRandom;

           
            contexto.drawImage(
              sprites,
              nuvens.spriteX, nuvens.spriteY,
              nuvens.largura, nuvens.altura,
              nuvemCeuX, nuvemCeuY,
              nuvens.largura, nuvens.altura,
            );

        },
        pares: [],
        atualiza(){
            const repeteEm = nuvens.largura / 1.4;
            const passou10Frames = frames % 10  === 0;
            if(passou10Frames){
               nuvens.spriteX = (nuvens.spriteX + 10) % repeteEm
            }

        },
    };
    return nuvens;
};



// telas
let telaAtiva = {};
const globais = {};

function mudaParaTela(novaTela){
    telaAtiva = novaTela;
    
    if(telaAtiva.inicializa){
       telaAtiva.inicializa();  
    }

}
const Telas = {
    INICIO: {
        inicializa(){
            globais.flappyBird = criaFlappyBird();
            globais.chao = criaChao();
            globais.nuvens = criaNuvens();
        },
        desenha(){
            planoDeFundo.desenha();
            globais.chao.desenha();
            globais.flappyBird.desenha();
            globais.nuvens.desenha();
            mensagemGetReady.desenha();
        },
        click(){
            mudaParaTela(Telas.JOGO);
        },
        atualiza(){
            globais.nuvens.atualiza();
            globais.chao.atualiza();
        }
    }
};

Telas.JOGO ={
    desenha(){
        planoDeFundo.desenha();
        globais.chao.desenha();
        globais.nuvens.desenha();
        globais.flappyBird.desenha();
    },
    click(){
        globais.flappyBird.pula()
    },
    atualiza(){
        globais.nuvens.atualiza();
        globais.chao.atualiza();
        globais.flappyBird.atualiza();    
    }
};  

function loop(){
    
    telaAtiva.desenha();
    telaAtiva.atualiza();
    
    frames = frames + 1;
    requestAnimationFrame(loop)
}

window.addEventListener('click', function(){
    if(telaAtiva.click){
        telaAtiva.click();
    }
})

mudaParaTela(Telas.INICIO);
loop();