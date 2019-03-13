function newFunction(){
  var sname = "xxxxxxxxxx" ; //where xxxxxxxxxx is the document ID
  var masterArr = []; //tutor array, student array
  var tArr = []; //tutor timeslot list array
  var sArr = []; //student timeslot list array
  var finalArr = [];
  
  clearup(sname);
  masterArr = readData(sname);
  //convertList(a,b) where a[0] is tutor array, a[1] is student array; b is column shift
  // column shift: to adjust the correct column for timeslot, if tutor = 1, if student = 6
  tArr = convertList(masterArr[0],1);
  sArr = convertList(masterArr[1],6);
  masterArr = []; 
  masterArr = listCompare(tArr,sArr);  //use bruteForce method 
  finalArr = sortArr(masterArr);       //student, tutor, timeslot no  
  outputResult(convertBack(finalMatch(finalArr)),sname);
}

function clearup(sname){
  var ss = SpreadsheetApp.openById(sname); 
  var resultSheet = ss.getSheetByName('result2'); //result sheet  
  resultSheet.clear();
}

// convert timetable to list mon:0-8, Tue:9-17, Wed:18-26, thur:27-35, fri: 36-44
function convertList(user,columnShift){ 
  var masterTable = [];
  var userTimeSlot = [];
  var timeslot =[];
  var ts = ['8:30-9:20','9:30-10:20','10:30-11:20','11:30-12:20','12:30-13:20','13:30-14:20','14:30-15:20','15:30-16:20','16:30-17:20'];
  var compareResult = '';
  var x ='';
  var y ='';

  for (i = 0; i < user.length ; i ++) {
    userTimeSlot = [];
    userTimeSlot.push(user[i][1]);
    for (var day = 1; day <6; day++ ){
      timeslot = [];
      if (user[i][day + columnShift].length != 0 ){   // day + 1 => tutor timeslot (mon) is column c where column a is 0
        timeslot = user[i][day + columnShift].split(','); 
        x=0;
        y=0;
        while ((x < timeslot.length) && (y < ts.length)){
          timeslot[x] = timeslot[x].replace(/\s+/g, '');
          compareResult = timeslot[x].localeCompare(ts[y]);
          if (compareResult == 0){
            userTimeSlot.push(   y+((day-1)*9)   );
            x++;
            y++;
          }
          else if (parseInt(timeslot[x].split(':')[0]) < parseInt(ts[y].split(':')[0])){
            x ++;
            } else{
              y ++;
          }
        }        
      }
    }
    masterTable.push(userTimeSlot);
  }
  return masterTable;
}

//arr1 = tutor, arr2 = student
function listCompare(arr1,arr2){ 
  var i = 0;
  var j = 0;
  var sLoop = 0;
  var found = 0;
  var sameItem = [];
 
  while (sLoop < arr2.length){
    for (var tLoop = 0;tLoop < arr1.length; tLoop ++){
      while ((i < arr1[tLoop].length) && (j < arr2[sLoop].length)){
        if (i ==0) {i = 1;}
        if (j ==0) {j = 1;}          
        if (parseInt(arr1[tLoop][i]) == parseInt(arr2[sLoop][j])){
          //push to record arr
          //arr2[sLoop][0] student name, arr1[tLoop][0] tutor name, arr1[tLoop][i] matched slot
          sameItem.push(arr2[sLoop][0] +','+ arr1[tLoop][0] +','+ arr1[tLoop][i]); 
          found ++;
          i++;
          j++;
        }
        else if (parseInt(arr1[tLoop][i]) < parseInt(arr2[sLoop][j])){
          i ++
          } 
          else{
            j ++
        }
      }//end of inner while loop
      i=0;
      j=0;
      found=0;
    }
    sLoop++;
  }
  return sameItem;
}

function convertBack(data){
  var day = '';
  var ts = ['8:30-9:20','9:30-10:20','10:30-11:20','11:30-12:20','12:30-13:20','13:30-14:20','14:30-15:20','15:30-16:20','16:30-17:20'];
  var timeslot = '';
  var arr = [];
  
  for (var i = 0; i < data.length; i++){
    if (parseInt(data[i].split(',')[2]) >= 36) {
    day = 'Friday';
    timeslot = ts[parseInt(data[i].split(',')[2]) - 36];
    }
    if ((parseInt(data[i].split(',')[2]) >= 27) && (parseInt(data[i].split(',')[2]) < 36)) {
    day = 'Thursday';
    timeslot = ts[parseInt(data[i].split(',')[2]) - 27];
    }
    if ((parseInt(data[i].split(',')[2]) >= 18) && (parseInt(data[i].split(',')[2]) < 27)) {
    day = 'Wednesday';
    timeslot = ts[parseInt(data[i].split(',')[2]) - 18];
    }
    if ((parseInt(data[i].split(',')[2]) >= 9) && (parseInt(data[i].split(',')[2]) < 18)) {
    day = 'Tuesday';
    timeslot = ts[parseInt(data[i].split(',')[2]) - 9];
    }
    if ((parseInt(data[i].split(',')[2]) >= 0) && (parseInt(data[i].split(',')[2]) < 9)) {
    day = 'Monday';
    timeslot = ts[parseInt(data[i].split(',')[2]) ];
    }        
    arr.push(data[i].split(',')[0] + ','+ data[i].split(',')[1] + ',' + day + ',' + timeslot);
    //Logger.log('day:'+day+ ' timeslot:'+ timeslot);
  }
  return arr;
}

