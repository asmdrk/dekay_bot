const { AudioPlayerStatus } = require("@discordjs/voice");

module.exports = {
	name: AudioPlayerStatus.Idle,
	forPlayer: true,
	execute(client) {
		client.player.on(AudioPlayerStatus.Idle, async () => {
			console.log("idle");
			queue.delete(queue.firstKey());
			if (queue.size === 0) {
				console.log("empty");
				await interaction.followUp(
					"There is nothing left for me to play, so I will be resting now. Bye!"
				);
			} else {
				player.play(queue.first());
			}
		});
	},
};
