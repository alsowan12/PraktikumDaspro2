// Kalkulator
const display = document.getElementById('display');
const errorEl = document.getElementById('error');
let currentInput = '0';
let operator = null;
let previousInput = null;

function updateDisplay() {
    display.value = currentInput;
}

function showError(msg) {
    errorEl.textContent = msg;
}

function clearError() {
    errorEl.textContent = '';
}

function appendToDisplay(value) {
    clearError();
    if (currentInput === '0' && value !== '.') {
        currentInput = value;
    } else {
        currentInput += value;
    }
    updateDisplay();
}

function clearDisplay() {
    currentInput = '0';
    operator = null;
    previousInput = null;
    updateDisplay();
    clearError();
}

function deleteLast() {
    clearError();
    currentInput = currentInput.slice(0, -1) || '0';
    updateDisplay();
}

function calculate() {
    if (!operator || previousInput === null) return;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);
    let result;
    switch (operator) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/':
            if (curr === 0) {
                showError('Error: Pembagian dengan nol tidak diperbolehkan!');
                return;
            }
            result = prev / curr; break;
        default: return;
    }
    currentInput = result.toString();
    operator = null;
    previousInput = null;
    updateDisplay();
}

document.querySelectorAll('button[data-num]').forEach(btn => {
    btn.addEventListener('click', () => appendToDisplay(btn.getAttribute('data-num')));
});

document.querySelectorAll('button.operator').forEach(btn => {
    btn.addEventListener('click', () => {
        clearError();
        if (operator && previousInput !== null) {
            calculate();
        }
        operator = btn.getAttribute('data-op');
        previousInput = currentInput;
        currentInput = '0';
        updateDisplay();
    });
});

document.getElementById('clear').addEventListener('click', clearDisplay);
document.getElementById('delete').addEventListener('click', deleteLast);
document.getElementById('equals').addEventListener('click', calculate);

// Keyboard support
document.addEventListener('keydown', e => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') appendToDisplay(e.key);
    else if (['+', '-', '*', '/'].includes(e.key)) {
        clearError();
        if (operator && previousInput !== null) calculate();
        operator = e.key;
        previousInput = currentInput;
        currentInput = '0';
        updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') calculate();
    else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') clearDisplay();
    else if (e.key === 'Backspace') deleteLast();
});

// Pedometer
const startBtn = document.getElementById('start-pedometer');
const stopBtn = document.getElementById('stop-pedometer');
const distanceDisplay = document.getElementById('distance-display');
const stepsDisplay = document.getElementById('steps-display');
const sensorError = document.getElementById('sensor-error');

let isTracking = false;
let steps = 0;
const accelerationThreshold = 1.5;
let lastAcceleration = 0;

function updatePedometerDisplay() {
    const distance = (steps * 0.7).toFixed(2);
    distanceDisplay.textContent = `Jarak: ${distance} meter`;
    stepsDisplay.textContent = `Langkah: ${steps}`;
}

function showSensorError(msg) {
    sensorError.textContent = msg;
    sensorError.style.display = 'block';
}

function clearSensorError() {
    sensorError.textContent = '';
    sensorError.style.display = 'none';
}

function handleMotion(event) {
    if (!isTracking) return;
    const acc = event.accelerationIncludingGravity;
    if (acc) {
        const currentAcc = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
        const diff = Math.abs(currentAcc - lastAcceleration);
        if (diff > accelerationThreshold) {
            steps++;
            updatePedometerDisplay();
        }
        lastAcceleration = currentAcc;
    }
}

function startPedometer() {
    clearSensorError();
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission()
            .then(permission => {
                if (permission === 'granted') {
                    initPedometer();
                } else {
                    showSensorError('Izin sensor gerak ditolak.');
                }
            })
            .catch(err => showSensorError('Gagal meminta izin sensor: ' + err.message));
    } else {
        initPedometer();
    }
}

function initPedometer() {
    isTracking = true;
    steps = 0;
    lastAcceleration = 0;
    updatePedometerDisplay();
    startBtn.style.display = 'none';
    stopBtn.style.display = 'inline-block';
    window.addEventListener('devicemotion', handleMotion);
}

function stopPedometer() {
    isTracking = false;
    window.removeEventListener('devicemotion', handleMotion);
    startBtn.style.display = 'inline-block';
    stopBtn.style.display = 'none';
}

startBtn.addEventListener('click', startPedometer);
stopBtn.addEventListener('click', stopPedometer);
