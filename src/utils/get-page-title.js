import defaultSettings from '@/settings'

const title = defaultSettings.title || 'ESMS'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
