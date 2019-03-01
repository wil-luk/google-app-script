function readData() {
  var ss = SpreadsheetApp.openById("xxxxxxxxxx"); //where xxxxxxxxxx is the document ID
  var data1Sheet = ss.getSheetByName('tutor'); //source data 1 sheet
  var data2Sheet = ss.getSheetByName('student'); //source data 2 sheet
  var resultSheet = ss.getSheetByName('result'); //result sheet  
  var tutorRows = data1Sheet.getDataRange().getValues();
  var studentRows = data2Sheet.getDataRange().getValues();
  var tutor = dataConvert(tutorRows);
  var student = dataConvert(studentRows); 
  dataCompare(tutor,student);
}

function dataConvert(data){
  var dataTable = [];
  var dataArr = [];
  dataTable = data.slice(1);
  dataArr = dataTable;
  return dataArr;
}

function dataCompare(tutor,student){
  var stimeslot = []; // temp storage of the timeslot(s) for each student 
  var ttimeslot = []; // temp storage of the timeslot(s) for each tutor 
  var matched = 0;
  for (var i = 0; i < student.length ; i++){      
    matched = 0;  
      for(var j = 0; j < tutor.length; j++){ 
        for (var day = 1; day <6; day++){ // day -> monday to friday
          stimeslot = [];
          stimeslot = student[i][day].split(',');
          if (stimeslot[0] != "") { //check 1st element not null
            for (m = 0; m < stimeslot.length; m ++){
              ttimeslot = [];
              ttimeslot = tutor[j][day].split(',');
              if (ttimeslot[0] != "") {
                for (n = 0; n < ttimeslot.length; n ++){
                  if (stimeslot[m] == ttimeslot[n]){
                    addResult(day,'matched - day '+ day +' :' + student[i][0] + " <-> " + tutor[j][0] + ' , timeslot : '+ stimeslot[m] );
                    var tutorTimeSlot = "";
                    for (x = 0; x < ttimeslot.length; x++){
                      if (x ==n){
                        tutorTimeSlot = "-";
                      }
                      else{
                        tutorTimeSlot = tutorTimeSlot +','+ ttimeslot[x];
                      }
                    }
                    tutor[j][day] =[];
                    tutor[j][day] = tutorTimeSlot;
                    m = stimeslot.length;
                    n = ttimeslot.length;
                    matched = 1;
                    break;
                  }  
                }  
              }
            }    
          }
          if (matched ==1) {break;} // quit 'day' loop
        }
        if (matched ==1) {break;} // quit 'j' loop
      }
      if (matched ==0){
        addResult(1,'no match' + student[i][0] );
      }
  }
}

function addResult(day,data){
  var ss = SpreadsheetApp.openById("xxxxxxxxxx"); //where xxxxxxxxxx is the document ID
  var sheet = ss.getSheetByName('result'); //result sheet
  var numRows = sheet.getLastRow();
  sheet.getRange(numRows + 1,day).setValue(data);
  //sheet.appendRow(data); // can't use appendRow as data is a single cell string
}
