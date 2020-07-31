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

    if ($scope.mode == "scatter") {
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
          mode: 'lines',
          name: lines[i][0],
          line: {
              color: lineColor,
              width: 1
          }
        }
        data.push(obj);
      };
    
      //hardcoded
      var patientColor = 'rgb(0, 0, 0)';
      var barName = "patient";
      // choose a color for patient input
      if ($scope.columns.columnName == "vol5_lvef") {
        if ((50 > $scope.month24) || (($scope.month3 - $scope.month24) > 10)) {
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
        mode: 'lines',
        name: 'patient',
        line: {
            color: patientColor,
            width: 5
        }
      }
      data.push(obj);

      var layout = {
        width: 650,
        height: 650
      };

      Plotly.newPlot('graph', data, layout);
    }
    else if ($scope.mode == "bar") {
      var data = [];
      var chartData = {};

      for (var i = 0; i < $scope.dates.months.length; i++) {
        chartData[$scope.dates.months[i]] = {};
      }

      for (var i = 0; i < $scope.csvObjs.length; i++) {
        var currObj = $scope.csvObjs[i];
        var currMonth = currObj[$scope.columns.timeName];
        var currCategory = currObj[$scope.columns.columnName];
        if (!(currCategory == -16.61755714)) { //null entry check
          // {month0: {1: [notHealthy, healthy], 2:...}, month3: {...}, month24: {...}}
          if (chartData[currMonth] === undefined || !(currCategory in chartData[currMonth])) {
            chartData[currMonth][currCategory] = [0, 0];
          }
          chartData[currMonth][currCategory][currObj["Label"]]++; // hardcoded
        }
      }

      // for each month
      for (var i = 0; i < $scope.dates.months.length; i++) {
        var numOfPat = {healthy: [], unhealthy: []};
        Object.values(chartData[$scope.dates.months[i]]).forEach( function (category, index) {
          numOfPat.healthy.push(category[0]);
          numOfPat.unhealthy.push(category[1]);
        });
        var bar1 = {
          x: Object.keys(chartData[$scope.dates.months[i]]),
          y: numOfPat.healthy,
          type: "bar",
          name: Object.keys(numOfPat)[0], 
          xaxis: 'x' + String(i + 1),
          barmode: 'stack', 
          marker: {color: '#00f'}
        }

        var bar2 = {
          x: Object.keys(chartData[$scope.dates.months[i]]),
          y: numOfPat.unhealthy,
          type: "bar",
          name: Object.keys(numOfPat)[1], 
          xaxis: 'x' + String(i + 1),
          barmode: 'stack', 
          marker: {color: '#f00'}
        }

        data.push(bar1, bar2);
      };

      var barColor = '#000';
      if ($scope.dates.input.length > 0 && $scope.columns.columnName == "vol5_lvef") {
        if ((50 > $scope.month24) || (($scope.month3 - $scope.month24) > 10)) {
          barColor = '#f00';
        } else {
          barColor = '00f';
        }
      }
      $scope.dates.input.forEach( function (entry, index) {
        data.push({
          x: [entry],
          y: [1],
          type: "bar",
          name: "patient",
          xaxis: 'x' + String(index + 1),
          barmode: 'stack',
          marker: {color: barColor}
        });
      });

      layout = {
        width: 650,
        height: 650,
        barmode: "stack"
      }

      for (var i = 0; i < $scope.dates.months.length; i++) {
        var keyName = "xaxis";
        if (i + 1 != 1) {
          keyName += String(i + 1);
        }
        layout[keyName] = {
          domain: [i * (1/($scope.dates.months.length)), (i * (1/($scope.dates.months.length))) + (1/($scope.dates.months.length))],
          anchor: 'x' + String(i + 1),
          title: 'Month ' + String($scope.dates.months[i])
        };
      }

      Plotly.newPlot('graph', data, layout);
    }
  }
});