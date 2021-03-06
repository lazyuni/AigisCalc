
var storage = localStorage;

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

function recalc()
{
	if(mapData == null) return;
	if(mapData.length == 0) return;
	//現在値
	var nowVal = document.querySelector("#nowVal").value;
	//目標値
	var targetVal = document.querySelector("#targetVal").value;
	//イベント期間
	var dateFrom = document.querySelector("#dateFrom").innerHTML;
	var dateTo = document.querySelector("#dateTo").innerHTML;

	var nowDate = new Date();
	var startDate = new Date(dateFrom);
	var endDate = new Date(dateTo);
	startDate.setHours(10);
	endDate.setHours(10);
	
	var maxSec = (endDate.getTime() - startDate.getTime()) / 1000;
	var tarSec = (nowDate.getTime() - startDate.getTime()) / 1000;
	var curSec = (nowVal / targetVal) * maxSec;
	var progVal = (curSec / maxSec) ;
	var progMax = (tarSec / maxSec) ;
	if(progMax > 1) progMax = 1;
	
	var progressMax = document.querySelector("#progressMax");
	progressMax.style.width = (progMax * BAR_MAX_WIDTH) + "px";
	progressMax.innerHTML = "" + Math.round(progMax * 100)  + "%経過";
	
	var progressNow = document.querySelector("#progressNow");
	if(progVal > 1)
	{
		progressNow.style.width = BAR_MAX_WIDTH + "px";
	}
	else
	{
		progressNow.style.width = (progVal * BAR_MAX_WIDTH) + "px";
	}
	progressNow.innerHTML = ""+Math.round(progVal * 100) + "%達成";
	
	//残り時間(秒)
	var shortageSec = (endDate.getTime() - nowDate.getTime()) / 1000;
	
	//いまのペースだと
	var pace = (nowVal / tarSec) * shortageSec;
	pace = Math.floor(pace) + (nowVal-0);
	document.querySelector("#pace").innerHTML = pace;
	
	
	//王子ランク(index)
	var selectedPrinceRankIndex = document.querySelector("#princeRank").value - 0;
	//選択周回マップ（index)
	var selectedAroundMapIndex = document.querySelector("#aroundMap").value - 0;
	
	//残り時間(h)
	var remainHour = (endDate.getTime() - nowDate.getTime()) / (1000 * 60 * 60);
	if(remainHour < 0) remainHour = 0;
	//1カリスマ辺りのスタミナ
	var spc = mapData[selectedAroundMapIndex][3] / mapData[selectedAroundMapIndex][2];
	//期待値
	var exp = mapData[selectedAroundMapIndex][4];
	//王子ランクカリスマ
	var princeChari = princeRankList[selectedPrinceRankIndex][1];
	//王子ランクスタミナ
	var princeSta = princeRankList[selectedPrinceRankIndex][2];
	
	//残個数
	var shortageVal = targetVal - nowVal;
	
	//残り周回数
	var remainingAround = shortageVal / exp;
	if(exp == 0) remainingAround = 0;
	remainingAround = Math.ceil(remainingAround);
	document.querySelector("#estimateAround").innerHTML = remainingAround;
	
	
	//残り周回に必要なスタミナ
	var spra = remainingAround * mapData[selectedAroundMapIndex][3];
	
	//残り周回に必要なカリスマ
	var cpra = remainingAround * mapData[selectedAroundMapIndex][2];
	
	//自然回復
	var isAutoRecovery = document.querySelector("#isAutoRecovery").checked;
	//残り時間で回復するスタミナ
	var autoRecSta = remainHour * 1;
	//残り時間で回復するカリスマ
	var autoRecChari = remainHour * 20;
	//残り時間で回復するスタミナ石換算
	var autoRecStaStone = autoRecSta / princeSta;
	//残り時間で回復するカリスマ石換算
	var autoRecChariStone = autoRecChari / princeChari;

	if(	isAutoRecovery)
	{
		spra -= autoRecSta;
		cpra -= autoRecChari;
		if(spra < 0)spra=0;
		if(cpra < 0)cpra=0;
	}
	
	//残り周回に必要なスタミナを石換算
	var consumStamina = Math.ceil(spra / princeSta);
	document.querySelector("#consumStamina").innerHTML = consumStamina;
	
	//残り周回に必要なカリスマを石換算
	var consumCharisma = Math.ceil(cpra / princeChari);
	document.querySelector("#consumCharisma").innerHTML = consumCharisma;
	
	//必要な石
	var consumCount = consumStamina + consumCharisma;
	document.querySelector("#consumCount").innerHTML = consumCount;
	
	//一日あたりのノルマ
	//石数
	var normaCount = shortageVal / (shortageSec / (3600 * 24));
	document.querySelector("#normaCount").innerHTML = Math.ceil(normaCount);
	//周回数
	var normaAround = normaCount / exp;
	document.querySelector("#normaAround").innerHTML = Math.ceil(normaAround);

}


