// Fake enum for check interval measures
var CheckIntervalUnit = {
  "Hour" : "hour",
  "Minute" : "minute",
};

// Fake enum for email body type
var EmailBodyType = {
  "GoogleDoc" : "googledoc",
  "SimpleHtml" : "simplehtml",
};

// Email subject
var subject = "Change warning - {name}";

// Email body for simple HTML
var emailBody = "The following page content changed: {name} <br />\
URL: {urlToCheck} <br />\
Email sent to: {emailAddress}<br />";

// Settings
// See HowToSetupSettings.html!
var settings = 
[
    {
    "name" : "webpagechangecheck",
    "subject" : subject,
    "emailBodyType" : EmailBodyType.SimpleHtml,
    "emailBody" : emailBody,
    "urlToCheck" : "https://github.com/imreballa/webpagechangecheck/",
    "emailAddresses" : [ "ballaimre@gmail.com" ],
    "checkInterval" : 24,
    "checkIntervalUnit" : CheckIntervalUnit.Hour,
    "stripHtml" : true,
  }
];

/**
 * Creates all triggers, thus installing the script.
 */
function install() {
  // Check for correct setup
  if(!checkSettings(settings)) {
    Logger.log("Please check settings! Process stopped.");
    return;
  }

  // Settings are ok, set up the scheduler(s)
  installAll(settings);
}

/**
 * Removes all triggers, thus uninstalling the script.
 */
function unInstall() {
    deleteAllTriggers();
}
