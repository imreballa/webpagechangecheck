/**
 * Deletes a trigger and its arguments.
 * 
 * @param {string} name - Webpage name
 * @param {string} urlToCheck - Webpage address to check for changes
 * @param {bool} stripHtml - Shall we cut out all HTML and check only content or not
 * @param {enum} htmlCheckType - HTML validation method
 * @param {string} cssSelector - CSS selector in case of HtmlCheckType.PartOfPage
 */
function checkWebpage(name, urlToCheck, stripHtml, htmlCheckType, cssSelector) {
  // Download the page itself
  var result = fetchUrl(urlToCheck);
  Logger.log("Checking " + urlToCheck + " with result length " + result.length);

  // Validation type
  if(htmlCheckType == HtmlCheckType.PartOfPage) {
    var htmlDoc = Cheerio.load(result);
    result = htmlDoc(cssSelector).first().text();
  }

  // Strip out html tags and check only actual content
  if(stripHtml) {
    result = result.replace(/<[^>]+>/g, "");
  }

  // Encode content
  var newPageEncoded = computeMd5String(result);

  // Check previous value
  var oldPageEncoded = PropertiesService.getScriptProperties().getProperty(name);
  Logger.log("Old checksum: " + oldPageEncoded + ", new checksum: " + newPageEncoded);

  // Save current value
  PropertiesService.getScriptProperties().setProperty(name, newPageEncoded);
 
  if(oldPageEncoded != newPageEncoded) {
    Logger.log(name + " different pages");

    var retVal = {
      result: true,
      content: result,
    };

    return retVal;
  }
  else {
    Logger.log(name + " no change.")

    var retVal = {
      result: false,
      content: result,
    };
    
    return retVal;
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
