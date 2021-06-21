import { objectType } from 'nexus'

export const Session = objectType({
  name: 'Session',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.string('description')
  },
})
