import moment from 'moment'

export const current = () => moment().utcOffset('+09:00') // Asia/Seoul
