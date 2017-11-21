import org.w3c.dom.*
import org.w3c.files.Blob
import org.w3c.files.BlobPropertyBag
import org.w3c.files.FileReader
import org.w3c.xhr.BLOB
import org.w3c.xhr.FormData
import org.w3c.xhr.XMLHttpRequest
import org.w3c.xhr.XMLHttpRequestResponseType
import kotlin.browser.document
import kotlin.browser.window

@JsNonModule
external class recorder {
    companion object {
        fun start()
        fun stop(callback: (String) -> Unit)
    }
}

@JsNonModule
external fun dataURItoBlob(url: String): Blob

fun main(args: Array<String>) {

    recorder.stop { }
    val button = document.getElementById("record") as HTMLButtonElement

    fun switchToRecordingState() {
        button.setAttribute("data-state", "recording")
        button.innerHTML = "Stop recording"
    }

    fun switchToWaitingState() {
        button.setAttribute("data-state", "waiting")
        button.disabled = true
    }

    fun switchToReadyState() {
        button.setAttribute("data-state", "ready")
        button.innerHTML = "Start recording"
        button.disabled = false
    }

    fun extractBlobData(url: String, callback: (String) -> Unit) {
        XMLHttpRequest().apply {
            responseType = XMLHttpRequestResponseType.Companion.BLOB
            onload = {
                FileReader().apply {
                    onload = { callback(result) }
                }.readAsDataURL(response as Blob)
            }
            open("GET", url)
        }.send()
    }

    fun getLang(): String {
        val select = document.getElementById("lang") as HTMLSelectElement
        val selectedOption = select.options.get(select.selectedIndex) as HTMLOptionElement
        return selectedOption.value
    }

    fun stopRecording() {
        recorder.stop { blobUrl ->
            extractBlobData(blobUrl, { dataUrl ->
                val data = dataURItoBlob(dataUrl)
                val formData = FormData().apply {
                    append("operation", "speech2text")
                    append("lang", getLang())
                    append("data", data)
                }
                val div = document.getElementById("alternative") as HTMLDivElement
                XMLHttpRequest().apply {
                    open("POST", "/text", true)
                    onreadystatechange = {
                        if (readyState == 4.toShort() && status == 200.toShort()) {
                            div.innerHTML = responseText
                            switchToReadyState()
                        }
                    }
                }.send(formData)
                div.innerHTML = ""
            })
        }
    }

    button.onclick = {
        when (button.getAttribute("data-state")) {
            "ready" -> {
                switchToRecordingState()
                recorder.start()
            }
            "recording" -> {
                switchToWaitingState()
                stopRecording()
            }
            else -> Unit
        }
    }
}



