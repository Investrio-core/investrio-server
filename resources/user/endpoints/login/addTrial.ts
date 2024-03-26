import prisma from '../../../../db';
import moment from 'moment';

export default async (user: {trialEndsAt: string | Date | null, isTrial: boolean | null, id: string}) => {
  if (user && !user.isTrial && !user.trialEndsAt) {
    await prisma.user.update({
      where: {
        id: user.id
      },
      data: {
        isTrial: true,
        isActive: false,
        trialEndsAt: moment().add(7, 'd').toISOString()
      }
    });
  }
};
