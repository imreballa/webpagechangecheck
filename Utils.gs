/**
 * Sends a simple HTML email
 * 
 * @param {string} subject - Subject template of email
 * @param {string} emailBody - Email body template
 * @param {JSON} emailAddresses - Email addresses to send the email to
 * @param {string} name - Name of alert
 * @param {string} urlToCheck - URL checked
 * @param {string} content - full HTML content checked
 */
function sendAlertEmail(subject, emailBody, emailAddresses, name, urlToCheck, content) {
  subject = subject.replace('{name}', name);
  subject = subject.replace('{urlToCheck}', urlToCheck);
  
  emailBody = emailBody.replace('{name}', name);
  emailBody = emailBody.replace('{urlToCheck}', urlToCheck);
  emailBody = emailBody.replace('{content}', content);
  
  for (var i = 0; i < emailAddresses.length; i++) {
    Logger.log("Send email to " + emailAddresses[i]);
    var message = {
      to: emailAddresses[i],
      subject: subject,
      htmlBody: emailBody.replace("{emailAddress}", emailAddresses[i]),
      name: name
    };
    
    MailApp.sendEmail(message);
  }
}

/**
 * Sends an HTML email based on a Google document
 * 
 * @param {string} subject - Subject template of email
 * @param {string} googleDocId - Google document id used for email body template
 * @param {JSON} emailAddresses - Email addresses to send the email to
 * @param {string} name - Name of alert
 * @param {string} urlToCheck - URL checked
 * @param {string} content - full HTML content checked
 */
function sendGoogleDocAlertEmail(subject, googleDocId, emailAddresses, name, urlToCheck, content) {
  var emailTemplate = ConvertGoogleDocToCleanHtml(googleDocId);
  var htmlEmail = convertToHtmlEmail(emailTemplate.html, emailTemplate.images);

  subject = subject.replace('{name}', name);
  subject = subject.replace('{urlToCheck}', urlToCheck);
  
  emailTemplate.html = emailTemplate.html.replace('{name}', name);
  emailTemplate.html = emailTemplate.html.replace('{urlToCheck}', urlToCheck);
  emailTemplate.html = emailTemplate.html.replace('{content}', content);

  for (var i = 0; i < emailAddresses.length; i++) {
    Logger.log("Send email to " + emailAddresses[i]);

    MailApp.sendEmail({
      to: emailAddresses[i],
      subject: subject,
      htmlBody: emailTemplate.html.replace("{emailAddress}", emailAddresses[i]),
      inlineImages: htmlEmail.inlineImages,
      attachments: htmlEmail.attachments,
    });
  }
}

/**
 * Calculates MD5 string
 * 
 * @param {string} input - String to encode
 * 
 * Based on https://stackoverflow.com/questions/16216868/get-back-a-string-representation-from-computedigestalgorithm-value-byte
 */
function computeMd5String(input) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, input).reduce(function(input,chr){
    chr = (chr < 0 ? chr + 256 : chr).toString(16);
    return input + (chr.length==1?'0':'') + chr;
  },'');
}
