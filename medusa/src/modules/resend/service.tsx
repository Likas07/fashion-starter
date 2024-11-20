import { AbstractNotificationProviderService } from '@medusajs/framework/utils';
import { Logger } from '@medusajs/medusa';
import {
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from '@medusajs/types';
import { Resend } from 'resend';
import emails, { subjects } from './emails';

type InjectedDependencies = {
  logger: Logger;
};

export default class ResendNotificationProviderService extends AbstractNotificationProviderService {
  public static identifier = 'resend';
  private resendClient: Resend;
  private from: string;
  private logger: Logger;

  constructor({ logger }: InjectedDependencies, options: unknown) {
    super();

    if (
      typeof options !== 'object' ||
      options === null ||
      !('api_key' in options) ||
      typeof options.api_key !== 'string' ||
      !('from' in options) ||
      typeof options.from !== 'string'
    ) {
      throw new Error(
        `Invalid options provided to Resend module. Expected { api_key: string, from: string }`,
      );
    }

    this.resendClient = new Resend(options.api_key);
    this.from = options.from;
    this.logger = logger;
  }

  async send(
    notification: ProviderSendNotificationDTO,
  ): Promise<ProviderSendNotificationResultsDTO> {
    const Template = emails[notification.template];
    const subject = subjects[notification.template] || '';

    if (!Template) {
      this.logger.error(
        `Couldn't find an email template for ${
          notification.template
        }. The valid options are ${Object.keys(emails).join(', ')}`,
      );
      return {};
    }

    if (!subject) {
      this.logger.warn(
        `No subject found for template ${notification.template}. Please add a subject to the emails file.`,
      );
    }

    const { data, error } = await this.resendClient.emails.send({
      from: this.from,
      to: [notification.to],
      subject,
      react: <Template {...notification.data} />,
    });

    if (error) {
      this.logger.error(`Failed to send email`, error);
      return {};
    }

    return { id: data.id };
  }
}
