/**
 * Created by Andrei on 9/16/2017.
 */
var app = angular.module("app", [])
    .controller("MainController", ["$scope", "$timeout","$interval", function($scope, $timeout, $interval) {
        // Controls for the Power
        $scope.power = false;
        $scope.counter = "";
        $scope.easyTime = 750;
        $scope.compMoves = [];
        $scope.compMoving = true;
        $scope.disableStrict = false;
        $scope.tempC = "";
        var sound1 = "https://s3.amazonaws.com/freecodecamp/simonSound1.mp3";
        var sound2 = "https://s3.amazonaws.com/freecodecamp/simonSound2.mp3";
        var sound3 = "https://s3.amazonaws.com/freecodecamp/simonSound3.mp3";
        var sound4 = "https://s3.amazonaws.com/freecodecamp/simonSound4.mp3";
        var audio1 = new Audio(sound1);
        var audio2 = new Audio(sound2);
        var audio3 = new Audio(sound3);
        var audio4 = new Audio(sound4);

        $scope.powerChange = function() {
            $scope.power = $scope.power === false ? true : false;
            $scope.counter = $scope.power === false ? "" : "--";
            if ($scope.power === false) $scope.strictMode = false;
        };

        // Controls for Strict Mode
        $scope.strictMode = false;
        $scope.strictChange = function() {
            if ($scope.power) $scope.strictMode = $scope.strictMode === false ? true : false;
        };

        // This function resets the game.
        $scope.reset = function() {
            if($scope.power) {
                $scope.compMoves = [];
                $scope.playerMoves = [];
                $scope.counter = "--";
                $scope.disableStrict = false;
            }
        };


        // This function highlights the section that has been clicked.
        $scope.changeColor = function(section, comp) {
            if (comp !== true) {
                $scope.playerMoves.push(section);
                $scope.playerMove($scope.playerMoveNum);
            }
            if (section === 0) {
                $scope.clicked1 = true;
                audio1.play();
                $timeout(function() {$scope.clicked1 = false}, $scope.easyTime);
            } else if (section === 1) {
                $scope.clicked2 = true;
                audio2.play();
                $timeout(function() {$scope.clicked2 = false}, $scope.easyTime);
            } else if (section === 2) {
                $scope.clicked3 = true;
                audio3.play();
                $timeout(function() {$scope.clicked3 = false}, $scope.easyTime);
            } else if (section === 3) {
                $scope.clicked4 = true;
                audio4.play();
                $timeout(function() {$scope.clicked4 = false}, $scope.easyTime);
            }
        }

        $scope.compMove = function(fn) {
            $scope.compMoving = true;
            var i = 0;
            var promise = $interval(function() {
                if ($scope.compMoves.length === i) {
                    fn();
                    $scope.compMoving = false;
                    $interval.cancel(promise);
                } else {
                    $scope.changeColor($scope.compMoves[i], true);
                    i++;
                }
            }, 2000);
        };

        // This function starts the game. The game will only start if the power is on!
        $scope.startGame = function() {
            if ($scope.power) {
                $scope.disableStrict = true;
                $scope.playerMoves = [];
                $scope.playerMoveNum = 0;
                $scope.counter = 1;
                $scope.computerMove();
            }
        };

        $scope.computerMove = function() {
            $scope.compMoves.push(Math.floor(Math.random() * 4));
            $scope.compMove(function(){console.log("Computer Move Finished...");});
        }

        $scope.playerMove = function(movenum) {
            if ($scope.playerMoves[movenum] === $scope.compMoves[movenum]) {
                if ($scope.tempC !== "") {
                    $scope.counter = $scope.tempC;
                    $scope.tempC = "";
                }
                $scope.playerMoveNum++;
                if ($scope.playerMoves.length === $scope.compMoves.length) {
                    $scope.playerMoves = [];
                    $scope.counter++;
                    $scope.playerMoveNum = 0;
                    $timeout($scope.computerMove(), 2000);
                }
            } else {
                if ($scope.strictMode === true) {
                    $scope.playerMoves = [];
                    $scope.playerMoveNum = 0;
                    $scope.counter = "Wrong";
                    $scope.compMoves = [];
                    $scope.disableStrict = false;
                    $scope.compMoving = true;
                } else {
                    $scope.tempC = $scope.counter;
                    $scope.counter = "Wrong";

                    $scope.playerMoves = [];
                    $scope.playerMoveNum = 0;
                    $scope.compMove(function(){console.log("Computer Move Finished...");});
                }

            }
        }



    }]);