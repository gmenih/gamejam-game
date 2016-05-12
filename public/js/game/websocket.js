var getWebSocket = function ({onconnected, onmessage }) {

	var room_id = window.location.hash.replace('#', '');

	var hand_shake_data = JSON.stringify({ c: "connect", d: room_id });

    var ws = new WebSocket('ws://localhost:3030');

    var hand_shake = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(hand_shake_data);
            onconnected();
            window.clearInterval(hand_shake);
            console.log("Connection is made");
        } else {
            console.log("wait for connection...")
        }
    }, 1000);

    ws.onmessage = onmessage;

    return ws;
}