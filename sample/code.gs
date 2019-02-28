function myFunction() {
  /* Get source data and write to specific sheet 
     - open Google Sheets
     - create a spreadsheet with 2 sheets 
     - name the sheets as test1 and test2
     - tool > script editor > create a new script file (e.g. code.gs)
     - copy the follow code to code.gs
  */
  
  var ss = SpreadsheetApp.openById("xxxxxxxxxx"); //where xxxxxxxxxx is the document ID
  var sourSheet = ss.getSheetByName('test1'); //source sheet
  var destSheet = ss.getSheetByName('test2'); //destination sheet
  
  var rows = sourSheet.getDataRange().getValues();
  var posts = rows.slice(1);
  
  for (var i = 0; i < posts.length ; i++){
    destSheet.appendRow(posts[i]);
  }
  
}
