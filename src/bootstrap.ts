import { configFactory, i18nFactory, httpFactory, mappingsFactory } from './factories'
import { LANGUAGE_MAPPINGS } from './constants'

// Put anything that needs to be called on app. startup here.
export default async function (bootstrapOptions: {[key: string]: any}) {
    configFactory.init()
    const config = configFactory.get()
    const language: string = LANGUAGE_MAPPINGS[config.locale]
    await i18nFactory.init(language, bootstrapOptions.i18n)
    mappingsFactory.init(language)
    httpFactory.init(bootstrapOptions.http)
}
