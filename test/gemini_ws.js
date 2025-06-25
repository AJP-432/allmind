const WebSocket = require('ws');

console.log('🚀 Testing AllMind WebSocket connection...\n');

// Connect to your Go WebSocket server
const ws = new WebSocket('ws://localhost:8080/ws');

let messageCount = 0;

ws.on('open', function() {
    console.log('✅ Connected to WebSocket server');
    
    // Send a test message
    const testMessage = {
        type: 'user',
        content: 'Hello! What is AllMind and what can you help me with?',
        timestamp: Date.now()
    };
    
    console.log('📤 Sending message:', testMessage.content);
    ws.send(JSON.stringify(testMessage));
});

ws.on('message', function(data) {
    const message = JSON.parse(data.toString());
    messageCount++;
    
    console.log(`\n📨 Message ${messageCount} received:`);
    console.log(`Type: ${message.type}`);
    console.log(`Content: ${message.content}`);
    console.log(`Timestamp: ${new Date(message.timestamp * 1000).toLocaleTimeString()}`);
    
    // After receiving both user echo and AI response, send another message
    if (messageCount === 2) {
        setTimeout(() => {
            const secondMessage = {
                type: 'user',
                content: 'Tell me about financial data analysis.',
                timestamp: Date.now()
            };
            console.log('\n📤 Sending second message:', secondMessage.content);
            ws.send(JSON.stringify(secondMessage));
        }, 1000);
    }
    
    // Close after receiving 4 messages (2 conversations)
    if (messageCount === 4) {
        setTimeout(() => {
            console.log('\n✅ Test completed successfully!');
            ws.close();
        }, 2000);
    }
});

ws.on('error', function(error) {
    console.error('❌ WebSocket error:', error.message);
});

ws.on('close', function() {
    console.log('🔌 WebSocket connection closed');
    process.exit(0);
});

// Handle Ctrl+C
process.on('SIGINT', function() {
    console.log('\n👋 Closing connection...');
    ws.close();
});