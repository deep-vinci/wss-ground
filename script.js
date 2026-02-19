const msgObj = {
    type: "",
    msg: "",
};

(function () {
    const sendBtn = document.querySelector("#send");
    const messages = document.querySelector("#messages");
    const messageBox = document.querySelector("#messageBox");

    let ws;

    function showMessage(message) {
        const parsedMessage = JSON.parse(message);

        if (parsedMessage.type == "input") {
            messageBox.value = `${parsedMessage.msg}`;
        } else if (parsedMessage.type == "msg") {
            messages.textContent += `\n${parsedMessage.msg}`;
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

    messageBox.addEventListener("input", (event) => {
        if (event.key == "Enter") {
            event.preventDefault();

            if (!ws) {
                showMessage("No WebSocket connection :(");
                return;
            }
        }
        if (event.key != "Enter") {
            ws.send(
                JSON.stringify({
                    type: "input",
                    msg: messageBox.value,
                }),
            );
        }

        // ws.send(messageBox.value);
        showMessage(
            JSON.stringify({
                type: "input",
                msg: messageBox.value,
            }),
        );
    });

    init();
})();
