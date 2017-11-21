package ch.frankel.blog.speechtotext

import com.google.cloud.speech.v1.RecognitionAudio
import com.google.cloud.speech.v1.RecognitionConfig
import com.google.cloud.speech.v1.SpeechClient
import com.google.protobuf.ByteString
import org.springframework.boot.*
import org.springframework.boot.autoconfigure.*
import org.springframework.stereotype.*
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.*

@SpringBootApplication
class Speech2TextApp

@Controller
class SpeechToTextController {

    @PostMapping("/text")
    @ResponseBody
    fun translate(@RequestParam data: MultipartFile, @RequestParam lang: String): String {

        // Instantiates a client
        SpeechClient.create().use {

            val audioBytes = ByteString.readFrom(data.inputStream)

            // Builds the sync recognize request
            val config = RecognitionConfig.newBuilder().apply {
                encoding = RecognitionConfig.AudioEncoding.LINEAR16
                languageCode = lang
            }.build()

            val audio = RecognitionAudio.newBuilder().apply { content = audioBytes }.build()

            // Performs speech recognition on the audio file
            val response = it.recognize(config, audio)

            return response.resultsList.firstOrNull()?.alternativesList?.firstOrNull()?.transcript ?: "No match found, try again"
        }
    }
}

fun main(args: Array<String>) {
    SpringApplication.run(Speech2TextApp::class.java, *args)
}
