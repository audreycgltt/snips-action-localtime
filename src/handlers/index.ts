import { translation, logger } from '../utils'
import { FlowContinuation, IntentMessage, FlowActionReturn } from 'hermes-javascript'
import { getTimeDifferenceHandler } from './getTimeDifference'
import { getLocalTimeHandler } from './getLocalTime'
import { getTimeZoneHandler } from './getTimeZone'
import { convertTimeHandler } from './convertTime'

export type Handler = (
    message: IntentMessage,
    flow: FlowContinuation,
    ...args: any[]
) => FlowActionReturn

// Wrap handlers to gracefully capture errors
const handlerWrapper = (handler: Handler): Handler => (
    async (message, flow, ...args) => {
        logger.debug('message: %O', message)
        try {
            // Run handler until completion
            const tts = await handler(message, flow, ...args)
            // And make the TTS speak
            return tts
        } catch (error) {
            // If an error occurs, end the flow gracefully
            flow.end()
            // And make the TTS output the proper error message
            logger.error(error)
            return await translation.errorMessage(error)
        }
    }
)

// Add handlers here, and wrap them.
export default {
    getLocalTime: handlerWrapper(getLocalTimeHandler),
    getTimeZone: handlerWrapper(getTimeZoneHandler),
    getTimeDifference: handlerWrapper(getTimeDifferenceHandler),
    convertTime: handlerWrapper(convertTimeHandler)
}
