function sendHTML(){
  var emailAddress = 'XXXXX@xxxxc.com' ;
  var emailTitle = 'Auto Reply from Google App Script (testing) ' ;
  
  var emailMessage = HtmlService.createHtmlOutputFromFile('email').getContent();
  emailMessage = emailMessage.replace('#TITLE', 'This is an auto reply');
  emailMessage = emailMessage.replace('#MESSAGE', 'Hello XXX');
  emailMessage = emailMessage.replace('#HTML-LINK', 'www.google.com');
 
  MailApp.sendEmail(emailAddress, emailTitle, '',{
    htmlBody:emailMessage
  })
}
