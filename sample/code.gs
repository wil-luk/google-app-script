function myFunction() {

  //get source data and write to specific sheet
  
  var ss = SpreadsheetApp.openById("xxxxxxxxxx"); //where xxxxxxxxxx is the document ID
  var sourSheet = ss.getSheetByName('test1'); //source sheet
  var destSheet = ss.getSheetByName('test2'); //destination sheet
  
  var rows = sourSheet.getDataRange().getValues();
  var posts = rows.slice(1);
  
  for (var i = 0; i < posts.length ; i++){
    destSheet.appendRow(posts[i]);
  }
  
}
