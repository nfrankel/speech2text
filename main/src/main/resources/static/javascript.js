if (typeof kotlin === 'undefined') {
  throw new Error("Error loading module 'javascript'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'javascript'.");
}
var javascript = function (_, Kotlin) {
  'use strict';
  var Unit = Kotlin.kotlin.Unit;
  var throwCCE = Kotlin.throwCCE;
  var equals = Kotlin.equals;
  function main$lambda(it) {
    return Unit;
  }
  function main$switchToRecordingState(closure$button) {
    return function () {
      closure$button.setAttribute('data-state', 'recording');
      closure$button.innerHTML = 'Stop recording';
    };
  }
  function main$switchToWaitingState(closure$button) {
    return function () {
      closure$button.setAttribute('data-state', 'waiting');
      closure$button.disabled = true;
    };
  }
  function main$switchToReadyState(closure$button) {
    return function () {
      closure$button.setAttribute('data-state', 'ready');
      closure$button.innerHTML = 'Start recording';
      closure$button.disabled = false;
    };
  }
  function main$extractBlobData$lambda$lambda$lambda$lambda(closure$callback, this$) {
    return function (it) {
      closure$callback(this$.result);
      return Unit;
    };
  }
  function main$extractBlobData$lambda$lambda(closure$callback, this$) {
    return function (it) {
      var tmp$;
      var $receiver = new FileReader();
      $receiver.onload = main$extractBlobData$lambda$lambda$lambda$lambda(closure$callback, $receiver);
      $receiver.readAsDataURL(Kotlin.isType(tmp$ = this$.response, Blob) ? tmp$ : throwCCE());
      return Unit;
    };
  }
  function main$extractBlobData(url, callback) {
    var $receiver = new XMLHttpRequest();
    $receiver.responseType = 'blob';
    $receiver.onload = main$extractBlobData$lambda$lambda(callback, $receiver);
    $receiver.open('GET', url);
    $receiver.send();
  }
  function main$getLang() {
    var tmp$, tmp$_0;
    var select = Kotlin.isType(tmp$ = document.getElementById('lang'), HTMLSelectElement) ? tmp$ : throwCCE();
    var selectedOption = Kotlin.isType(tmp$_0 = select.options[select.selectedIndex], HTMLOptionElement) ? tmp$_0 : throwCCE();
    return selectedOption.value;
  }
  function main$stopRecording$lambda$lambda$lambda$lambda(this$, closure$div, closure$switchToReadyState) {
    return function (it) {
      if (this$.readyState === Kotlin.toShort(4) && this$.status === Kotlin.toShort(200)) {
        closure$div.innerHTML = this$.responseText;
        closure$switchToReadyState();
      }
      return Unit;
    };
  }
  function main$stopRecording$lambda$lambda(closure$getLang, closure$switchToReadyState) {
    return function (dataUrl) {
      var tmp$;
      var data = dataURItoBlob(dataUrl);
      var $receiver = new FormData();
      var closure$getLang_0 = closure$getLang;
      $receiver.append('operation', 'speech2text');
      $receiver.append('lang', closure$getLang_0());
      $receiver.append('data', data);
      var formData = $receiver;
      var div = Kotlin.isType(tmp$ = document.getElementById('alternative'), HTMLDivElement) ? tmp$ : throwCCE();
      var $receiver_0 = new XMLHttpRequest();
      var closure$switchToReadyState_0 = closure$switchToReadyState;
      $receiver_0.open('POST', '/text', true);
      $receiver_0.onreadystatechange = main$stopRecording$lambda$lambda$lambda$lambda($receiver_0, div, closure$switchToReadyState_0);
      $receiver_0.send(formData);
      div.innerHTML = '';
      return Unit;
    };
  }
  function main$stopRecording$lambda(closure$getLang, closure$switchToReadyState, closure$extractBlobData) {
    return function (blobUrl) {
      closure$extractBlobData(blobUrl, main$stopRecording$lambda$lambda(closure$getLang, closure$switchToReadyState));
      return Unit;
    };
  }
  function main$stopRecording(closure$getLang, closure$switchToReadyState, closure$extractBlobData) {
    return function () {
      recorder.stop(main$stopRecording$lambda(closure$getLang, closure$switchToReadyState, closure$extractBlobData));
    };
  }
  function main$lambda_0(closure$button, closure$switchToRecordingState, closure$switchToWaitingState, closure$stopRecording) {
    return function (it) {
      var tmp$;
      tmp$ = closure$button.getAttribute('data-state');
      if (equals(tmp$, 'ready')) {
        closure$switchToRecordingState();
        recorder.start();
      }
       else if (equals(tmp$, 'recording')) {
        closure$switchToWaitingState();
        closure$stopRecording();
      }
      return Unit;
    };
  }
  function main(args) {
    var tmp$;
    recorder.stop(main$lambda);
    var button = Kotlin.isType(tmp$ = document.getElementById('record'), HTMLButtonElement) ? tmp$ : throwCCE();
    var switchToRecordingState = main$switchToRecordingState(button);
    var switchToWaitingState = main$switchToWaitingState(button);
    var switchToReadyState = main$switchToReadyState(button);
    var extractBlobData = main$extractBlobData;
    var getLang = main$getLang;
    var stopRecording = main$stopRecording(getLang, switchToReadyState, extractBlobData);
    button.onclick = main$lambda_0(button, switchToRecordingState, switchToWaitingState, stopRecording);
  }
  _.main_kand9s$ = main;
  main([]);
  Kotlin.defineModule('javascript', _);
  return _;
}(typeof javascript === 'undefined' ? {} : javascript, kotlin);
