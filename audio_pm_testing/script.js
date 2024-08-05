    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const scriptProcessor = audioContext.createScriptProcessor(256, 1, 1);

        analyser.smoothingTimeConstant = 0.85;  // ปรับ smoothing time constant
        analyser.fftSize = 2048;  // เพิ่ม fft size เพื่อเพิ่มความละเอียด

        microphone.connect(analyser);
        analyser.connect(scriptProcessor);
        scriptProcessor.connect(audioContext.destination);

        const canvas = document.getElementById('spectrum');
        const canvasCtx = canvas.getContext('2d');
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        scriptProcessor.onaudioprocess = () => {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            const values = array.reduce((a, b) => a + b, 0);
            const average = values / array.length;
            const dB = Math.max(0, Math.min(100, Math.round(average / 1.5)));  // ปรับค่าเพื่อให้เหมาะสมกับระดับความไว

            document.getElementById('current').textContent = `${dB} dB`;
            document.getElementById('bar').style.height = `${dB}%`;

            // วาดกราฟ spectrum
            canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
            canvasCtx.fillStyle = '#00e676';
            const barWidth = (canvas.width / array.length) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < array.length; i++) {
                barHeight = array[i] / 1.5;  // ปรับค่าเพื่อให้กราฟมีความไวที่เหมาะสม
                canvasCtx.fillRect(x, canvas.height - barHeight / 2, barWidth, barHeight / 2);
                x += barWidth + 1;
            }
        };
    })
    .catch(err => console.error(err));

// ฟังก์ชันเพื่ออัพเดทวันที่และเวลา
function updateDateTime() {
    const now = new Date();
    const dateTimeString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    document.getElementById('date-time').textContent = dateTimeString;
}

// เรียกฟังก์ชันเพื่ออัพเดททุกวินาที
setInterval(updateDateTime, 1000);