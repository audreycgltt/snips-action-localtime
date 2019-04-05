import { location, time, logger, slot, MappingEntry } from '../utils'
import { i18nFactory, mappingsFactory } from '../factories'
import commonHandler from './commonSimple'
import { IntentMessage, FlowContinuation } from 'hermes-javascript'

export default async function (msg: IntentMessage, flow: FlowContinuation) {
    const i18n = i18nFactory.get()
    const mappings = mappingsFactory.get()

    logger.info('GetTimeZone')

    const locations = await commonHandler(msg)

    if (slot.missing(locations)) {
        throw new Error('intentNotRecognized')
    }

    let entry: MappingEntry

    for (let loc of locations) {
        const cityEntry = location.getMostPopulated(loc, mappings.city)
        const regionEntry = location.getMostPopulated(loc, mappings.region)
        const countryEntry = location.getMostPopulated(loc, mappings.country)

        entry = (cityEntry) ? cityEntry : ((regionEntry) ? regionEntry : ((countryEntry) ? countryEntry : null))
    }

    if (!entry)
        throw new Error('place')

    const timeZone = entry.timezone
    const offsetInfo = time.getUtcOffset(timeZone)
    
    flow.end()
    return i18n('localTime.getTimeZone', {
        targetPlace: entry.value,
        offsetHour: offsetInfo.hour,
        offsetMinute: offsetInfo.minute
    })
}