function makeTargetList()
{
	if(targetList == null) return;
	var parentElm = document.querySelector('#targetList');
	for(let i = 0; i < targetList.length; i++)
	{
		var elm = document.createElement("li");
		elm.setAttribute("value",targetList[i][0]);
		elm.innerHTML = targetList[i][0] +" "+ targetList[i][1];
		elm.addEventListener('click', function(e) {
			document.querySelector('#targetVal').value = e.target.getAttribute('value');
			document.querySelector("#targetVal").dispatchEvent(new Event('blur'));
			dialogClose();
		}, false);
		parentElm.appendChild(elm);
	}
	
}


function makeAroundMapList()
{
	if(mapData == null) return;
	var options = "";
	for(let i = 0; i < mapData.length; i++)
	{
		options += "<option value='"+ i + "'>" +mapData[i][0] +"("+ mapData[i][2]+"/"+mapData[i][3]+")</option>";
	}
	
	document.getElementById("aroundMap").innerHTML = options;
}

function makePrinceRankList()
{
	var options = "";
	for(let i = 0; i < princeRankList.length; i++)
	{
		options += "<option value='"+ i + "'>" +princeRankList[i][0] +"("+ princeRankList[i][1]+"/"+princeRankList[i][2]+")</option>";
	}
	
	document.getElementById("princeRank").innerHTML = options;
}

function importOK()
{
	var jsn = document.querySelector('#importForm textarea').value;
	var data;
	try
	{
		data = JSON.parse(jsn);
	}catch(e)
	{
		alert("データがおかしいっぽい");
		return;
	}

	mapData = data.mapData;
	targetList = data.targetList;
	
	storage.setItem("dateFrom", data.dateFrom);
	storage.setItem("dateTo", data.dateTo);
	storage.setItem("mapData",  JSON.stringify(mapData));
	storage.setItem("targetList",  JSON.stringify(targetList));
	
	document.getElementById("targetList").innerHTML = "";

	init();

	dialogClose();
}
function showTargetList()
{
	document.querySelector("#targetList").style.display = 'block';
	document.querySelector("#bgArea").style.display = 'block';

}
function importClick()
{
	document.querySelector("#bgArea").style.display = 'block';
	document.querySelector("#importForm").style.display = 'block';
}

function dialogClose()
{
	document.querySelector("#bgArea").style.display = 'none';
	document.querySelector("#targetList").style.display = 'none';
	document.querySelector("#importForm").style.display = 'none';
}
function helpClose()
{
	var parent = this.parentNode;
	parent.style.display = 'none';
}
function helpOpen()
{
	document.querySelector("#help").style.display = 'block';
}

function init()
{
	document.getElementById("grid").innerHTML = "";
	
	mapData = storage.getItem('mapData');
	if(mapData != null)
	{
		mapData = JSON.parse(mapData);
		for(var i = mapData.length-1 ; i >= 0; i--)
		{
			if(mapData[i][0] == null)
			{
				mapData.pop();
			}
		}
	}
	
	targetList = storage.getItem('targetList');
	if(targetList != null)
	{
		targetList = JSON.parse(targetList);
		for(var i = targetList.length-1 ; i >= 0; i--)
		{
			if(targetList[i][0] == null)
			{
				targetList.pop();
			}
		}
	}
	

	makePrinceRankList();
	makeTargetList();
	makeAroundMapList();

	document.querySelector("#nowVal").onblur = itemChange1;
	document.querySelector("#nowVal").onchange = itemChange1;
	document.querySelector("#targetVal").onblur = itemChange1;
	document.querySelector("#targetVal").onchange = itemChange1;
	document.querySelector("#targetVal").ondblclick = showTargetList;
	 
	document.querySelector("#dateFrom").onblur = itemChange1;
	document.querySelector("#dateFrom").onchange = itemChange1;
	document.querySelector("#princeRank").onblur = itemChange1;
	document.querySelector("#princeRank").onchange = itemChange1;
	document.querySelector("#aroundMap").onblur = itemChange1;
	document.querySelector("#aroundMap").onchange = itemChange1;
	document.querySelector("#isAutoRecovery").onblur = itemChangeCheck;
	document.querySelector("#isAutoRecovery").onclick = itemChangeCheck;
	document.querySelector("#importBtn").onclick = importClick;
	document.querySelector("#bgArea").onclick = dialogClose;
	document.querySelector("#importOK").onclick = importOK;
	document.querySelector("#importCancel").onclick = dialogClose;
	document.querySelector("#helpClose").onclick = helpClose;
	document.querySelector("#helpOpen").onclick = helpOpen;

	document.querySelector("#nowVal").value = storage.getItem('nowVal');
	document.querySelector("#targetVal").value = storage.getItem('targetVal');
	document.querySelector("#princeRank").value = storage.getItem('princeRank');
	document.querySelector("#aroundMap").value = storage.getItem('aroundMap');
	document.querySelector("#isAutoRecovery").checked = storage.getItem('isAutoRecovery');

	var sdate = storage.getItem('dateFrom');
	document.querySelector("#dateFrom").innerHTML = sdate.replace('-','/');
	sdate = storage.getItem('dateTo');
	document.querySelector("#dateTo").innerHTML = sdate.replace('-','/');

	document.getElementById("grid");
	new Handsontable(grid, {
		data: mapData,
		colHeaders: mapHeaders,
		readOnly:true,
		cells: function(row, col, prop) {
		    var cellProperties = {};
		    if (col == 4) {
		        cellProperties.readOnly = false;
		    }
		    return cellProperties;
		}
	});

	recalc();
}

