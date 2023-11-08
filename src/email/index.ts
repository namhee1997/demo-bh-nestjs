import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as smtpTransport from 'nodemailer-smtp-transport';
import { MailOptions } from 'nodemailer/lib/json-transport';
import * as fs from 'fs';
import * as util from 'util';
import appConfig from '@src/config';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport(
      smtpTransport({
        service: 'Gmail',
        auth: {
          user: appConfig.MAIL_FROM,
          pass: appConfig.MAIL_PASSWORD,
        },
      }),
    );
  }

  async loadEmailTemplateResetPassword(
    name: string,
    content: string,
    link: string,
  ): Promise<string> {
    const readFile = util.promisify(fs.readFile);
    const template = await readFile(
      'dist/email/template/reset-password.html',
      'utf-8',
    );

    const customizedTemplate = template
      .replace('{{ name }}', name)
      .replace('{{ link }}', link)
      .replace('{{ content }}', content);

    return customizedTemplate;
  }

  async loadWellComeTemplate(name: string): Promise<string> {
    const readFile = util.promisify(fs.readFile);
    const template = await readFile(
      'dist/email/template/wellcome.html',
      'utf-8',
    );

    const customizedTemplate = template.replace('{{ name }}', name);

    return customizedTemplate;
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent?: string,
  ): Promise<string> {
    const mailOptions: MailOptions = {
      from: appConfig.MAIL_FROM,
      to,
      subject,
    };

    if (htmlContent) mailOptions.html = htmlContent;

    await this.transporter.sendMail(mailOptions);
    return 'ok';
  }
}
