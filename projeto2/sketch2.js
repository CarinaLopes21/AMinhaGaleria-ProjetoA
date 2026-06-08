let botaoInverter;
let modoEscuro = false;
let oscilador;
let guiContainer;

function setup() {
  let canvas = createCanvas(600, 400);
  canvas.parent(select('main'));
  
  // Cria o painel de controlos modernos
  guiContainer = createDiv('');
  guiContainer.class('p5-control-container');
  guiContainer.parent(select('main'));

  botaoInverter = createButton('Inverter Modo');
  botaoInverter.parent(guiContainer);
  botaoInverter.mousePressed(mudarFundo);

  // Inicializa o som ambiente
  oscilador = new p5.Oscillator('triangle');
  oscilador.amp(0);
  oscilador.start();
}

function draw() {
  // Definição dinâmica de paleta clara/escura
  let corFundo = modoEscuro ? color(30) : color(250);
  let corLinha = modoEscuro ? color(255, 138, 0) : color(49, 130, 206);
  let corTexto = modoEscuro ? color(180) : color(100);

  background(corFundo);
  
  push();
  translate(width / 2, height / 2);
  
  // Efeito de brilho néon nas linhas (Glow)
  drawingContext.shadowBlur = modoEscuro ? 15 : 6;
  drawingContext.shadowColor = corLinha;
  
  stroke(corLinha);
  strokeWeight(2);
  noFill();
  
  // Rotação subtil baseada no movimento do rato vertical
  let anguloRotacao = map(mouseY, 0, height, 0, TWO_PI / 8);
  rotate(anguloRotacao);
  
  let quantidade = map(mouseX, 0, width, 2, 18);
  for (let i = 1; i < quantidade; i++) {
    push();
    // Cria uma animação de pulsação suave em onda para cada quadrado
    let dynamicScale = sin(frameCount * 0.02 + i * 0.2) * 4;
    let tam = i * 18 + dynamicScale;
    rect(-tam / 2, -tam / 2, tam, tam, 6); // Cantos ligeiramente arredondados
    pop();
  }
  pop();
  
  // Lógica do som contínuo ao passar o rato no canvas
  if (isMouseInCanvas() && !isMouseInGUI()) {
    let freq = map(mouseY, height, 0, 180, 550);
    let pan = map(mouseX, 0, width, -1, 1); // Som estéreo (esquerda/direita)
    oscilador.freq(freq, 0.05);
    oscilador.pan(pan, 0.05);
    oscilador.amp(0.08, 0.1); // Volume de fundo suave
  } else {
    oscilador.amp(0, 0.15);
  }
  
  // Renderizar o texto explicativo
  noStroke();
  fill(corTexto);
  textSize(12);
  textAlign(LEFT, BOTTOM);
  text("Move o rato para interagir com a geometria e o som (Stereo).", 20, height - 20);
}

function mudarFundo() {
  modoEscuro = !modoEscuro;
}

function isMouseInCanvas() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function isMouseInGUI() {
  return mouseX > width - 190 && mouseY < 90;
}