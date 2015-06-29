// Creates the 'edit addional fields' modal dialog necessary fields in the $scope.
// This factory will create a "modal" object in the $scope.
// id : the unique id of the modal dialog
// title : title of the modal dialog
// additionalFieldsArray : array containing the additional fields. (tuples (name, type))
// modalEndCallback : function to call when the dialog is closed. 
// 					  It takes the array of additional fields as arguments.
var createFieldEditorModal = function($scope, id, title, additionalFieldsArray, modalEndCallback)  {
	$scope.modal = {};
	$scope.modal.id = id;
	$scope.modal.title = title;
	$scope.modal.additionalFields = additionalFieldsArray;
	$scope.modal.selectedFields = [];
	$scope.modal.savedAdditionalFields = additionalFieldsArray.slice();
	$scope.modal.fieldTypes = [
		{ name:'string' },
		{ name:'int' },
		{ name:'float' },
		{ name:'bool' }
	];
	
	$scope.modal.grid = {
		enableColumnResize: true,
		enableCellEdit: true,
		enableColumnMenus: false,
		enableHorizontalScrollbar: 0,
		enableVerticalScrollbar: 2,
		minRowsToShow: 4,
		columnDefs: [
			{name: 'name', type: 'string'},
			{
				name: 'type', 
				type: 'string',
				editableCellTemplate: 'ui-grid/dropdownEditor', 
				editDropdownValueLabel:'name',
				editDropdownIdLabel:'name',
				editDropdownOptionsArray: $scope.modal.fieldTypes
			},
		],
		data: $scope.modal.additionalFields,
	};
	// ------------------------------------------------------------------------
	// *** API Registering *** 
	// ------------------------------------------------------------------------
	$scope.modal.grid.onRegisterApi = function(gridApi) {
		var updateRow = function(row) {
			if (row.isSelected) {
				$scope.modal.selectedFields.push(row.entity);
			} else {
				var index = $scope.modal.selectedFields.indexOf(row.entity);
				if (index > -1) {
					$scope.modal.selectedFields.splice(index, 1);
				}
			}
		};
		
		gridApi.selection.on.rowSelectionChanged($scope, updateRow);
		gridApi.selection.on.rowSelectionChangedBatch($scope, function(rows)
		{
			for(var i = 0; i < rows.length; i++) {
				updateRow(rows[i]);
			}
		});
	};
	
	// ------------------------------------------------------------------------
	// *** Add / Delete field *** 
	// ------------------------------------------------------------------------
	$scope.modal.addField = function() {
		var name = "field" + $scope.additionalFields.length;
		$scope.additionalFields.push({name:name, type:'string'});
	};
	
	$scope.modal.removeSelectedFields = function() {
		for (var i = 0; i < $scope.modal.selectedFields.length; i++) {
			var index = $scope.modal.additionalFields.indexOf($scope.modal.selectedFields[i]);
			if (index > -1) {
				$scope.modal.additionalFields.splice(index, 1);
			}
		}
		$scope.modal.selectedFields = [];
	};
	
	// Calls the user's callback, and saves the additional fields.
	$scope.modal.ok = function() {
		$scope.savedAdditionalFields = $scope.additionalFields.slice();
		modalEndCallback($scope.additionalFields);
	};
	
	// Restores the original additional fields.
	$scope.modal.cancel = function() {
		$scope.additionalFields.splice(0, $scope.additionalFields.length);
		for(var i = 0; i < $scope.savedAdditionalFields.length; i++) {
			$scope.additionalFields.push($scope.savedAdditionalFields[i]);
		}
	};
	
	// Cancel on hide.
	window.setTimeout(function() {
		$("#modal" + $scope.modal.id).on('hidden.bs.modal', function() {
			$scope.modal.cancel();
		});
	}, 2000);
};