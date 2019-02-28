function doGet() {
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
