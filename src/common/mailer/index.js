const config = require('common/config/config');
const helper = require('sendgrid').mail;
const sg = require('sendgrid')(config.mail.sendgrid.apiKey);
const exceptions = require('common/exceptions');

/**
 * Initiates trasactional email through sendgrid api
 *
 * @param to
 * @param template
 * @param userDetails
 * @returns {*}
 */
const mailer = ({ to, template, userDetails } = {}) => {
  if (config.server.status === 'test') return Promise.resolve(202);
  return new Promise((resolve, reject) => {
    if (!to || !userDetails || !template) throw new exceptions.InvalidInput();
    const templateDetails = config.mail.sendgrid.templates[template];
    const fromEmail = new helper.Email(config.mail.fromEmail);
    const toEmail = new helper.Email(to);
    const content = new helper.Content('text/html', 'New User Email');
    const mail = new helper.Mail(fromEmail, templateDetails.subject, toEmail, content);

    Object.keys(userDetails).forEach((key) => {
      mail.personalizations[0].addSubstitution(new helper.Substitution(`%${key}%`, userDetails[key]));
    });
    mail.setTemplateId(templateDetails.templateId);

    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON(),
    });

    sg.API(request, (error, response) => {
      if (error) {
        console.log('Error response received');
        reject(error);
      }
      resolve(response.statusCode);
    });
  });
};

module.exports = mailer;
