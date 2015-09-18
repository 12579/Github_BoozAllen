(function () {
    'use strict';

    var app = angular.module('riskCanvasApp', ['ui.router', 'angularGrid', 'nvd3ChartDirectives', 'ngVis']);

    app.service('ShareData', function () {
        return {};
    });

    app.service('authenticationSvc', function () {
        return {};
    });


    angular.module('riskCanvasApp')
    .controller('RiskDnaCtrl', ["$state", "$scope", "$stateParams", "$window", "$http", "authenticationSvc", "ShareData", 'VisDataSet', function ($state, $scope, $stateParams, $window, $http, authenticationSvc, shareData, VisDataSet) {
        var LENGTH_MAIN = 50,
            LENGTH_SERVER = 150,
            LENGTH_SUB = 50,
            WIDTH_SCALE = 2,
            GREEN = 'green',
            RED = '#C5000B',
            ORANGE = 'orange',
            //GRAY = '#666666',
            GRAY = 'gray',
            BLACK = '#2B1B17',
            WHITE = '#fff',
            BLACK = 'black';

        var x = -350;
        var y = -250;
        var step = 100;

        var xHouse = -250;
        var yHouse = -200;

        var xCounter = 50;
        var yCounter = -200;

        var xFriend = -250;
        var yFriend = 200;

        var xColleauge = 50;
        var yColleauge = 200;


        var nodes = VisDataSet([
          { id: 1, label: 'PRIMARY', group: 'main', physics: false, title: 'PRIMARY ACCOUNT' },

          { id: 2, x: xHouse+ step, y: yHouse , label: 'HOUSE 1', group: 'house', physics: false },
           { id: 3, x: xHouse+ 2 * step, y: yHouse , label: 'HOUSE 2', group: 'house', physics: false },

          { id: 4, x: xCounter + step, y: yCounter, label: 'COUNTER 1', group: 'counter', physics: false },
          { id: 5, x: xCounter + step*2, y: yCounter, label: 'COUNTER 2', group: 'counter', physics: false },

          { id: 6, x: xFriend + step, y: yFriend, label: 'FRIEND 1', group: 'friend', physics: false },
          { id: 7, x: xFriend + step * 2, y: yFriend, label: 'FRIEND 2', group: 'friend', physics: false },

          { id: 8, x: xColleauge + step, y: yColleauge, label: 'COLLEAUGE 1', group: 'colleauge', physics: false, cid: 1 },
          { id: 9, x: xColleauge + step*2, y: yColleauge, label: 'COLLEAUGE 2', group: 'colleauge', physics: false, cid: 1 },
          { id: 1001, x: x, y: y + step, label: 'HOUSE', group: 'house', value: 1, fixed: true, physics: false },
          { id: 1002, x: x, y: y + 2 * step, label: 'COUNTER', group: 'counter', value: 1, fixed: true, physics: false },
          { id: 1003, x: x, y: y + 3 * step, label: 'FRIEND', group: 'friend', value: 1, fixed: true, physics: false },
          { id: 1004, x: x, y: y + 4 * step, label: 'COLLEAUGE', group: 'colleauge', value: 1, fixed: true, physics: false }
        ]);

      

        var edges = VisDataSet([
          { from: 1, to: 2, length: LENGTH_MAIN, width: WIDTH_SCALE * 1, color: GRAY },
          { from: 1, to: 3, length: LENGTH_MAIN, width: WIDTH_SCALE * 2, color: RED },

          { from: 1, to: 4, length: LENGTH_MAIN, width: WIDTH_SCALE * 1, color: GREEN },
          { from: 1, to: 5, length: LENGTH_MAIN, width: WIDTH_SCALE * 2, color: RED },

          { from: 1, to: 6, length: LENGTH_MAIN, width: WIDTH_SCALE * 1, color: BLACK },
          { from: 1, to: 7, length: LENGTH_MAIN, width: WIDTH_SCALE * 3, color: RED },

          { from: 1, to: 8, length: LENGTH_MAIN, width: WIDTH_SCALE * 1, color: ORANGE },
          { from: 1, to: 9, length: LENGTH_MAIN, width: WIDTH_SCALE * 4, color: RED }
        ]);

        $scope.data = {
            nodes: nodes,
            edges: edges
        };



        $scope.options = {
            layout: {
                randomSeed: undefined,
                improvedLayout: true,
                hierarchical: {
                    enabled: false
                }
            },
            height: '400',
            width: '100%',
            groups: {
                main: {
                    image: '../../../assets/img/icon11.png',
                    shape: 'circularImage',
                    
                    color: {
                        background: WHITE,
                        border: BLACK
                    },
                    fixed: {
                        x: true,
                        y: true
                    }

                },
                house: {
                    image: '../../../assets/img/icon7.png',
                    shape: 'circularImage',
                    
                    color: {
                        background: WHITE,
                        border: BLACK
                    },
                    fixed: {
                        x: true,
                        y: true
                    }

                },
                counter: {
                    image: '../../../assets/img/icon10.png',
                    shape: 'circularImage',
                    
                    color: {
                        background: WHITE,
                        border: BLACK
                    },
                    fixed: {
                        x: true,
                        y: true
                    }
                },
                friend: {
                    image: '../../../assets/img/icon9.png',
                    shape: 'circularImage',
                    
                    color: {
                        background: WHITE,
                        border: BLACK
                    },
                    fixed: {
                        x: true,
                        y: true
                    }
                },
                colleauge: {
                    image: '../../../assets/img/icon8.png',
                    shape: 'circularImage',
                    color: {
                        background: WHITE,
                        border: BLACK
                    },
                    fixed: {
                        x: true,
                        y: true
                    }
                }
            }
        };


    }
    ]);
})();