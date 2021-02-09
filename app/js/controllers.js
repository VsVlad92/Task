angular.module('App').
controller('mainController',['$scope','$timeout', function($scope, $timeout) {

  let sort = {
    eventType:'',
    name:'',
    date:'asc'
  }

  $scope.min = {
    first:'',
    second:'',
    time:''
  }

  $scope.max = {
    first:'',
    second:'',
    time:''
  }

  $scope.maxseq = 0;
  $scope.totalTime = 0;

  // get Data from JSON file 
    $.getJSON( "./downloads/task.recording.json/task.recording.json", function( data ) {
      $timeout(function(){
        console.log(data)
        $scope.records = data.records;
      })
    });

  //save file 
    $scope.onClickSaveJson = function onClickSaveJson(){
      uriContent = "data:application/octet-stream;download=newJson.json," + encodeURIComponent(JSON.stringify($scope.records));
      newWindow = window.open(uriContent, 'newJson.json');
    }

  //delete specific item from recors array
    $scope.onClickDeleteEntry = function onClickDeleteEntry(index, item){
      $scope.records.splice(index, 1);
    }

  //sort Function
  $scope.onClickSortArray = function onClickSortArray(type){
    switch (type) {
      case 'eventType':
        if(sort.eventType !== 'asc'){
          $scope.records = $scope.records.sort((a,b) => (a.event.type > b.event.type) ? 1 : -1);
          sort.eventType ='asc';
          return;
        }
        $scope.records = $scope.records.sort((a,b) => (a.event.type < b.event.type) ? 1 : -1);
        sort.eventType ='desc';
        break;
      case 'name':
        if(sort.name !== 'asc'){
          $scope.records = $scope.records.sort((a,b) => (a.setup.nodeName > b.setup.nodeName) ? 1 : -1);
          sort.name ='asc';
          return;
        }
        $scope.records = $scope.records.sort((a,b) => (a.setup.nodeName < b.setup.nodeName) ? 1 : -1);
        sort.name ='desc';
        break;
      case 'date':
        if(sort.date !== 'asc'){
          $scope.records = $scope.records.sort((a,b) => (a.time > b.time) ? 1 : -1);
          sort.date ='asc';
          return;
        }
        $scope.records = $scope.records.sort((a,b) => (a.time < b.time) ? 1 : -1);
        sort.date ='desc';
       break;
      default:
        break;
    }
  }

  $scope.onClickStats = function onClickStats(){
    let records = angular.copy($scope.records);
    // let sortRecords = angular.copy($scope.records);
    // sortRecords.sort((a,b) => (a.event.type > b.event.type) ? 1 : -1);
    let objTypes ={};
    let count = 1;
    let seq = 0;
    let min = records[1].time - records[0].time;
    let max = 0;


    //this is a number of types of we sort the array first
    // sortRecords.forEach((element, index) => {
    //   if(!sortRecords[index+1]) return;
  
    //   //Counts of different event types
    //   if(sortRecords[index+1].event.type === element.event.type){
    //     count++;
    //     objTypes[element.event.type] = count;
    //   }
    //   else {
    //     count=1;
    //     objTypes[sortRecords[index+1].event.type] = count;
    //   }
    // });

    records.forEach((element, index)=> {
      if(!records[index+1]) return;

      if(!objTypes[element.event.type]){
        objTypes[element.event.type] = {
          type: element.event.type,
          count: 0
        }
      }

      if(element.event.type !== objTypes[element.event.type].type) return;
      objTypes[element.event.type].count++;

      //min and max length
      if(min > records[index+1].time - element.time){
        min = records[index+1].time - element.time;
        $scope.min.first = element;
        $scope.min.second = records[index+1];
        $scope.min.time = min;
      }

      if(max < records[index+1].time - element.time){
        max = records[index+1].time - element.time;
        $scope.max.first =  element;
        $scope.max.second = records[index+1];
        $scope.max.time = max;
      }

      $scope.totalTime += records[index+1].time - element.time; 

      // console.log(records[index+1].time, element.time, " : ", records[index+1].time - element.time)
    })
    //clear focus events type
    let filterRecords = records.filter(element => element.event.type !== 'focus');
    //foreach to finde maxseq of input. I think is not the best way..
    filterRecords.forEach(element =>{
      if(element.event.type === 'input'){
        seq++;
      }else{
        if($scope.maxseq < seq){
          $scope.maxseq = seq;
        }
        seq=0;
      }
    })

    $scope.typesCount  = Object.entries(objTypes);
  }
}])
