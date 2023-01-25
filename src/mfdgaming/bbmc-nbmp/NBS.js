const BinaryStream = require('bbmc-binarystream');
const fs = require("fs");

const instruments = [
    "note.harp",
    "note.bass",
    "note.bd",
    "note.snare",
    "note.hat",
    "note.guitar",
    "note.flute",
    "note.bell",
    "note.chime",
    "note.xylophone"
]

class NBS {
    stream;
    songLength;
    songHeight;
    songName;
    songAuthor;
    originalSongAuthor;
    songDescription;
    tempo;
    autoSaving;
    autoSavingDuration;
    timeSigniture;
    minutesSpent;
    leftClicks;
    rightClicks;
    blocksAdded;
    blocksRemoved;
    midiOrSchematicFileName;
    noteBlocks = {};

    constructor(path) {
        this.stream = new BinaryStream(Buffer.from(fs.readFileSync(path, 'binary'), "binary"));
        this.loadHeader();
        this.loadNoteBlocks();
    }
              
    loadHeader() {
        this.songLength = this.stream.readShortLE();
        this.songHeight = this.stream.readShortLE();
        this.songName = this.stream.read(this.stream.readIntLE()).toString("utf-8");
        this.songAuthor = this.stream.read(this.stream.readIntLE()).toString("utf-8");
        this.originalSongAuthor = this.stream.read(this.stream.readIntLE()).toString("utf-8");
        this.songDescription = this.stream.read(this.stream.readIntLE()).toString("utf-8");
        this.tempo = this.stream.readShortLE();
        this.autoSaving = this.stream.readBool();
        this.autoSavingDuration = this.stream.readByte();
        this.timeSigniture = this.stream.readByte();
        this.minutesSpent = this.stream.readIntLE();
        this.leftClicks = this.stream.readIntLE();
        this.rightClicks = this.stream.readIntLE();
        this.blocksAdded = this.stream.readIntLE();
        this.blocksRemoved = this.stream.readIntLE();
        this.midiOrSchematicFileName = this.stream.read(this.stream.readIntLE()).toString("utf-8");
    }
            
    loadNoteBlocks() {
        this.noteBlocks = {};
        let tick = -1
        let jumps = 0
        while (true) {
            jumps = this.stream.readShortLE();
            if (jumps == 0) {
                break;
            }
            tick += jumps;
            let layer = -1
            while (true) {
                jumps = this.stream.readShortLE();
                if (jumps == 0) {
                    break;
                }
                layer += jumps;
                let instrument = instruments[this.stream.readByte()];
                let pitch = 0;
                if (this.songHeight == 0) {
                    pitch = this.stream.readByte() - 33;
                } else if (this.songHeight < 10) {
                    pitch = this.stream.readByte() - 33 + this.songHeight;
                } else {
                    pitch = this.stream.readByte() - 48 + this.songHeight;
                }
                if (!(tick in this.noteBlocks)) {
                    this.noteBlocks[tick] = {layer: [instrument, pitch]};
                } else {
                    this.noteBlocks[tick][layer] = [instrument, pitch];
                }
            }
        }
    }
}

module.exports = NBS;
