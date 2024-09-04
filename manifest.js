const canvas = document.getElementById('reservoirCanvas');
const ctx = canvas.getContext('2d');
const cdControl = document.getElementById('cd');
const radiusControl = document.getElementById('radius');
const heightControl = document.getElementById('height');
const cdSlider = document.getElementById('cdSlider');
const radiusSlider = document.getElementById('radiusSlider');
const heightSlider = document.getElementById('heightSlider');
const cdValueLabel = document.getElementById('cdValue');
const radiusValueLabel = document.getElementById('radiusValue');
const heightValueLabel = document.getElementById('heightValue');
const timeLabel = document.getElementById('timeLabel');
const flowRateLabel = document.getElementById('flowRateLabel');
const heightText = document.getElementById('heightText');
const pauseButton = document.getElementById('pauseButton');

const heightOrificio= document.getElementById('heightOrificio')
const heightOrificioControl= document.getElementById('heightOrificio')
const heightOrificioSlider= document.getElementById('heightOrificioSlider')
const heghtValueLabel = document.getElementById('heightOrificioLabel');
const heightOrificioValue= document.getElementById('heightOrificioValue')

const widthControl= document.getElementById('width')
const widthSlider = document.getElementById('widthSlider');
const widthValue= document.getElementById('widthValue');




const storedData = localStorage.getItem('dadosReservatorio');
const data = JSON.parse(storedData);
const gravity = data.gravidade;
const maxDepth = data.profundidade;
heightControl.max = maxDepth;
heightControl.value = maxDepth;
heightSlider.max = maxDepth;
const orificeType= dadosReservatorio.tipoOrificio;


const timeStep = 0.1; // Passo de tempo (s)
let fluidHeight = canvas.height; // Altura inicial do fluido
let totalTime = 0; // Tempo total para esvaziar
let isPaused = true; // Estado da simulação (inicialmente pausado)

function adjustCanvasSize() {
    canvas.width = document.querySelector('.container').offsetWidth * 0.6; // Ajusta a largura do canvas
    canvas.height = 400; // Altura fixa para o canvas
    fluidHeight = canvas.height; // Redefine a altura do fluido
    drawReservoir(); // Redesenha o reservatório
}

function calculateFlowRateAndTime() {
    const Cd = parseFloat(cdControl.value);
    const radius = parseFloat(radiusControl.value) / 100; // Convertendo para metros
    const heightOrificio= parseFloat(heightOrificioControl.value)/ 100
    const width= parseFloat(widthControl.value)/100;
    const initialHeight = parseFloat(heightControl.value);
    let outletArea;

    if (orificeType=="circular"){
        outletArea= Math.PI * Math.pow(radius, 2);
    }
    else if (orificeType=="retangular"){
        outletArea = heightOrificio * width;
    }
    

  
    // Cálculo da vazão
    const flowRate = Cd * outletArea * Math.sqrt(2 * gravity * initialHeight);
    
    // Cálculo do tempo total para esvaziar o reservatório
    let time = 0;
    let height = initialHeight;

    

    while (height > 0) {
        const deltaHeight = (flowRate * timeStep) / (canvas.width / initialHeight); // Corrigido
        height -= deltaHeight;

        if (height < 0) height = 0;

        time += timeStep;
    }

    return { flowRate, time };
}

function drawReservoir() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar o reservatório
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar o fluido
    ctx.fillStyle = '#007BFF';
    ctx.fillRect(0, canvas.height - fluidHeight, canvas.width, fluidHeight);
    
    
    const radiusLabel = document.getElementById('radiusLabel');
    const radiusControl = document.getElementById('radius');
    const radiusSlider = document.getElementById('radiusSlider');
    
    const widthLabel = document.getElementById('widthLabel');
    const heightLabel = document.getElementById('heightOrificioLabel');
    const widthControl = document.getElementById('width');
    const heightControl = document.getElementById('heightOrificio');
    const widthSlider = document.getElementById('widthSlider');
    const heightSlider = document.getElementById('heightOrificioSlider');


    function updateWidth() {
        const widthValue = widthSlider.value ;
        widthControl.value = widthValue;
    }
    
    function updateHeight() {
        heightOrificioControl.value = heightOrificioSlider.value;
        heightOrificioValue.textContent = heightOrificioSlider.value;
    }
    function updateRadius() {
        radiusControl.value = radiusSlider.value;
        radiusValue.textContent = radiusSlider.value;
    }
    
    // Add event listeners
    widthSlider.addEventListener('input', updateWidth);
    heightOrificioSlider.addEventListener('input', updateHeight);
    radiusSlider.addEventListener('input', updateRadius);
    
    if (orificeType== "circular"){
        radiusLabel.style.display = 'block';
        radiusControl.style.display = 'block';
        radiusSlider.style.display = 'block';

    }
    else if(orificeType== "retangular"){
        
        widthLabel.style.display = 'block';
        heightLabel.style.display = 'block';
        widthControl.style.display = 'block';
        heightControl.style.display = 'block';
        widthSlider.style.display = 'block';
        heightSlider.style.display = 'block';
    }

    
      // Adicionar o código para desenhar o orifício retangular
      if (orificeType === "retangular") {
        const orificeWidth = parseFloat(widthControl.value) / 2; // Metade da largura para posicionamento
        const orificeHeight = parseFloat(heightOrificioControl.value); // Altura do orifício
        const orificeX = canvas.width - orificeWidth - 10; // Localização X do orifício
        const orificeY = canvas.height - orificeHeight; // Localização Y do orifício

        ctx.fillStyle = '#FF0000'; // Cor do orifício
        ctx.fillRect(orificeX, orificeY, orificeWidth * 2, orificeHeight); // Desenhar o retângulo do orifício
    } else if (orificeType === "circular") {
        const orificeRadius = parseFloat(radiusControl.value) / 2; // Raio do orifício
        const orificeX = canvas.width - orificeRadius - 10; // Localização X do orifício
        const orificeY = canvas.height - orificeRadius; // Localização Y do orifício

        ctx.beginPath();
        ctx.arc(orificeX, orificeY, orificeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF0000'; // Cor do orifício
        ctx.fill();
        ctx.strokeStyle = 'transparent'; // Remover a linha de contorno
        ctx.stroke();
    }

    ctx.fill();
    // Remover a linha de contorno
    ctx.strokeStyle = 'transparent';
    ctx.stroke();
    
    // Desenhar a altura da lâmina d'água
    ctx.fillStyle = '#FF0000';
    ctx.font = '16px Arial';
    ctx.fillText(`Altura: ${(fluidHeight).toFixed(2)} m`, 10, 20);
}

