let sliderTamanho;
let oscilador;
let aTocar = false;
let guiContainer;

// Criamos variáveis para a posição do círculo
let circuloX;
let circuloY;

function setup() {
  // Configura o canvas dentro da tag <main>
  let canvas = createCanvas(600, 400);
  canvas.parent(select('main'));
  
  // Inicializa a posição do círculo no centro
  circuloX = width / 2;
  circuloY = height / 2;
  
  // Criar uma div para agrupar os controlos e herdar os estilos modernos do CSS
  guiContainer = createDiv('');
  guiContainer.class('p5-control-container');
  guiContainer.parent(select('main'));

  // Adiciona a legenda e o slider dentro do grupo GUI
  let labelTamanho = createSpan('Tamanho:');
  labelTamanho.parent(guiContainer);

  sliderTamanho = createSlider(10, 250, 120);
  sliderTamanho.parent(guiContainer);
  
  // Sistema de som (Oscilador Sine)
  oscilador = new p5.Oscillator('sine');
  oscilador.amp(0); 
  oscilador.start();
}

function draw() {
  background(250); // Fundo limpo
  desenharGrelha(); // Textura suave de fundo

  // Se o rato estiver dentro do canvas e NÃO estiver em cima da caixinha GUI,
  // o círculo segue suavemente a posição do teu rato
  if (isMouseInCanvas() && !isMouseInGUI()) {
    // Usamos lerp() para criar um efeito de transição/perseguição suave (suaviza o movimento)
    circuloX = lerp(circuloX, mouseX, 0.15);
    circuloY = lerp(circuloY, mouseY, 0.15);
  }

  // Cores dinâmicas em tons pastel baseadas na posição atual do círculo
  let r = map(circuloX, 0, width, 140, 240);
  let g = map(circuloY, 0, height, 160, 240);
  let b = 255; 
  
  // Obtém o tamanho definido no slider da interface
  let tam = sliderTamanho.value();
  
  push();
  // Move a origem para a posição atualizada do círculo
  translate(circuloX, circuloY);
  
  // Sombra projetada para efeito de profundidade (estilo Glassmorphism)
  drawingContext.shadowBlur = 25;
  drawingContext.shadowColor = color(r, g, b, 80);
  
  fill(r, g, b); 
  stroke(255);
  strokeWeight(5);
  circle(0, 0, tam);
  
  // Anel exterior de feedback (pulsação) se o som estiver ativo
  if (aTocar) {
    noFill();
    stroke(r, g, b, 120);
    strokeWeight(2);
    let pulso = tam + sin(frameCount * 0.15) * 15;
    circle(0, 0, pulso);
  }
  pop();
  
  desenharLegenda();
}

function mousePressed() {
  // Só ativa o som se o clique for feito dentro do canvas e fora da GUI
  if (isMouseInCanvas() && !isMouseInGUI()) {
    aTocar = true;
    // Altera a frequência baseando-se na posição X do rato
    let freq = map(mouseX, 0, width, 200, 600); 
    oscilador.freq(freq, 0.05);
    oscilador.amp(0.3, 0.05); // Ativa o som com um leve fade-in
  }
}

function mouseReleased() {
  aTocar = false;
  oscilador.amp(0, 0.15); // Desliga o som com um fade-out suave
}

// --- Funções Utilitárias de Controlo de Fronteiras ---

function isMouseInCanvas() {
  return mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height;
}

function isMouseInGUI() {
  // Impede que o círculo tente ir para trás da caixinha dos controlos (canto superior direito)
  return mouseX > width - 190 && mouseY < 110;
}

function desenharGrelha() {
  stroke(235);
  strokeWeight(1);
  for (let x = 0; x < width; x += 40) line(x, 0, x, height);
  for (let y = 0; y < height; y += 40) line(0, y, width, y);
}

function desenharLegenda() {
  noStroke();
  textSize(12);
  textAlign(LEFT, BOTTOM);
  if (aTocar) {
    fill('#3182ce');
    text("🎵 Som Ativo: " + floor(oscilador.getFreq()) + "Hz", 20, height - 20);
  } else {
    fill(140);
    text("🖱️ Clica e arrasta no ecrã para mover e produzir som", 20, height - 20);
  }
}