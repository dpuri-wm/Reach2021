var app = angular.module("graphApp", []);
app.controller("graphCtrl", function($scope) {
  
  // saving csv
  document.getElementById('inputfile')
  .addEventListener('change', function() { 

    var fr=new FileReader(); 
    fr.onload=function(){
      $scope.csvObjs = $.csv.toObjects(fr.result);
      $scope.columns = Object.keys($scope.csvObjs[0]);
      $scope.$apply();
    } 
    
    fr.readAsText(this.files[0]);
  });

  $scope.compare = function () {
    trace1 = {
      type: 'scatter',
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      mode: 'lines',
      name: 'Red',
      line: {
        color: 'rgb(219, 64, 82)',
        width: 3
      }
    };
    
    trace2 = {
      type: 'scatter',
      x: [1, 2, 3, 4],
      y: [12, 9, 15, 12],
      mode: 'lines',
      name: 'Blue',
      line: {
        color: 'rgb(55, 128, 191)',
        width: 1
      }
    };
    
    var layout = {
      width: 500,
      height: 500
    };
    
    var data = [trace1, trace2];
    
    Plotly.newPlot('graph', data, layout);
  };
});