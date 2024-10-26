import { IUserModuleService } from '@medusajs/types';
import { Modules } from '@medusajs/utils';
import { SubscriberArgs, SubscriberConfig } from '@medusajs/medusa';
import { backendUrl } from '../../medusa-config';
import { sendEmail } from '../utils/email-utils';

export default async function userInviteHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const userModuleService: IUserModuleService = container.resolve(Modules.USER);
  const invite = await userModuleService.retrieveInvite(data.id);

  const emailBody = `
    <p>You have been invited to join our platform!</p>
    <p>Your invite link: <a href="${backendUrl}/app/invite?token=${invite.token}">Click here</a></p>
  `;

  await sendEmail({ to: invite.email, subject: 'You have been invited!', body: emailBody }, container);
}

export const config: SubscriberConfig = {
  event: 'invite.created'
};
