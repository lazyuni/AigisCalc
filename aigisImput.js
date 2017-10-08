
var mapData_;
var targetList_;
var storage = localStorage;

var tableMap;
var tableTarget;

var BAR_MAX_WIDTH = 1000;

function itemChange1()
{
	storage.setItem(this.id, this.value);
	recalc();
}
function itemChangeCheck()
{
	storage.setItem(this.id, this.checked);
	recalc();
}

function exportData()
{
	var obj = new Object();
	obj.dateFrom = storage.getItem('dateFrom');
	obj.dateTo = storage.getItem('dateTo');
	var mapData = JSON.parse(storage.getItem('mapData'));
	
	for(var i = mapData.length-1 ; i >= 0; i--)
	{
		if(mapData[i][0] == null)
		{
			mapData.pop();
		}
	}
	obj.mapData = mapData;
	var targetList = JSON.parse(storage.getItem('targetList'));
	for(var i = targetList.length-1 ; i >= 0; i--)
	{
		if(targetList[i][0] == null)
		{
			targetList.pop();
		}
	}
	obj.targetList = targetList;
	document.querySelector("#exportArea").innerHTML = JSON.stringify(obj);
	document.querySelector("#exportArea").style.display="block";
	document.querySelector("#exportDiscript").style.display="inline";
	
}
function clearData()
{
	storage.removeItem('dateFrom');
	storage.removeItem('dateTo');
	storage.removeItem('mapData');
	storage.removeItem('targetList');
	init();
}
function mapClear()
{
	storage.removeItem('mapData');
	storage.removeItem('targetList');
}
function init()
{
	document.querySelector("#dateFrom").onblur = itemChange1;
	document.querySelector("#dateTo").onblur = itemChange1;
	document.querySelector("#exportBtn").onclick = exportData;
	document.querySelector("#clearData").onclick = mapClear;

	document.querySelector("#dateFrom").value = storage.getItem('dateFrom');
	document.querySelector("#dateTo").value = storage.getItem('dateTo');

	mapData_ = storage.getItem('mapData');
	if(mapData_ == null || mapData_.length == 0)
	{
		mapData_ = [
			[,,,,,,,,,]
		];
	}
	else
	{
		mapData_ = JSON.parse(mapData_);
	}
	
	targetList_= storage.getItem('targetList');
	if(targetList_ == null || targetList_.length == 0)
	{
		targetList_ = [
			[,]
		];
	}
	else
	{
		targetList_ = JSON.parse(targetList_);
	}

	document.getElementById("grid");
	tableMap = new Handsontable(grid, {
		data: mapData_,
		columns : mapColumns,
		colHeaders: mapHeaders,
		readOnly:false,
		cells: function(row, col, prop) {
			storage.setItem("mapData", JSON.stringify(mapData_));
			
		    var cellProperties = {};
		    return cellProperties;
		}
	});
	
	tableTarget = new Handsontable(document.getElementById('targetList'),{
		data: targetList_,
		columns : tarColumns,
		colHeaders: tarHeaders,
		readOnly:false,
		cells: function(row, col, prop) {
			storage.setItem("targetList", JSON.stringify(targetList_));
			
		    var cellProperties = {};
		    return cellProperties;
		}
	});
}

var mapColumns = [
	{type:'text'},
	{type:'autocomplete', source:['初級','中級','上級','極級','神級']},
	{type:'numeric'},
	{type:'numeric'},
	{type:'numeric'},
	{type:'text'},
	{type:'text'},
	{type:'text'},
	{type:'text'},
];

var tarColumns = [
	{type:'numeric'},
	{type:'text'},
];

var mapHeaders = ['MAP','難易度','カリスマ','スタミナ','期待値','ドロップ１','ドロップ２','ドロップ３','ドロップ４'];
var tarHeaders = ['目標個数','説明'];


if( window.addEventListener )
{
    window.addEventListener( 'load', init, false );
}
else if( window.attachEvent )
{
    window.attachEvent( 'onload', init );
}
else
{
    window.onload = init;
}
