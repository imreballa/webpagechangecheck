/**
 * Starts the process
 * 
 * @param {object} event - The event that started the process
 */
function startCheck(event) {
  // Get trigger parameters
  var triggerUid = event.triggerUid;
  var setting = JSON.parse(PropertiesService.getScriptProperties().getProperty(triggerUid)).settings;
  Logger.log(setting.name + " (" + triggerUid + ") started.");

  // Start webpage check
  Logger.log(setting.urlToCheck);
  var webpageChanged = checkWebpage(setting.name, setting.urlToCheck, setting.stripHtml, setting.htmlCheckType, setting.cssSelector);

  // Webpage content changed
  if(webpageChanged.result) {
    webpageChanged.content = webpageChanged.content('\r', "<br />");
    
    // Send a simple HTML based email
    if(setting.emailBodyType == EmailBodyType.SimpleHtml) {
      sendAlertEmail(setting.subject, setting.emailBody, setting.emailAddresses, setting.name, setting.urlToCheck, webpageChanged.content);
    }

    // Send an HTML email based on a Google document
    if(setting.emailBodyType == EmailBodyType.GoogleDoc) {
      sendGoogleDocAlertEmail(setting.subject, setting.googleDocId, setting.emailAddresses, setting.name, setting.urlToCheck, webpageChanged.content);
    }
  }

  Logger.log("Check finished.");
}

/**
 * Creates triggers based on input settings
 * 
 * @param {JSON array} settings - The settings JSON array
 * 
 * based on https://stackoverflow.com/questions/32697653/how-can-i-pass-a-parameter-to-a-time-based-google-app-script-trigger
 */
function installAll(settings){
  // Remove all existing triggers
  deleteAllTriggers();

  // Create new triggers
  settings.forEach(function(setting) {
    var trigger;

    if(setting.checkIntervalUnit == CheckIntervalUnit.Hour) {
      trigger = ScriptApp.newTrigger("startCheck").timeBased().everyHours(setting.checkInterval).create();
    }
    else if(setting.checkIntervalUnit == CheckIntervalUnit.Minute) {
      trigger = ScriptApp.newTrigger("startCheck").timeBased().everyMinutes(setting.checkInterval).create();
    }

    setupTriggerArguments(trigger, setting);
    Logger.log(setting.name + " set up as " + trigger.getUniqueId());
  });

  Logger.log("New triggers set up.");
}

/**
 * Deletes all triggers for the script.
 * 
 * based on https://stackoverflow.com/questions/32697653/how-can-i-pass-a-parameter-to-a-time-based-google-app-script-trigger
 */
function deleteAllTriggers() {
  Logger.log("Deleting all triggers...");
  var triggers = ScriptApp.getScriptTriggers();
  for (var i = 0; i < triggers.length; i++) {
    deleteTrigger(triggers[i]);
  }
  Logger.log("All triggers deleted.")
}

/**
 * Deletes a trigger and its arguments.
 * 
 * @param {Trigger} trigger - The trigger
 * 
 * based on https://stackoverflow.com/questions/32697653/how-can-i-pass-a-parameter-to-a-time-based-google-app-script-trigger
 */
function deleteTrigger(trigger) {
  var triggerUid = trigger.getUniqueId();
  Logger.log(triggerUid + " tigger deleted.");
  ScriptApp.deleteTrigger(trigger);
  deleteTriggerArguments(triggerUid);
}

/**
 * Deletes trigger arguments of the trigger with the given id.
 *
 * @param {string} triggerUid - The trigger id
 * 
 * based on https://stackoverflow.com/questions/32697653/how-can-i-pass-a-parameter-to-a-time-based-google-app-script-trigger
 */
function deleteTriggerArguments(triggerUid) {
  Logger.log(triggerUid + " trigger parameters deleted.");
  PropertiesService.getScriptProperties().deleteProperty(triggerUid);
}

/**
 * Sets up the arguments for the given trigger.
 *
 * @param {Trigger} trigger - The trigger for which the arguments are set up
 * @param {*} functionArguments - The arguments which should be stored for the function call
 * 
 * based on https://stackoverflow.com/questions/32697653/how-can-i-pass-a-parameter-to-a-time-based-google-app-script-trigger
 */
function setupTriggerArguments(trigger, functionArguments) {
  var triggerUid = trigger.getUniqueId();
  var triggerData = {};
  triggerData["settings"] = functionArguments;

  PropertiesService.getScriptProperties().setProperty(triggerUid, JSON.stringify(triggerData));
}
