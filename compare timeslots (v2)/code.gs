function mainFunction(){
  clearSheet();
  readData();
}

function clearSheet(){
  var ss = SpreadsheetApp.openById("xxxxxxxxxx"); //where xxxxxxxxxx is the document ID
  var resultSheet = ss.getSheetByName('result'); //result sheet  
  resultSheet.clear();
}

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
  var matchArr = []; // store matched result
  var unmatchArr = []; // store unmatched result
  var matched = 0; //flag to indicate timeslot matched
 
  for (var i = 0; i < student.length ; i++){      
    matched = 0;
    
    for (day = 1; day < 6; day ++){ // day  from monday to Friday
      if (student[i][day + 6].length != 0) {
        stimeslot = [];
        stimeslot = student[i][day + 6].split(','); // day + 6 -> student timeslot start from column H
        for (var j = 0; j< tutor.length ; j ++){            
            if (tutor[j][day + 1].length !=0) {
              ttimeslot = [];
              ttimeslot = tutor[j][day + 1].split(','); // day + 1 -> tutor timeslot start from column c
              for (m = 0; m < stimeslot.length; m++){          
                for (n = 0; n < ttimeslot.length; n ++){
                  var string1 =  removeSpace(stimeslot[m]); //must remove space before compare
                  var string2 = removeSpace(ttimeslot[n]);
                  Logger.log(string1 + '|' + string2);
                  var compareResult = string1.localeCompare(string2); //compare two strings, 0 => same
                  if (compareResult ==0){
                    //match
                    matched = 1;
                    var date = ['Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday'];                     
                    
                    // remove timeslot from tutor
                    tutor[j][day+1] =[];
                    tutor[j][day+1] = updataTutorTS(ttimeslot);
                    
                    //matched result
                    matchArr.push(student[i][1]+','+tutor[j][1]+','+date[day-1]+','+stimeslot[m]);
                    break;
                  }
                } //n loop
                if (matched ==1){break;}
              } //m loop
           } 
           if (matched ==1){break;}
        }
        if (matched ==1){break;}
      }   
    } 
    if (matched ==0){
      //no match
      unmatchArr.push(student[i][1]+ '- no matched')
    }  
  }  
  var remainTutorSlot = [];
  for(k = 0; k< tutor.length; k ++){
    remainTutorSlot.push(tutor[k][1]+',['+ tutor[k][2]+'],['+tutor[k][3]+'],['+tutor[k][4]+'],['+tutor[k][5]+'],['+tutor[k][6]+']');
  }
  matchResult(1,matchArr);
  matchResult(0,unmatchArr);  
  matchResult(2,remainTutorSlot);
}

function removeSpace(data){
  data = data.replace(/\s+/g, ''); //remove space in string
  return data;
}

function updataTutorTS(data){ // data = ttimeslot
  // update matched tutor timeslot with '-'
                    
  var tutorTimeSlot = "";
  for (x = 0; x < data.length; x++){
    if (x == n){
      data[x] = "-";
    }
    if (x ==0){
      tutorTimeSlot = data[x]
    }
    else{
      tutorTimeSlot = tutorTimeSlot + ',' + data[x];
    }
  }
  return tutorTimeSlot;
}

function matchResult(match,data){
  if (match == 1){
    addResult(1,"matched timeslots");
  }
  if (match == 0){
    addResult(1,"unmatched timeslots");
  }  
  if (match == 2){
    addResult(1,"tutors' remaining timeslots");
  }  
  for(i = 0; i < data.length; i ++){
    addResult(1,data[i]);
  }
}

function addResult(column,data){
  var ss = SpreadsheetApp.openById("xxxxxxxxxx"); //where xxxxxxxxxx is the document ID
  var sheet = ss.getSheetByName('result'); //result sheet
  var numRows = sheet.getLastRow();
  sheet.getRange(numRows + 1,column).setValue(data);
}

