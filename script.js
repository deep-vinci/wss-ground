// const msgObj = {
//     type: "",
//     msg: "",
// };

(function () {
    const sendBtn = document.querySelector("#send");
    const messages = document.querySelector("#messages");
    const messageBox = document.querySelector("#messageBox");

    let ws;

    function showMessage(message) {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type == "input") {
            messageBox.value = `${parsedMessage.msg}`;
        } else if (parsedMessage.type == "message") {
            messages.textContent += `${parsedMessage.msg}\n\n`;
        }
    }

    function init() {
        if (ws) {
            ws.onerror = ws.onopen = ws.onclose = null;
            ws.close();
        }

        ws = new WebSocket("ws://localhost:6969");
        ws.onopen = () => {
            console.log("Connection opened!");
        };
        ws.onmessage = ({ data }) => showMessage(data);
        ws.onclose = function (event) {
            if (event.wasClean) {
                console.log("Closed unexpectedly");
            }

            ws = null;
        };

        ws.onerror = function (err) {
            console.err(err.message);
        };
    }

    messageBox.addEventListener("keydown", (event) => {
        if (event.key == "Enter") {
            event.preventDefault();
            if (!ws || ws.readyState !== WebSocket.OPEN) {
                console.error("No WebSocket connection :(");
                return;
            }
            ws.send(
                JSON.stringify({
                    type: "message",
                    msg: messageBox.value,
                }),
            );
            // empty char at the end after enter
            ws.send(
                JSON.stringify({
                    type: "input",
                    msg: "",
                }),
            );
            messages.textContent += `${messageBox.value}\n\n`;
            messageBox.value = "";
        }
        if (event.key != "Enter") {
            ws.send(
                JSON.stringify({
                    type: "input",
                    msg: messageBox.value,
                }),
            );
        }
    });

    init();
})();
