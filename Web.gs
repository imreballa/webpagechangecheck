/**
 * Deletes a trigger and its arguments.
 * 
 * @param {string} name - Webpage name
 * @param {string} urlToCheck - Webpage address to check for changes
 * @param {bool} stripHtml - SHall we cut out all HTML and check only content or not
 */
function checkWebpage(name, urlToCheck, stripHtml) {
  // Download the page itself
  var result = fetchUrl(urlToCheck);
  Logger.log("Checking " + urlToCheck + " with result length " + result.length);

  // Strip out html tags and check only actual content
  if(stripHtml) {
    result = result.replace(/<[^>]+>/g, "");
  }

  // Encode content
  var newPageEncoded = computeMd5String(result);
  Logger.log("New page encoded to length: " + newPageEncoded.length);

  // Check previous value
  var oldPageEncoded = PropertiesService.getScriptProperties().getProperty(name);

  // Save current value
  PropertiesService.getScriptProperties().setProperty(name, newPageEncoded);

  Logger.log(oldPageEncoded);
  if(oldPageEncoded != newPageEncoded) {
    Logger.log(name + " different pages");
    return true;
  }
  else {
    Logger.log(name + " no change.")
    return false;
  }
}

/**
 * Downloads a page from a URL.
 * 
 * @param {string} webpageUrl - Webpage to download
 */
function fetchUrl(webpageUrl) {

  var urlResponse = UrlFetchApp.fetch(webpageUrl, { 'validateHttpsCertificates' : false });

  if (urlResponse.getResponseCode() == 200) {
    var urlContent = urlResponse.getContentText();
    result = urlContent;
  }
  else { 
    result = urlReponse.getReponseCode();
  }
  
  return result;
}
