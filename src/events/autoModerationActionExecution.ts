import {
	AutoModerationActionExecutionListener,
	type Client,
	type ListenerEventData,
	ListenerEvent,
	Routes,
	TextDisplay,
	serializePayload
} from "@buape/carbon"
import { readFile } from "node:fs/promises"

type AutomodMessageMap = Record<string, string>

type AutoModerationActionExecutionData =
	ListenerEventData[typeof ListenerEvent.AutoModerationActionExecution]

const automodMessagesUrl = new URL("../config/automod-messages.json", import.meta.url)

const normalizeKeyword = (keyword: string) => keyword.trim().toLowerCase()

const loadAutomodMessages = async (): Promise<AutomodMessageMap> => {
	try {
		const raw = await readFile(automodMessagesUrl, "utf8")
		return JSON.parse(raw) as AutomodMessageMap
	} catch (error) {
		console.error("Failed to load automod messages:", error)
		return {}
	}
}

const formatAutomodMessage = (template: string, data: AutoModerationActionExecutionData) =>
	template
		.replaceAll("{user}", `<@${data.user_id}>`)
		.replaceAll("{keyword}", data.matched_keyword ?? "")
		.replaceAll("{content}", data.matched_content ?? data.content ?? "")

export default class AutoModerationActionExecution extends AutoModerationActionExecutionListener {
	async handle(data: ListenerEventData[this["type"]], client: Client) {
		if (!data.channel_id || !data.matched_keyword) {
			return
		}

		const messages = await loadAutomodMessages()
		const keyword = normalizeKeyword(data.matched_keyword)
		const normalizedMessages = Object.fromEntries(
			Object.entries(messages).map(([key, value]) => [normalizeKeyword(key), value])
		)
		const template = normalizedMessages[keyword]

		if (!template) {
			return
		}

		const content = formatAutomodMessage(template, data)
		const payload = serializePayload({
			components: [new TextDisplay(content)],
			allowedMentions: {
				users: [data.user_id]
			}
		})

		try {
			await client.rest.post(Routes.channelMessages(data.channel_id), {
				body: payload
			})
		} catch (error) {
			console.error("Failed to send automod response:", error)
		}
	}
}
