function doGet() {
  /*
  test Google Sheet, App script and index file 
  - create new spreadsheet, copy the spreadsheet ID 
  - replace xxxxx with the real sheet ID
  - change sheet name to 'posts'
  - type something in the sheet 
  - tools > script editor
  - create new project and copy the following code to code.gs
  - create new HTML file (Script Editor > click 'File'> Click 'New'> HTML File
  */

    //var html = HtmlService.createHtmlOutputFromFile('index');
    
    var html = HtmlService.createTemplateFromFile('index');    
    html.data = {
        email: Session.getActiveUser().getEmail()
    } // Get user email
    var output = html.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME); 
    return output;
}
 
function getPosts() {
    var ss = SpreadsheetApp.openById('xxxxx');  // xxxxx is the sheet ID
    var sheet = ss.getSheetByName('posts');
    var rows = sheet.getDataRange().getValues();
    var posts = rows.slice(1);
    var json = JSON.stringify(posts);
    return json;
}