function updateReservoir() {
    if (isPaused) return;

    const Cd = parseFloat(cdControl.value);
    const radius = parseFloat(radiusControl.value) / 100;
    const outletArea = Math.PI * Math.pow(radius, 2);
    const heightInMeters = fluidHeight / canvas.height * parseFloat(heightControl.value); // altura da lâmina d'água atual

    const flowRate = Cd * outletArea * Math.sqrt(2 * gravity * heightInMeters);
    const flowRateLiters = flowRate * 1000; // Converte de m³/s para L/s

    // Corrigir o cálculo de deltaHeight
    const deltaHeight = (flowRate * timeStep * canvas.height) / (canvas.width * parseFloat(heightControl.value));

    fluidHeight -= deltaHeight;

    if (fluidHeight < 0) {
        fluidHeight = 0;
    }

    drawReservoir();

    totalTime -= timeStep;
    timeLabel.textContent = `Tempo de Esvaziamento Restante: ${Math.max(totalTime, 0).toFixed(0)} s`;
    flowRateLabel.textContent = `Vazão: ${flowRate.toFixed(4)} m³/s (${flowRateLiters.toFixed(2)} L/s)`;
    heightText.textContent = `Altura da Lâmina d'Água: ${(fluidHeight / canvas.height * parseFloat(heightControl.value)).toFixed(2)} m`;

    if (fluidHeight > 0 && totalTime > 0) {
        requestAnimationFrame(updateReservoir);
    }
}

function resetSimulation() {
    
    fluidHeight = canvas.height;
    const { flowRate, time } = calculateFlowRateAndTime();
    const flowRateLiters = flowRate * 1000;
    totalTime = time;
    drawReservoir();

    // Atualizar labels sem iniciar a simulação
    timeLabel.textContent = `Tempo de Esvaziamento Estimado: ${totalTime.toFixed(0)} s`;
    flowRateLabel.textContent = `Vazão Estimada: ${flowRate.toFixed(4)} m³/s (${flowRateLiters.toFixed(2)} L/s)`;
}

function updateLabels() {
    cdValueLabel.textContent = cdControl.value;
    radiusValueLabel.textContent = radiusControl.value;
    heightValueLabel.textContent = heightControl.value;
}

function togglePause() {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? 'Esvaziar' : 'Pausar';

    if (!isPaused) {
        updateReservoir();
    }
}

function enforceLimits() {
    let cdValue = parseFloat(cdControl.value);
    let radiusValue = parseFloat(radiusControl.value);
    let heightValue = parseFloat(heightControl.value);

    if (cdValue < 0.3) cdControl.value = 0.3;
    if (cdValue > 0.99) cdControl.value = 0.99;
    if (radiusValue < 1) radiusControl.value = 1;
    if (radiusValue > 15) radiusControl.value = 15;
    if (heightValue < 0.01) heightControl.value = 0.01;
    if (heightValue > 20) heightControl.value = 20;
    
    updateLabels();
}

function syncSliders() {
    cdSlider.value = cdControl.value;
    radiusSlider.value = radiusControl.value;
    heightSlider.value = heightControl.value;
    heightOrificioSlider.value= heightOrificioControl.value;
    widthSlider.value= widthControl.value;
}

cdControl.addEventListener('input', () => {
    enforceLimits();
    updateLabels();
    syncSliders();
    resetSimulation();
});
radiusControl.addEventListener('input', () => {
    enforceLimits();
    updateLabels();
    syncSliders();
    resetSimulation();
});
heightControl.addEventListener('input', () => {
    enforceLimits();
    updateLabels();
    syncSliders();
    resetSimulation();
});

cdSlider.addEventListener('input', () => {
    cdControl.value = cdSlider.value;
    updateLabels();
    resetSimulation();
});
radiusSlider.addEventListener('input', () => {
    radiusControl.value = radiusSlider.value;
    updateLabels();
    resetSimulation();
});
widthSlider.addEventListener('input', () => {
    widthControl.value = widthSlider.value;
    updateLabels();
    resetSimulation();
});

heightOrificioSlider.addEventListener('input', () => {
   heightOrificioControl.value = heightOrificioSlider.value;
    updateLabels();
    resetSimulation();
});

heightSlider.addEventListener('input', () => {
    heightControl.value = heightSlider.value;
    updateLabels();
    resetSimulation();
});



pauseButton.addEventListener('click', togglePause);

adjustCanvasSize();
window.addEventListener('resize', adjustCanvasSize); // Redimensiona o canvas quando a janela for redimensionada
resetSimulation();
