angular.module('App').
controller('mainController',['$scope','$timeout', function($scope, $timeout) {

  let sort = {
    eventType:'',
    name:'',
    date:'asc'
  }

  let min,max;

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
    $scope.maxseq = 0;
    const records = angular.copy($scope.records);
    // let sortRecords = angular.copy($scope.records);
    // sortRecords.sort((a,b) => (a.event.type > b.event.type) ? 1 : -1);
    let objTypes ={};
    // let count = 1;
    let seq = 0;
    min = records[1].time - records[0].time;
    max = 0;

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
      const eventType = element.event.type;

      if(!objTypes[eventType]){
        objTypes[eventType] = {
          type: eventType,
          count: 0
        }
      }

      if(eventType !== objTypes[eventType].type) return;
      objTypes[eventType].count++;

      if(!records[index+1]) return;

      //min and max length
      getMinAndMax(element,records[index+1]);

      $scope.totalTime += records[index+1].time - element.time; 

    })
    //clear focus events type
    const filterRecords = records.filter(element => element.event.type !== 'focus');
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

  function getMinAndMax(first, second){
    if(min > second.time - first.time){
      min = second.time - first.time;
      $scope.min.first = first;
      $scope.min.second = second;
      $scope.min.time = min;
    }

    if(max < second.time - first.time){
      max = second.time - first.time;
      $scope.max.first =  first;
      $scope.max.second = second;
      $scope.max.time = max;
    }
  }
}])
