import { location, time, logger, slot, translation, MappingEntry } from '../utils'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    logger.info('GetLocalTime')
    
    const locations = await commonHandler(msg)

    //TODO: handle default location
    if (slot.missing(locations)) {
        throw new Error('intentNotRecognized')
    }

    let entries: MappingEntry[] = []

    for (let loc of locations) {
        entries.push(location.getMostRelevantEntry(loc))
    }

    console.log(entries)

    const entry = location.reduceToRelevantEntry(entries)
    if (!entry)
        throw new Error('place')

    const timeZone = entry.timezone
    const timeInfo = time.getTimeFromPlace(timeZone)

    flow.end()
    return translation.randomTranslation('localTime.getLocalTime', {
        target_location: entry.value,
        target_hour: timeInfo.hour,
        target_minute: timeInfo.minute,
        target_period: timeInfo.period,
    })
}
