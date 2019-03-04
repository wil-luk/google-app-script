function clearSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ssClear = ss.getSheetByName("xxx");  //where xxx is the target sheet
  ssClear.clear();
}