var mapHeaders = ['MAP','難易度','カリスマ','スタミナ','期待値','ドロップ１','ドロップ２','ドロップ３','ドロップ４'];

var mapData = [];

var targetList = [];

var princeRankList = [
	[1,30,12],
	[2,33,12],
	[3,36,12],
	[4,39,12],
	[5,42,12],
	[6,45,12],
	[7,48,12],
	[8,51,12],
	[9,54,12],
	[10,57,12],
	[11,60,12],
	[12,63,12],
	[13,66,12],
	[14,69,12],
	[15,72,12],
	[16,75,12],
	[17,78,12],
	[18,81,12],
	[19,84,12],
	[20,87,12],
	[21,90,12],
	[22,93,12],
	[23,96,12],
	[24,99,12],
	[25,102,12],
	[26,105,12],
	[27,108,12],
	[28,111,12],
	[29,114,12],
	[30,117,12],
	[31,120,12],
	[32,123,12],
	[33,126,12],
	[34,129,12],
	[35,132,12],
	[36,135,12],
	[37,138,12],
	[38,141,12],
	[39,144,12],
	[40,147,12],
	[41,150,12],
	[42,153,12],
	[43,156,12],
	[44,159,12],
	[45,162,12],
	[46,165,12],
	[47,168,12],
	[48,171,12],
	[49,174,12],
	[50,177,12],
	[51,180,12],
	[52,183,12],
	[53,186,12],
	[54,189,12],
	[55,192,12],
	[56,195,12],
	[57,198,12],
	[58,201,12],
	[59,204,12],
	[60,207,12],
	[61,210,12],
	[62,213,12],
	[63,216,12],
	[64,219,12],
	[65,222,12],
	[66,225,12],
	[67,228,12],
	[68,231,12],
	[69,234,12],
	[70,237,12],
	[71,240,12],
	[72,243,12],
	[73,246,12],
	[74,249,12],
	[75,252,12],
	[76,255,12],
	[77,258,12],
	[78,261,12],
	[79,264,12],
	[80,267,12],
	[81,270,12],
	[82,273,12],
	[83,276,12],
	[84,279,12],
	[85,282,12],
	[86,285,12],
	[87,288,12],
	[88,291,12],
	[89,294,12],
	[90,297,12],
	[91,300,12],
	[92,303,12],
	[93,306,12],
	[94,309,12],
	[95,312,12],
	[96,315,12],
	[97,318,12],
	[98,321,12],
	[99,324,12],
	[100,327,12],
	[101,328,13],
	[102,329,13],
	[103,330,13],
	[104,331,13],
	[105,332,13],
	[106,333,13],
	[107,334,13],
	[108,335,13],
	[109,336,13],
	[110,337,13],
	[111,338,13],
	[112,339,13],
	[113,340,13],
	[114,341,13],
	[115,342,13],
	[116,343,13],
	[117,344,13],
	[118,345,13],
	[119,346,13],
	[120,347,14],
	[121,348,14],
	[122,349,14],
	[123,350,14],
	[124,351,14],
	[125,352,14],
	[126,353,14],
	[127,354,14],
	[128,355,14],
	[129,356,14],
	[130,357,14],
	[131,358,14],
	[132,359,14],
	[133,360,14],
	[134,361,14],
	[135,362,14],
	[136,363,14],
	[137,364,14],
	[138,365,14],
	[139,366,14],
	[140,367,15],
	[141,368,15],
	[142,369,15],
	[143,370,15],
	[144,371,15],
	[145,372,15],
	[146,373,15],
	[147,374,15],
	[148,375,15],
	[149,376,15],
	[150,377,15],
	[151,378,15],
	[152,379,15],
	[153,380,15],
	[154,381,15],
	[155,382,15],
	[156,383,15],
	[157,384,15],
	[158,385,15],
	[159,386,15],
	[160,387,16],
	[161,388,16],
	[162,389,16],
	[163,390,16],
	[164,391,16],
	[165,392,16],
	[166,393,16],
	[167,394,16],
	[168,395,16],
	[169,396,16],
	[170,397,16],
	[171,398,16],
	[172,399,16],
	[173,400,16],
	[174,401,16],
	[175,402,16],
	[176,403,16],
	[177,404,16],
	[178,405,16],
	[179,406,16],
	[180,407,17],
	[181,408,17],
	[182,409,17],
	[183,410,17],
	[184,411,17],
	[185,412,17],
	[186,413,17],
	[187,414,17],
	[188,415,17],
	[189,416,17],
	[190,417,17],
	[191,418,17],
	[192,419,17],
	[193,420,17],
	[194,421,17],
	[195,422,17],
	[196,423,17],
	[197,424,17],
	[198,425,17],
	[199,426,17],
	[200,427,18],
];

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
