const PluginStructure = require(`${bbmcPath}/plugin/PluginStructure`);
const NBS = require("./NBS");
const LevelSoundEventPacket = require(`${bbmcPath}/network/packets/LevelSoundEventPacket`);
const PlayCommand = require('./PlayCommand');

const instruments = {
    "note.harp": 0,
    "note.bd": 1,
    "note.snare": 2,
    "note.hat": 3,
    "note.bass": 4,
    "note.bell": 5,
    "note.flute": 6,
    "note.chime": 7,
    "note.guitar": 8,
    "note.xylophone": 9,
    "note.iron_xylophone": 10,
    "note.cow_bell": 11,
    "note.didgeridoo": 12,
    "note.bit": 13,
    "note.banjo": 14,
    "note.pling": 15,
    "note.bassattack": 16
};

class Main extends PluginStructure {
    successfullyEnabled() {
        console.log("bbmc-nbmp enabled");
        this.server.commandsList.add(new PlayCommand(this));
    }

    successfullyDisabled() {
        console.log("bbmc-nbmp disabled");
    }

    handleEvents() {
    }

    async playFile(path, player) {
        let song = new NBS(path);
        for (let tick = 0; tick < song.songLength; ++tick) {
            if (tick in song.noteBlocks) {
                for (const [i, layer] of Object.entries(song.noteBlocks[tick])) {
                    let packet = new LevelSoundEventPacket();
                    packet.soundID = 81;
                    packet.position = player.position;
                    packet.extraData = instruments[layer[0]] << 8 | layer[1];
                    packet.entityType = "minecraft:noteblock";
                    packet.isBabyMob = false;
                    packet.isGlobal = true;
                    packet.sendTo(player);
                }
            }
            await new Promise(resolve => setTimeout(resolve, (1 / (song.tempo / 100)) * 1000));
        }            
    }
}

module.exports = Main;