var app = angular.module("graphApp", ['ui.select', 'ngSanitize']);
app.controller("graphCtrl", function($scope) {
  
  $scope.csvObjs = null;
  $scope.columns = {
    columnName: null,
    availableOptions: []
  }

  // saving csv
  // runs on page load
  document.getElementById('inputfile')
  .addEventListener('change', function() { 

    var fr=new FileReader(); 
    fr.onload=function(){
      $scope.csvObjs = $.csv.toObjects(fr.result);
      $scope.columns.availableOptions = Object.keys($scope.csvObjs[0]);
      $scope.$apply();
    } 
    
    fr.readAsText(this.files[0]);
  });

  $scope.compare = function () {

    // collect temporal data by ID
    lines = {};
    for (var i = 0; i < $scope.csvObjs.length; i++) {
      let obj = $scope.csvObjs[i];
      if (!(obj.ID in lines)) {
        lines[obj.ID] = [obj.Label];
      }
      lines[obj.ID].push(obj[$scope.columns.columnName]);
    }

    // make graph
    lines = Object.entries(lines);
    var red = 'rgb(219, 64, 82)';
    var blue = 'rgb(55, 128, 191)';
    var data = [];
    for (var i = 0; i < lines.length; i++) {
      if (lines[i][1][0] == 0) {
        var lineColor = blue;
      } else {
        var lineColor = red;
      }
      lines[i][1].shift();
      let obj = {
        type: 'scatter',
        x: [0, 3, 24],
        y: lines[i][1],
        mode: 'lines',
        name: lines[i][0],
        line: {
          color: lineColor,
          width: 1
        }
      }
      data.push(obj);
    };
  
    let obj = {
      type: 'scatter',
      x: [0, 3, 24],
      y: [$scope.month0, $scope.month3, $scope.month24],
      mode: 'lines',
      name: 'patient',
      line: {
        color: 'rgb(219, 64, 82)', //temp
        width: 5
      }
    }
    data.push(obj);

    var layout = {
      width: 500,
      height: 500
    };

    Plotly.newPlot('graph', data, layout);
  }
});