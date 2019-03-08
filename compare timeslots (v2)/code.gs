function mainFunction(){
  var sname = "xxxxxxxxxx" ; //where xxxxxxxxxx is the document ID
  var masterArr = [];
  var resultArr = [];
  clearSheet(sname);
  masterArr = readData(sname);
  resultArr = dataCompare(masterArr[0], masterArr[1]); 
  for (var i = 0; i < resultArr.length; i ++){
    matchResult(i,resultArr[i],sname);
  }
}

function clearSheet(sname){
  var ss = SpreadsheetApp.openById(sname); 
  var resultSheet = ss.getSheetByName('result');  
  resultSheet.clear();
}

function readData(sname) {
  var ss = SpreadsheetApp.openById(sname); 
  var data1Sheet = ss.getSheetByName('tutor'); //source data 1 sheet
  var data2Sheet = ss.getSheetByName('student'); //source data 2 sheet
  var resultSheet = ss.getSheetByName('result'); //result sheet  
  var tutorRows = data1Sheet.getDataRange().getValues();
  var studentRows = data2Sheet.getDataRange().getValues();
  var tutor = dataConvert(tutorRows);
  var student = dataConvert(studentRows);   
  return [tutor,student];
}

function dataConvert(data){
  var dataTable = [];
  var dataArr = [];
  dataTable = data.slice(1);
  dataArr = dataTable;
  return dataArr;
}

function dataCompare(tutor,student){ 
  var stimeslot = []; 
  var ttimeslot = []; 
  var matchArr = []; 
  var unmatchArr = []; 
  var matched = 0; 
  
  for (var i = 0; i < student.length ; i++){      
    matched = 0;  
    for (day = 1; day < 6; day ++){ 
      if (student[i][day + 6].length != 0) {
        stimeslot = [];
        stimeslot = student[i][day + 6].split(','); 
        for (var j = 0; j< tutor.length ; j ++){            
            if (tutor[j][day + 1].length !=0) {
              ttimeslot = [];
              ttimeslot = tutor[j][day + 1].split(','); 
              for (m = 0; m < stimeslot.length; m++){          
                for (n = 0; n < ttimeslot.length; n ++){
                  var string1 =  removeSpace(stimeslot[m]); 
                  var string2 = removeSpace(ttimeslot[n]);
                  Logger.log(string1 + '|' + string2);
                  var compareResult = string1.localeCompare(string2); 
                  if (compareResult ==0){                    
                    matched = 1;
                    var date = ['Monday', 'Tuesday', 'Wednesday', 'Thursday','Friday']; 
                    tutor[j][day+1] =[];
                    tutor[j][day+1] = updataTutorTS(ttimeslot);
                    matchArr.push(student[i][1]+','+tutor[j][1]+','+date[day-1]+','+stimeslot[m]);
                    break;
                  }
                } 
                if (matched ==1){break;}
              } 
           } 
           if (matched ==1){break;}
        }
        if (matched ==1){break;}
      }   
    }    
    if (matched ==0){
      unmatchArr.push(student[i][1]+ '- no matched')
    }  
  }
  
  var remainTutorSlot = [];
  for(k = 0; k< tutor.length; k ++){
    remainTutorSlot.push(tutor[k][1]+',['+ tutor[k][2]+'],['+tutor[k][3]+'],['+tutor[k][4]+'],['+tutor[k][5]+'],['+tutor[k][6]+']');
  } 
  return [matchArr, unmatchArr, remainTutorSlot];
}

function removeSpace(data){
  data = data.replace(/\s+/g, ''); 
  return data;
}

function updataTutorTS(data){                   
  var tutorTimeSlot = "";
  for (x = 0; x < data.length; x++){
    if (x == n){
      data[x] = "-";
    }
    if (x == 0){
      tutorTimeSlot = data[x];
    }
    else{
      tutorTimeSlot = tutorTimeSlot + ',' + data[x];
    }
  }
  return tutorTimeSlot;
}

function matchResult(match, data, sname){
  if (match == 0){
    addResult(1,"matched timeslots",sname);
  }
  if (match == 1){
    addResult(1,"unmatched timeslots",sname);
  }
  if (match == 2){
    addResult(1,"tutors' remaining timeslots",sname);
  }
  for(i = 0; i < data.length; i ++){
    addResult(1,data[i],sname);
  }
}

function addResult(column,data,sname){
  var ss = SpreadsheetApp.openById(sname); 
  var sheet = ss.getSheetByName('result'); //result sheet
  var numRows = sheet.getLastRow();
  sheet.getRange(numRows + 1,column).setValue(data);
}

