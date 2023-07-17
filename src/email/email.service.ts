import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from '../common/common.constants';
import { EmailModuleOptions } from './email.interfaces';
import got from 'got';
import * as FormData from 'form-data';

@Injectable()
export class EmailService {
  constructor(
    @Inject(CONFIG_OPTIONS) private readonly options: EmailModuleOptions,
  ) {}

  private async sendEmail(subject: string, content: string) {
    const form = new FormData();
    form.append('from', `From Uber Eats <mailgun@${this.options.domain}>`);
    form.append('to', `qkrrjsxo456@naver.com`);
    form.append('subject', subject);
    form.append('text', content);
    try {
      await got(`https://api.mailgun.net/v3/${this.options.domain}/messages`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${this.options.apiKey}`,
          ).toString('base64')}`,
        },
        body: form,
      });
    } catch (error) {
      console.log(error);
    }
  }
  sendVerificationEmail(code: string) {
    this.sendEmail('Verify Your Email', `인증해주세요! 코드: ${code}`);
  }
}
