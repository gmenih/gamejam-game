var getWebSocket = function ({onmessage}) {

    var loc = document.location;

	var roomId = document.getElementById('gameId').value;

	var handShakeData = JSON.stringify({ c: "connect", d: roomId });
    var ws = new WebSocket('ws://' + loc.hostname + ':' + loc.port);

    var handShake = setInterval(function () {
        if (ws.readyState === 1) {
            ws.send(handShakeData);
            window.clearInterval(handShake);
        } else {
        }
    }, 1000);

    ws.onmessage = onmessage;

    return ws;
}