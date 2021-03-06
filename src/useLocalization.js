import { useRouter } from 'next/router'

export default function useLocalization () {
  const { locale } = useRouter()
  const l = (date, format) => {
    if (!date) return null
    const options = {
      short: {},
      long: { dateStyle: 'full', timeStyle: 'long' },
      month: { month: 'long', year: 'numeric' },
      date: { dateStyle: 'full' }
    }[format] || {
      year: 'numeric', month: 'long', day: 'numeric'
    }

    return new Intl.DateTimeFormat(locale, options).format(date)
  }

  return { l, locale }
}
