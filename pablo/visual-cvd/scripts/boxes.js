var app = angular.module("boxesApp", []);
app.controller("boxesCtrl", function($scope) {
  $scope.compare = function () {
    var y0 = [];
    var y1 = [];
    for (var i = 0; i < 50; i ++) {
      y0[i] = Math.random();
      y1[i] = Math.random() + 1;
    }

    var trace1 = {
      y: y0,
      type: 'box'
    };

    var trace2 = {
      y: y1,
      type: 'box'
    };

    var data = [trace1, trace2];

    Plotly.newPlot('boxes', data);
  }
});