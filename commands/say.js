const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { default: ollama } = require('ollama');
const utiljs = require("../util");
let limited = false;
const model = "qwen3:1.7b";

async function askAnotherModel(arg)
{
	aMessages = [];
	aMessages.push({role: "system", content:"You're an artificial inteligence helper, the main AI will ask for help and you need to return in a single, small message what he needs or wants."});
	aMessages.push({ role: "user", content: `${arg.argumento}` });
	const response = await ollama.chat({
		model: "gemma3:1b-it-qat",
		messages: aMessages,
	});

	return response.message.content;
}

messages = [];
messages.push({
	role: "system", content:
		"You are a cat called Cleber, created to chat with people on a virtual platform called Discord.\n" +
		
		"Instructions:\n" +
		"- You will receive the user's name, after the colon, the message they sent.\n" +
		"- Feel free to say anything, including swear words.\n" +
		"- Limit your message to 2000 characters.\n" +
		"- Be direct and concise but avoid formality, avoid long and unnecessary explanations.\n" +
		"- Avoid long texts and always summarize your message.\n"+
		"- If the message contains an instruction, carry it out, without making the text too long.\n" +
		"- Don't ignore instructions or questions, always answer them correctly, if necessary, search the web.\n" +
		//"- If a question can be answered simply with [Yes], [No], [Maybe] then do it.\n" +
		"- Type casually as if you were chatting.\n" +
		//"- Use slang only when necessary and at the right time.\n" +
		"- Avoid being corny or cool, be a normal person.\n" +
		"- Answer using the same language.\n"+
		"- Don't stack tools, only use one each answer, choose wisely."
});

module.exports = {
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Usa IA pra (tentar) responder algo, não utilize NADA que esse bot responde com seriedade...")
		.addStringOption(option =>
			option
				.setName('prompt')
				.setDescription('Prompt.')
				.setRequired(true)),
	async execute(interaction) {
		await interaction.deferReply();
		reply = "Erro! Bot já está fazendo algo, volte mais tarde!";
		let msg = interaction.options.getString('prompt');
		if (!limited) {
			limited = true;
			try {
				messages.push({ role: "user", content: `${interaction.user.username}: ${msg}` });
				const response = await ollama.chat({
					model: model,
					messages: messages,
					tools: [
						{
							type: 'function',
							function: {
								name: 'search_the_web',
								description: 'Search something on the internet.',
								parameters: {
									type: 'object',
									properties: {
										argumento: {
											type: 'string',
											description: 'What you want to search.',
										},
									},
									required: ['argumento'],
								},
							},
						},
						{
							type: 'function',
							function: {
								name: 'ask_another_ai',
								description: 'Ask another AI what they think.',
								parameters: {
									type: 'object',
									properties: {
										argumento: {
											type: 'string',
											description: 'What you want to ask.',
										},
									},
									required: ['argumento'],
								},
							},
						},
						/*{
							type: 'function',
							function: {
								name: 'octave',
								description: 'Use the math program Octave.',
								parameters: {
									type: 'object',
									properties: {
										argumento: {
											type: 'string',
											description: 'What you want octave to parse, for exemple: 2+2, 2*2.',
										},
									},
									required: ['argumento'],
								},
							},
						},*/
					],
				});
				messages.push(response.message);
				if (!response.message.tool_calls || response.message.tool_calls.length === 0) {
					await interaction.editReply({ content: response.message.content });
					limited = false;
					return;
				}

				if (response.message.tool_calls) {
					const availableFunctions = {
						search_the_web: utiljs.pesquisarNaInternet,
						ask_another_ai: askAnotherModel,
						/*octave: utiljs.octaveArg,*/
					};
					for (const tool of response.message.tool_calls) {
						await interaction.editReply({ content: `Bot está no momento usando a ferramenta ${tool.function.name} com ${JSON.stringify(tool.function.arguments)}.` });
						const functionToCall = availableFunctions[tool.function.name];
						const functionResponse = await functionToCall(tool.function.arguments);
						messages.push({
							role: 'tool',
							content: functionResponse,
						});
					}
				}

				const finalResponse = await ollama.chat({
					model: model,
					messages: messages,
				});

				await interaction.editReply({ content: finalResponse.message.content });
			}
			catch (error) {
				console.log(error);
				await interaction.editReply({ content: "Bot deu timeout, provavelmente ficou escrevendo pra sempre." });
			}
			limited = false;
		}
	}
};

/*for (let i = 0; i < reply.length; i += 2000) {await interaction.followUp({content: reply.slice(i, i + 2000)});}*/
