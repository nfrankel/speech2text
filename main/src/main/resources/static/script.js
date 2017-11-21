(function () {
    var button = document.getElementById("record");
    button.onclick = function () {
        var state = button.getAttribute("data-state");
        switch (state) {
            case "ready":
                switchToRecordingState();
                recorder.start();
                break;
            case "recording":
                switchToWaitingState();
                stopRecording();
                break;
        }
    };

    function switchToRecordingState() {
        button.setAttribute("data-state", "recording");
        button.innerHTML = "Stop recording";
    }

    function switchToWaitingState() {
        button.setAttribute("data-state", "waiting");
        button.disabled = true;
    }

    function switchToReadyState() {
        button.setAttribute("data-state", "ready");
        button.innerHTML = "Start recording";
        button.disabled = false;
    }

    function dataURItoBlob(url) {
        var byteString = atob(url.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ab], {type: 'audio/wav,base64'});
    }

    function extractBlobData(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.responseType = "blob";
        xhr.onload = function () {
            var recoveredBlob = xhr.response;
            var reader = new FileReader;
            reader.onload = function () {
                callback(reader.result);
            };
            reader.readAsDataURL(recoveredBlob);
        };
        xhr.open('GET', url);
        xhr.send();
    }

    function stopRecording() {
        recorder.stop(function (blobUrl) {
            extractBlobData(blobUrl, function (dataUrl) {
                var formData = new FormData();
                formData.append("operation", "speech2text");
                formData.append("lang", getLang());
                var data = dataURItoBlob(dataUrl);
                formData.append("data", data);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "/text", true);
                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        document.getElementById("alternative").innerHTML = xhr.responseText;
                        switchToReadyState();
                    }
                };
                xhr.send(formData);
                document.getElementById("alternative").innerHTML = "";
            });
        });
    }

    function getLang() {
        var select = document.getElementById("lang");
        var selectedOption = select.options[select.selectedIndex];
        return selectedOption.value
    }
})();