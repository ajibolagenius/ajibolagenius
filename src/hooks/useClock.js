import { useEffect, useState } from 'react'

export function useClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    function showTime() {
      const date = new Date()
      let h = date.getHours()
      let m = date.getMinutes()
      let s = date.getSeconds()
      let session = 'AM'

      if (h === 0) {
        h = 12
      }

      if (h > 12) {
        h = h - 12
        session = 'PM'
      }

      h = h < 10 ? '0' + h : h
      m = m < 10 ? '0' + m : m
      s = s < 10 ? '0' + s : s

      setTime(h + ':' + m + ':' + s + ' ' + session)
    }

    showTime()
    const interval = setInterval(showTime, 1000)

    return () => clearInterval(interval)
  }, [])

  return time
}
