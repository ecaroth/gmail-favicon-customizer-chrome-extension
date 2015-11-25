var app = angular.module('gfc_app', []);
app.controller('gfc_controller', function($scope,$window,$timeout) {

        $scope.accounts = [];
        $scope.accounts_display = [];
        $scope.loaded = false;
        $scope.show_upload = {};
        $scope.save_text = 'Save';
        $scope.saving = false;

        chrome.storage.local.get('gmail_accounts',function(items){
            $scope.loaded = true;
            $scope.accounts = 'gmail_accounts' in items ? items.gmail_accounts :[];
            $scope.accounts_display = $scope.accounts.slice();
            if($scope.accounts.length==0) $scope.add_account();
            $scope.$digest();
        });

        $scope.save = function(){
            $scope.saving = true;
            $scope.save_text = 'Saving...';
            var accts = [];
            var nval = $scope.accounts_display.slice();
            for(var i=0; i<nval.length; i++){
                if(nval[i].email && nval[i].favicon) {
                    accts.push({
                        email: String(nval[i].email.toLowerCase()),
                        favicon: String(nval[i].favicon)
                    });
                }
            }
            chrome.storage.local.set({
                'gmail_accounts': accts.slice()
            },function(){
                $scope.save_text = 'Saved!';
                $scope.saving = false;
                $scope.$digest();
                $timeout(function(){
                    $scope.save_text = 'Save';
                },3000);
            });
        };

        $scope.delete = function(ind){
            $scope.accounts_display.splice(ind,1);
        };

        $scope.add_account = function(){
            $scope.accounts_display.push({
                'email': null,
                'favicon': null
            });
        }
});


app.directive("fileread", [function () {
    return {
        scope: {
            fileread: "="
        },
        link: function (scope, element, attributes) {
            element.bind("change", function (changeEvent) {
                var reader = new FileReader();
                reader.onload = function (loadEvent) {
                    scope.$apply(function () {
                        scope.fileread = loadEvent.target.result;
                    });
                }
                reader.readAsDataURL(changeEvent.target.files[0]);
            });
        }
    }
}]);