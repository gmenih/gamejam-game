var getWebSocket = function ({onmessage}) {

	var roomId = document.getElementById('gameId').value;

	var handShakeData = JSON.stringify({ c: "connect", d: roomId });

    var ws = new WebSocket('ws://localhost:3030');

    var handShake = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(handShakeData);
            window.clearInterval(handShake);
            console.log("Connection is made");
        } else {
            console.log("wait for connection...")
        }
    }, 1000);

    ws.onmessage = onmessage;

    return ws;
}