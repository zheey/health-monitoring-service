var app = angular.module('healthApp', ['chart.js']);
app.controller('healthController', ['$scope','$http','$window',
    function ($scope, $http, $window) {
        $scope.Menus = [{title:'reports', icon:'file'},{title:'analytics', icon:'bar-chart'}];
        $scope.Day = function () {
            $scope.days = [];
            for(var i = 1; i<=60;i++){
                $scope.days.push('Day '+i);
            }
            return $scope.days;
        };

        $scope.Days = $scope.Day();
        $scope.labels = [];
        $scope.data = [];
        $scope.content = '/static/workreport.html';
        $scope.errormsg = false;
        $http.get('/user').
        success(function (data, status, headers, config) {
            $scope.user = data;
            $scope.error = "";
            $scope.privilege = $scope.user.privilege;
        }).
        error(function (data, status, header, config) {
            $scope.user = {};
            $scope.error = data;
        });
        $http.get('/report/get').
        success(function (data, status, headers, config) {
            $scope.Reports = data;
            $scope.Report = data[0];
            $scope.error = "";
            $scope.dat = [];
            $scope.label = [];
            $scope.mwork = [];
            $scope.awork = [];
            $scope.swork = [];
            $scope.sWages = [];
            for(var i = 0; i<$scope.Reports.length;i++){
                var projectday = $scope.Reports[i];
                var vtotal = projectday.report[0].vaccinated[0].morning + projectday.report[0].vaccinated[0].afternoon;
                var wTotal = vtotal*0.59;
                $scope.label.push(projectday.workday.toString());
                $scope.dat.push(vtotal);
                $scope.mwork.push(projectday.report[0].availableworkers[0].morning);
               $scope.awork.push(projectday.report[0].availableworkers[0].afternoon);
                $scope.swork.push(projectday.report[0].dayschedule);
                $scope.sWages.push(wTotal);

            }
            $scope.labels = $scope.label;
            $scope.data =[$scope.dat];
            var total = $scope.total();
            var nontotal = $scope.notvaccinated();
            $scope.piedata = [total,nontotal];
            $scope.bardata = [$scope.mwork,$scope.awork];
            $scope.bardata2 = [$scope.swork,$scope.dat];
            $scope.bardata3 = [$scope.sWages];

        }).
        error(function (data, status, header, config) {
            $scope.Reports = {};
            $scope.error = data;
        });

        $scope.setContent = function (filename) {
            $scope.content = '/static/' + filename;
        };


        $scope.setReport = function (workday) {
            $http.get('/report/set', {params:{work:workday}}).
            success(function (data, status, headers, config) {
                $scope.Report = data;
                $scope.error = "";
                $scope.content = '/static/workreport.html';
            }).
            error(function (data, status, header, config) {
                $scope.Report = {};
                $scope.error = data;
            });
        };

        $scope.setWages = function(morning, afternoon){
          var total = (morning + afternoon)*0.59;
          return total;
        };
        $scope.setTotal = function(morning, afternoon){
            var total = (morning + afternoon);
            return total;
        };
        $scope.total = function () {
            var totalVac = 0;
            for (var i=0; i<$scope.Reports.length; i++){
                var report = $scope.Reports[i];
                var totalVaccinated = report.report[0].vaccinated[0].morning + report.report[0].vaccinated[0].afternoon;
                totalVac+=totalVaccinated;
            }
            return totalVac;
        };
        $scope.notvaccinated = function () {
            var non = (83567 - $scope.total());
            return non;
        };
        $scope.progress = function () {
            var progress = (($scope.total()/83567)*100);
            return progress;
        };
        $scope.totalWages = function () {
            var remaining = (50000 - ($scope.total() * 0.59));
            return remaining;
        };
        $scope.remainingdays = function () {
            var days = 60-$scope.Reports.length;
            return days;
        };
        $scope.series = ['Vaccinated Children'];
        $scope.barseries = ['Morning','Afternoon'];
        $scope.barseries2 = ['Scheduled','Vaccinated'];
        $scope.barseries3 = ['Paid Wages'];
        $scope.colors = ['#008000','#FF0000'];
        $scope.barcolors = ['#008000','#FFD700'];
        $scope.barcolors2 = ['#010101','#FFD700'];
        $scope.barcolors3 = ['#010101','#FFD700'];
        $scope.pielabels = ["Vaccinated", "Not Vaccinated"];
    }]);