function sortArr(data){
  var current = '';
  var matched = 0;
  var matchArr = [];
  var sortArr = [];
  var compareResult =0;
  var finalArr = [];
  // no need to sort as pre-sorted
  // compare next one
  // find the number of matched timeslot(s) for each student
  // current = '' / match = 0
  // check data[i] = current ? no => new student
  // yes = existing student , match ++ 
  // final -> add to arr
  // prevent missing last item, need to check final item and match status 
  
  //Logger.log('data.length ' + data.length);

  for (var i =0 ; i < data.length ; i ++){   
    if ((matched >0)&&(data[i].split(',')[0] != current)){
        matchArr.push(matched+','+current); // matched - no of time, current - studnet name
        //Logger.log(current +' - no of matched: ' + matched);
    }
    if (data[i].split(',')[0] != current){
      current = data[i].split(',')[0];
      matched =1;
    }
    else{
      matched ++;
    }       
    if ((matched >0)&& ( i == data.length-1)){
        matchArr.push(matched+','+current); // matched - no of time, current - studnet name
        //Logger.log(current +' - no of matched: ' + matched);
    }
  }
  
  // sort result from 1st part => student with less matched timeslots will get higher priority
  // while student will more matched timeslots will get lower priority
  
  sortArr = mergeSort(matchArr); 
  matched = 0;
  while (matched < sortArr.length){
    for(var i = 0; i<data.length; i ++){
      compareResult = sortArr[matched].split(',')[1].localeCompare(data[i].split(',')[0]);
      if (compareResult ==0){
         finalArr.push(data[i]);
      }    
    } 
    matched ++;
  }
  return finalArr;
}

function finalMatch(data){
  var finalArr = [];
  var current = '';
  var matched = 0;
  var timeslot = 0;
  var occupied = 0;
  var compareResult = 0;
  var compareTimeslot = 0;
 // data[i].split(',')[0] - student
 // data[i].split(',')[1] - tutor
 // data[i].split(',')[2] - timeslot no

 // check student name ->  same as current?
 //    if no -> current = student name
 //    
 // check if timeslot occupied?
 //    if no -> push to final arr , next student
 //    if yes - > check next timeslot
 //                 -> if no timeslot match, -> push to final arr (no match), next student
   
 finalArr.push(data[0]);

   for (i = 1 ; i < data.length ; i ++) {
   // check whether student or timeslot exist in finalArr  
   // yes -> matched = 1
   // no  ->  add to array
     matched = 0;
     for (j =0; j < finalArr.length; j ++){
       compareResult = data[i].split(',')[0].localeCompare(finalArr[j].split(',')[0]);
       compareTimeslot = data[i].split(',')[2].localeCompare(finalArr[j].split(',')[2]);
       if ((compareResult == 0)||(compareTimeslot == 0)){
         matched = 1;
         break;
       }
     }
     if (matched != 1){
       finalArr.push(data[i]);
     }
   }
  return finalArr;
}

function outputResult(data, sname){
  var ss = SpreadsheetApp.openById(sname); 
  var sheet = ss.getSheetByName('result2'); //result sheet
  var numRows = sheet.getLastRow();
  var column = 1;
  for(i = 0; i < data.length; i ++){
     sheet.getRange(numRows + 1,column).setValue(data[i]);
     numRows++;
  }
}

//==the following functions are for merge sort========
function mergeSort (arr) {
  if (arr.length === 1) {
    // return once we hit an array with a single item
    return arr;
  }

  var middle = Math.floor(arr.length / 2) ;// get the middle item of the array rounded down
  var left = arr.slice(0, middle) ;// items on the left side
  var right = arr.slice(middle) ;// items on the right side

  return merge( mergeSort(left), mergeSort(right) )
}

// compare the arrays item by item and return the concatenated result
function merge (left, right) {
  var result = [];
  var indexLeft = 0;
  var indexRight = 0;

  while (indexLeft < left.length && indexRight < right.length) {
   
    if (parseInt(left[indexLeft].split(',')[0]) < parseInt(right[indexRight].split(',')[0])) {
      result.push(left[indexLeft]);
      indexLeft++;
    } else {
      result.push(right[indexRight]);
      indexRight++;
    }
  }

  return result.concat(left.slice(indexLeft)).concat(right.slice(indexRight));
}
