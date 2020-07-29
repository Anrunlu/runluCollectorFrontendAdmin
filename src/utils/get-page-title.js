
const title = '润鲁收集后台'

export default function getPageTitle (pageTitle) {
  if (pageTitle) {
    return `${pageTitle} | ${title}`
  }
  return `${title}`
}
