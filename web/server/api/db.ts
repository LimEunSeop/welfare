import { PrismaClient } from '@prisma/client'

export const db = new PrismaClient()
export const ROLES = ['user', 'moderator', 'admin']
