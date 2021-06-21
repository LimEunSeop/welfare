import { Session } from './Session'
import { extendType, intArg, nonNull, objectType, stringArg } from 'nexus'

export const Organization = objectType({
  name: 'Organization',
  definition(t) {
    t.nonNull.int('id')
    t.string('name')
    t.list.field('sessions', {
      type: Session,
      async resolve(root, _args, ctx) {
        const programSessions = await ctx.db.programSession.findMany({
          where: {
            orgId: root.id,
          },
          include: {
            program: true,
          },
        })

        return programSessions.map((session) => session.program)
      },
    })
  },
})

export const OrganizationQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('organization', {
      type: 'Organization',
      args: {
        id: nonNull(intArg()),
      },
      async resolve(_root, args, ctx) {
        return await ctx.db.organization.findUnique({
          where: {
            id: args.id,
          },
        })
      },
    })
  },
})
