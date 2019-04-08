import { location, time, logger, slot, MappingEntry } from '../utils'
import { i18nFactory } from '../factories'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    const i18n = i18nFactory.get()

    logger.info('GetTimeZone')

    const locations = await commonHandler(msg)

    //TODO: handle default location
    if (slot.missing(locations)) {
        throw new Error('intentNotRecognized')
    }

    let entries: MappingEntry[] = []

    for (let loc of locations) {
        entries.push(location.getMostRelevantEntry(loc))
    }

    const entry = location.reduceToRelevantEntry(entries)
    if (!entry)
        throw new Error('place')

    const timeZone = entry.timezone
    const offsetInfo = time.getUtcOffset(timeZone)
    
    flow.end()
    return i18n('localTime.getTimeZone', {
        target_location: entry.value,
        offset_hour: offsetInfo.hour,
        offset_minute: offsetInfo.minute
    })
}
