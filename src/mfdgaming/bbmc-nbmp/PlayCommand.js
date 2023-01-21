const CommandArgumentFlags = require(`${bbmcPath}/network/constants/CommandArgumentFlags`);
const CommandArgumentTypes = require(`${bbmcPath}/network/constants/CommandArgumentTypes`);
const CommandParam = require(`${bbmcPath}/network/types/CommandParam`);
const Command = require(`${bbmcPath}/command/Command`);
const Player = require(`${bbmcPath}/player/Player`);

class PlayCommand extends Command {
    main;

    constructor(main) {
        let cmdParam = new CommandParam();
        cmdParam.name = "file";
        cmdParam.optional = true;
        cmdParam.typeID = CommandArgumentFlags.valid | CommandArgumentTypes.rawText;
        cmdParam.options = 0;
        cmdParam.suffixes = [];
        super("play", "play command", [], [cmdParam]);
        this.main = main;
    }

    async run(sender, writtenCommand, args) {
        if (sender instanceof Player) {
            if (args.length > 0) {
                sender.message("Playing file");
                new Promise(async () => {
                    try {
                        await this.main.playFile(args.join(" "), sender)
                    } catch {
                        sender.message("File not found");
                    }
                });
            } else {
                sender.message("/play {file}");
            }
        } else {
            sender.message("You can't run this command as a server");
        }
    }
}

module.exports = PlayCommand;
