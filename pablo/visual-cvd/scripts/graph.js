var app = angular.module("graphApp", ['ui.select', 'ngSanitize']);
app.controller("graphCtrl", function($scope) {
  
  $scope.csvObjs = null;
  $scope.columns = {
    columnName: null,
    timeName: null,
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

  $scope.mode = null;

  //make it so month options update before comparison
  $scope.dates = {
    getDates: function () {
      var tempMonths = new Set();
      for (var i = 0; i < $scope.csvObjs.length; i++) {
        tempMonths.add($scope.csvObjs[i][$scope.columns.timeName]);
        $scope.dates.months = Array.from(tempMonths);
      }
    },
    months: [],
    input: []
  }

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
      var label = lines[i][1].shift();
      var obj = {
        type: $scope.mode,
        x: $scope.dates.months,
        y: lines[i][1],
      }
      if ($scope.mode == "scatter") {
        obj['mode'] = 'lines'
        obj['name'] = lines[i][0]
        obj['line'] = {
            color: lineColor,
            width: 1
        }
      } else if ($scope.mode == "bar") {
        obj[name] = label;
      }
      data.push(obj);
    };
  
    //hardcoded
    var patientColor = 'rgb(0, 0, 0)';
    var barName = "patient";
    // choose a color for patient input
    if ($scope.columns.columnName == "vol5_lvef") {
      if ((($scope.month0 - $scope.month0/20) > $scope.month24) || ($scope.month0/2 > $scope.month24)) {
        patientColor = blue;
        if ($scope.mode == "bar") {
          barName = 0;
        }
      } else {
        patientColor = red;
        if ($scope.mode == "bar") {
          barName = 1;
        }
      }
    }
    //hardcoded

    var obj = {
      type: $scope.mode,
      x: $scope.dates.months,
      y: $scope.dates.input,
    };
    if ($scope.mode == "scatter") {
      obj['mode'] = 'lines',
      obj['name'] = 'patient',
      obj['line'] = {
          color: patientColor,
          width: 5
      }
    } else if ($scope.mode == "bar") {
      obj[name] = barName;
    }
    data.push(obj);

    var layout = {
      width: 650,
      height: 650
    };

    if ($scope.mode == "bar") {
      layout['barmode'] = 'stack';
    }

    Plotly.newPlot('graph', data, layout);
  }
});