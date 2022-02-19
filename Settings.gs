/**
 * Checks settings for correct setup
 * 
 * @param {JSON array} settings - The settings JSON array
 */
function checkSettings(settings) {
  var result = true;

  settings.forEach(function(setting) {
    // Name is mandatory
    if(setting.name == null) {
      Logger.log("'Name' is a mandatory parameter!");
      result = false;
    }

    // URL to check
    if(setting.urlToCheck == null) {
      Logger.log(setting.name + ": URL to check is missing!");
      result = false;
    }

    // Check for email details
    if(setting.subject == null) {
      Logger.log(setting.name + ": subject is missing!");
      result = false;
    }

    if(setting.emailBodyType == null) {
      Logger.log(setting.name + ": email body type is missing!");
      result = false;
    }

    // Simple HTML body type
    if(setting.emailBodyType == EmailBodyType.SimpleHtml && setting.emailBody == null) {
      Logger.log(setting.name + ": email body is mandatory for SimpleHtml email body type!");
      result = false;
    }

    // Google Docs body type
    if(setting.emailBodyType == EmailBodyType.GoogleDoc && setting.googleDocId == null) {
      Logger.log(setting.name + ": Google Docs id is mandatory for GoogleDoc email body type!");
      result = false;
    }

    // Scheduler
    if(setting.checkInterval == null || setting.checkIntervalUnit == null) {
      Logger.log(setting.name + ": check interval or check interval unit is missing!");
      result = false;      
    }

    // Minute scheduler can be only 1, 5, 10, 15 or 30 according to GAS
    if(setting.checkIntervalUnit == CheckIntervalUnit.Minute
        && setting.checkInterval != 1
        && setting.checkInterval != 5
        && setting.checkInterval != 10
        && setting.checkInterval != 15
        && setting.checkInterval != 30) {
      Logger.log(setting.name + ": check interval can be only 1, 5, 10, 15, or 30 minutes!");
      result = false;      
    }

    // Hour scheduler can be only 1, 2, 4, 6, 8 or 12 according to GAS
    if(setting.checkIntervalUnit == CheckIntervalUnit.Hour
        && setting.checkInterval != 1
        && setting.checkInterval != 2
        && setting.checkInterval != 4
        && setting.checkInterval != 6
        && setting.checkInterval != 8
        && setting.checkInterval != 12) {
      Logger.log(setting.name + ": check interval can be only 1, 2, 4, 6, 8 or 12 hours!");
      result = false;      
    }

    // Strip HTML
    if(setting.stripHtml == null) {
      Logger.log(setting.name + ": strip HTML should be set up as true or false!");
      result = false;      
    }

    // Email addresses
    if(setting.emailAddresses == null || setting.emailAddresses.length < 1) {
      Logger.log(setting.name + ": at least one email address is mandatory!");
      result = false;      
    }
  });

  return result;
}