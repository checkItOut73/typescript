const webSocket = new WebSocket('ws://docker-vm:8080/');

webSocket.onmessage = function (event) {
    if ('compilationDone' === event.data) {
        window.location.reload();
    }
};
