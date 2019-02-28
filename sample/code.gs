function myFunction() {

  //get source data and write to specific sheet
  
  var ss = SpreadsheetApp.openById("1uyHKUgahWgyT4wUwnNpo5-Qt0WuvtQ0koxnTRz3h1Do");
  var sourSheet = ss.getSheetByName('test1'); //source
  var destSheet = ss.getSheetByName('test2'); //destination
  
  var rows = sourSheet.getDataRange().getValues();
  var posts = rows.slice(1);
  //var json = JSON.stringify(posts);
  
  /*
  var sLastRow = sourSheet.getLastRow(); //identifies the last active row on the sheet
  var dLastRow = destSheet.getLastRow(); //identifies the last active row on the sheet
  */
  
  for (var i = 0; i < posts.length ; i++){
    destSheet.appendRow(posts[i]);
  }
  
}
