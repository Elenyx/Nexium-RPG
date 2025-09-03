const { createCanvas } = require('canvas');

console.log('Testing Canvas text rendering...');

try {
    const canvas = createCanvas(400, 200);
    const ctx = canvas.getContext('2d');

    // Fill background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 400, 200);

    // Test text rendering
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Test Text', 50, 100);

    console.log('✅ Canvas text rendering successful!');
    console.log('Fontconfig error resolved or not present.');

} catch (error) {
    console.error('❌ Canvas text rendering failed:', error.message);
    console.error('This might be related to fontconfig on Windows.');
}
