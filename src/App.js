import React, { useState } from 'react';
import KeyboardVer1 from './KeyboardVer1';
import './App.css';
import Header from './Header';
import { ModalButton } from './ModalButton';
import { chord, clip, midi } from 'scribbletune';
import Midi from './Midi';
import { Key, Scale } from '@tonaljs/modules';
import * as Tonal from "@tonaljs/tonal";
import ReactPlayer from 'react-player'

var MidiWriter = require('midi-writer-js');

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

var currentIndex = 0
var currentDurationIndex = 0

var file;
var base64;

const chordsClip = clip({
  // Use chord names directly in the notes array
  // M stands for Major, m stands for minor
  notes: 'C',
  pattern: 'x---'.repeat(4)
});

console.log(chordsClip)

function App() {

  const [currentDurationIndexdefault ,currentDurationIndexNew] = useState("0")
  const [player ,setPlayer] = useState("none")

  function handleSelect(e) {
    chordMap.filter((item, index) => {


      console.log("key checking...",e.target.value, item.key);

      if (e.target.value === item.key) {

        setChords(chordMap[index])
        setpianoKey(chordMap[index].key)


      }
    })


    genChords();
  }

  function handleDurationSelect(e) {

    durationsArr.forEach( (i,idx, n) => {

      console.log("i.key", i.duration)
      console.log("e.target.value", e.target.value)

        if (i.duration == e.target.value)
        {
          // currentDurationIndex = idx;
          currentDurationIndexNew(idx)

          setTimeout(() => {
            console.log("MATCH", currentDurationIndexdefault);
          }, 10);

        }
    })


  }

  const [instrument, setInstrument] = useState('acoustic_grand_piano');

  const durationsArr =
    [
      { key: 'whole', duration:  '1'},
      { key: 'half', duration:  '2'},
      { key: 'dotted half', duration:  'd2'},
      { key: 'double dotted half', duration:  'dd2'},
      { key: 'quarter', duration:  '4'},
      { key: 'quarter triplet', duration:  '4t'},
      { key: 'dotted quarter', duration:  'd4'},
      { key: 'double dotted quarter', duration:  'dd4'},
      { key: 'eighth', duration:  '8'},
      { key: 'eighth triplet', duration:  '8t'},
      { key: 'dotted eighth', duration:  'd8'},
      { key: 'double dotted eighth', duration:  'dd8'},
      { key: 'sixteenth', duration:  '16'},
      { key: 'sixteenth triplet', duration:  '16t'},
      { key: 'thirty-second', duration:  '32'},
      { key: 'sixty-fourth', duration:  '64'},
    ]


  const [chordMap, setChorMap] = useState([
    { key: 'C', chords: [{ key: 'Am7', Scale: 'vi7' }, { key: 'Cmaj7', Scale: 'I7' }, { key: 'Am7', Scale: 'vi7' }, { key: 'Fmaj7', Scale: 'IV7' }] },
    { key: 'C#/Db', chords: [{ key: 'Bbm7', Scale: 'vi7' }, { key: 'Dbmaj7', Scale: 'I7' }, { key: 'Bbm7', Scale: 'vi7' }, { key: 'Gbmaj7', Scale: 'IV7' }] },
    { key: 'D', chords: [{ key: 'Bm7', Scale: 'vi7' }, { key: 'Dmaj7', Scale: 'I7' }, { key: 'Bm7', Scale: 'vi7' }, { key: 'Gmaj7', Scale: 'IV7' }] },
    { key: 'D#/Eb', chords: [{ key: 'Cm7', Scale: 'vi7' }, { key: 'Ebmaj7', Scale: 'I7' }, { key: 'Cm7', Scale: 'vi7' }, { key: 'Abmaj7', Scale: 'IV7' }] },
    { key: 'E', chords: [{ key: 'C#m7', Scale: 'vi7' }, { key: 'Emaj7', Scale: 'I7' }, { key: 'C#m7', Scale: 'vi7' }, { key: 'Amaj7', Scale: 'IV7' }] },
    { key: 'F', chords: [{ key: 'Dm7', Scale: 'vi7' }, { key: 'Fmaj7', Scale: 'I7' }, { key: 'Dm7', Scale: 'vi7' }, { key: 'Bbmaj7', Scale: 'IV7' }] },
    { key: 'F#/Gb', chords: [{ key: 'D#m7', Scale: 'vi7' }, { key: 'F#maj7', Scale: 'I7' }, { key: 'D#m7', Scale: 'vi7' }, { key: 'Bmaj7', Scale: 'IV7' }] },
    { key: 'G', chords: [{ key: 'Em7', Scale: 'vi7' }, { key: 'Gmaj7', Scale: 'I7' }, { key: 'Em7', Scale: 'vi7' }, { key: 'Cmaj7', Scale: 'IV7' }] },
    { key: 'G#/Ab', chords: [{ key: 'Fm7', Scale: 'vi7' }, { key: 'Abmaj7', Scale: 'I7' }, { key: 'Fm7', Scale: 'vi7' }, { key: 'Dbmaj7', Scale: 'IV7' }] },
    { key: 'A', chords: [{ key: 'F#m7', Scale: 'vi7' }, { key: 'Amaj7', Scale: 'I7' }, { key: 'F#m7', Scale: 'vi7' }, { key: 'Dmaj7', Scale: 'IV7' }] },
    { key: 'A#/Bb', chords: [{ key: 'Gm7', Scale: 'vi7' }, { key: 'Bbmaj7', Scale: 'I7' }, { key: 'Gm7', Scale: 'vi7' }, { key: 'Ebmaj7', Scale: 'IV7' }] },
    { key: 'B', chords: [{ key: 'G#m7', Scale: 'vi7' }, { key: 'Bmaj7', Scale: 'I7' }, { key: 'G#m7', Scale: 'vi7' }, { key: 'Emaj7', Scale: 'IV7' }] }
  ])
  const [keys, setKeys] = useState([{ key: 'C' }, { key: 'C#/Db' }, { key: 'D' }, { key: 'D#/Eb' }, { key: 'E' }, { key: 'F#/Gb' },
  { key: 'G' }, { key: 'G#/Ab' }, { key: 'A' }, { key: 'A#/Bb' }, { key: 'B' }
  ])

  const [currentChords, setChords] = useState(chordMap[0])


  const [pianoKey, setpianoKey] = useState('D')


  const genChords = () => {
    currentIndex = Math.floor(Math.random() * chordMap.length)
    currentDurationIndexNew(Math.floor(Math.random() * durationsArr.length))
    currentDurationIndex = Math.floor(Math.random() * durationsArr.length)

    setChords(chordMap[currentIndex])
    setpianoKey(chordMap[currentIndex].key)

    prepareChordFile();
    // download();
  }


  const prepareChordFile = () => {

    // console.log("Prepare chord ", chordMap[currentIndex]["key"]);
    var tracks = [];

    // Lead Instrument
    tracks[0] = new MidiWriter.Track();
    tracks[0].addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}));


    // console.log(chordMap[currentIndex]);


    var times = 20

    while (times > 1)
    {
      chordMap[currentIndex]["chords"].forEach( function(i, idx, n){
        var chords = chord(i.key)
        tracks[0].addEvent(new MidiWriter.NoteEvent({pitch: chords, duration: durationsArr[currentDurationIndexdefault].duration}))
      })

      times -= 1
    }


    //background tone

    var bg_times = 20


    tracks[1] = new MidiWriter.Track();
    tracks[1].addEvent(new MidiWriter.ProgramChangeEvent({instrument : 1}));


    var currentBgIndex = Math.floor(Math.random() * 13)

    console.log("Prepare bg ", currentBgIndex);


    while (bg_times > 1)
    {
      switch (currentBgIndex)
      {
        case 0:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '4', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F3'], duration: '4', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb3'], duration: '2', velocity:50}));
          break;

        case 1:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '4', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Eb3'], duration: '4', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab3'], duration: '2', velocity:50}));
          break;
          break;

        case 2:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Eb2'], duration: '4', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db3'], duration: '4', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb3'], duration: '2', velocity:50}));
          break;

        case 3:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '4', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F3'], duration: '4', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb3'], duration: '2', velocity:50}));
          break;

        case 4:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          break;

        case 5:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          break;

        case 6:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          break;

        case 7:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Eb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Eb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Eb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Eb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Eb2'], duration: '16', velocity:50}));
          break;

        case 8:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db2'], duration: '16', velocity:50}));
          break;

        case 9:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db3'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db3'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db3'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Db3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab2'], duration: '16', velocity:50}));
          break;

        case 10:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['B2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb2'], duration: '16', velocity:50}));
          break;

        case 11:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Bb2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '16', velocity:50}));
          break;

        case 12:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C3'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C3'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C3'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G2'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['C3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G2'], duration: '16', velocity:50}));
          break;

        case 13:
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['A3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab3'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Ab3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G3'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['G3'], duration: '16', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['Gb3'], duration: '8', velocity:50}));
          tracks[1].addEvent(new MidiWriter.NoteEvent({pitch: ['F2'], duration: '8', velocity:50}));
          break;

      }



      bg_times -= 1
    }

    var write = new MidiWriter.Writer(tracks);
    file = write.buildFile();
    base64 = write.base64();
    setPlayer(base64)



    window.alert("Generated Key: "+chordMap[currentIndex]["key"] + ", Background Tone No: "+currentBgIndex + ", Speed: "+ durationsArr[currentDurationIndexdefault].key);
  }

  const download = () =>
  {
    var a = document.createElement("a"); //Create <a>
    a.href = "data:audio/midi;base64," + base64; //Image Base64 Goes here
    a.download = "file.midi"; //File name Here
    a.click();
  }

  const string64 = (fileUrl) => {

    // Split the base64 string in data and contentType
    var block = fileUrl.split(";");
    // Get the content type of the image
    var contentType = block[0].split(":")[1];// In this case "image/gif"
    // get the real base64 content of the file
    var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

    // Convert it to a blob to upload
    return b64toBlob(realData, contentType);

  }

  function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = btoa(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
    }

  return (
    <div>
      <Header />
      <div className="container">
        <div className="center text-center mt-5">
          <div
            className="sweet-round-button medium"
            data-toggle="modal"
            data-target="#exampleModalScrollable"
          >
            <i className="icon-music icon medium"></i>
            <div className="name medium">Enstruman Ayarlari</div>
          </div>
        </div>

        <div
          className="modal fade"
          id="exampleModalScrollable"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="exampleModalScrollableTitle"
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalScrollableTitle">
                  Enstruman Ayarlari
                </h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <div className="container-fluid">
                  <div className="row">
                    <div className="col-md-6 ml-auto">
                      <ModalButton
                        onClick={() => {
                          setInstrument('acoustic_grand_piano');
                        }}
                        instrument={'Piano'}
                      />
                    </div>
                    <div className="col-md-6 ml-auto">
                      <ModalButton
                        onClick={() => {
                          setInstrument('marimba');
                        }}
                        instrument={'Marimba'}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 ml-auto">
                      <ModalButton
                        onClick={() => {
                          setInstrument('acoustic_guitar_nylon');
                        }}
                        instrument={'Kasik Gitar'}
                      />
                    </div>
                    <div className="col-md-6 ml-auto">
                      <ModalButton
                        onClick={() => {
                          setInstrument('xylophone');
                        }}
                        instrument={'Xylophone'}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-light" data-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-5">
          <div className="col-md-8 offset-md-2">
            <KeyboardVer1
              startNote='c3'
              endNote='f5'
              audioContext={audioContext}
              soundfontHostname={soundfontHostname}
              instrumentName={instrument}
            />
          </div>
        </div>
        <hr className="mt-5" />
        <div className="row mt-5">
          <div className="col-md-8 offset-md-2">
            <div className="generator-centered-block">

              {
                currentChords.chords.map(chord => {

                  return <div className="generator-chord-block-div">
                    <div className="chord">{chord.key}</div>
                    <div className="degree">{chord.Scale}</div>
                    <i className="fas fa-sliders-h icon-edit "></i>
                  </div>
                })
              }
            </div>
          </div>
        </div>
        <hr className="mt-5" />
        <div className="row mt-5">
          <div className="col">
            <div style={{ textAlign: 'center', padding: '30px', lineHeight: '20px' }}>
              <p> Key </p>
              <select value={pianoKey} onChange={(e) => { handleSelect(e) }}>
                {
                  keys.map(key => {
                    return <option value={key.key}>{key.key}</option>
                  })
                }
              </select>
            </div>

            <div style={{ textAlign: 'center', padding: '30px', lineHeight: '20px' }}>

              <p> Duration({durationsArr[currentDurationIndexdefault].key}) </p>
              {console.log("selected duration :: ", currentDurationIndexdefault)}
              {
                // <select value={durationsArr[currentDurationIndexdefault].key} onChange={(e) => { handleDurationSelect(e) }}>
              //   {
              //     durationsArr.map(durationKey => {
              //
              //       return <option value={durationKey.duration}>{durationKey.key}</option>
              //     })
              //   }
              // </select>
            }
            </div>



            <div className="generator-centered-block top-24-12 bottom-24-12">
              <div
                className="sweet-round-button large"
              >
                <i className="icon-shuffle icon large"></i>
                <div onClick={() => { genChords() }} className="name large">Generate</div>

              </div>
            </div>

            <br />
            {
              console.log("player link :: data:audio/midi;base64"+player)
            }
            <div className="generator-centered-block top-24-12 bottom-24-12">
              <div
                className="sweet-round-button large"
              >
                <i className="icon-shuffle icon large"></i>
                <div onClick={() => { download() }} className="name large">Download</div>

              </div>
            </div>

            <br />
            <ReactPlayer url={string64("data:audio/midi;base64"+player)} playing />







          </div>
        </div>
      </div>
    </div>
  );
}


export default App;
