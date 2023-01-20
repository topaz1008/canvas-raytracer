import { scene } from './src/scene1.js';

const canvas = document.querySelector('#canvas'),
    context = canvas.getContext('2d');

canvas.width = scene.imageWidth;
canvas.height = scene.imageHeight;

// Clear the canvas
context.clearRect(0, 0, scene.imageWidth, scene.imageHeight);

// Set up the worker as the render thread
const worker = new Worker('./src/raytrace-worker.js', { type: 'module' });

worker.addEventListener('message', (e) => {
    const data = e.data;

    context.putImageData(data, 0, 0);

    const el = document.querySelector('#rendering')
    el.remove();

}, false);

worker.postMessage({ scene });
