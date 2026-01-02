package com.minmin.audio.transcriber;

import java.io.File;
import java.io.IOException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ai.audio.transcription.AudioTranscriptionPrompt;
import org.springframework.ai.audio.transcription.AudioTranscriptionResponse;
import org.springframework.ai.openai.OpenAiAudioTranscriptionModel;
import org.springframework.ai.openai.OpenAiAudioTranscriptionOptions;
import org.springframework.ai.openai.api.OpenAiAudioApi;
import org.springframework.ai.openai.api.OpenAiAudioApi.TranscriptResponseFormat;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.PostMapping;

@RestController
@RequestMapping("api/transcriptions")
public class TranscriptionController {

    private final OpenAiAudioTranscriptionModel transcriptionModel;

    public TranscriptionController(@Value("${spring.ai.openai.api-key}") String openApiKey) {
        OpenAiAudioApi openAiAudioApi = OpenAiAudioApi.builder()
                .apiKey(openApiKey)
                .build();
        this.transcriptionModel = new OpenAiAudioTranscriptionModel(openAiAudioApi);
    }

    @PostMapping
    public ResponseEntity<String> transcribeAudio(@RequestParam("file") MultipartFile file) throws IOException {
        File templateFile = File.createTempFile("audio-", ".wav");
        file.transferTo(templateFile);

        OpenAiAudioTranscriptionOptions transcriptionOptions = OpenAiAudioTranscriptionOptions.builder()
                .responseFormat(TranscriptResponseFormat.TEXT)
                .language("en")
                .temperature(0f)
                .build();

        FileSystemResource audioFile = new FileSystemResource(templateFile);

        AudioTranscriptionPrompt transcriptionRequest = new AudioTranscriptionPrompt(audioFile,
                transcriptionOptions);
        AudioTranscriptionResponse response = transcriptionModel.call(transcriptionRequest);

        templateFile.delete();
        return new ResponseEntity<>(response.getResult().getOutput(), HttpStatus.OK);
    }

}
