import { ConnectToSocket } from "./../services/connect-to-socket";
import { Component, OnInit, ViewChild, AfterViewInit } from "@angular/core";
import * as RecordRTC from "recordrtc";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements AfterViewInit, OnInit {
  private stream: MediaStream;
  private recordRTC: any;

  @ViewChild("audio")
  audio;

  constructor(private connectToSocket: ConnectToSocket) {
    // Do stuff
  }

  ngOnInit() {
    this.connectToSocket.getMessages().subscribe((data: any) => {
      console.log(data);
    });
  }

  ngAfterViewInit() {
    // set the initial state of the audio
    let audio: HTMLAudioElement = this.audio.nativeElement;
    audio.muted = false;
    audio.controls = true;
    audio.autoplay = false;
  }

  toggleControls() {
    let audio: HTMLAudioElement = this.audio.nativeElement;
    audio.muted = !audio.muted;
    audio.controls = !audio.controls;
    audio.autoplay = !audio.autoplay;
  }

  successCallback(stream: MediaStream) {
    var options = {
      mimeType: "audio/webm"
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let audio: HTMLAudioElement = this.audio.nativeElement;
    audio.src = window.URL.createObjectURL(stream);
    this.toggleControls();
  }

  errorCallback() {
    //handle error here
  }

  processaudio(audioaudioWebMURL) {
    let audio: HTMLAudioElement = this.audio.nativeElement;
    let recordRTC = this.recordRTC;
    audio.src = audioaudioWebMURL;
    this.toggleControls();
    var recordedBlob = recordRTC.getBlob();
    console.log(
      recordRTC.getDataURL(function(dataURL) {
        console.log(dataURL);
      })
    );
    let _this = this;
    recordRTC.getDataURL(function(dataURL) {
      _this.connectToSocket.sendMessage(dataURL);
    });
  }

  startRecording() {
    let mediaConstraints = {
      audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  stopRecording() {
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processaudio.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
  }

  download() {
    this.recordRTC.save("audio.webm");
  }
}
