var menu = {
	selectedItem: null,
	items: [],
	init: function()
	{
		$.ajax({
		    url: "menu.php",
		    dataType:"json",
		    success: function(jsonData){
		    	actualValues.values = jsonData.values;
		    	menu.items = jsonData.menu;
				var $menu = $("<div></div>");
				var $pages = $("<div><div id=\"chart_container\"><div id=\"line_chart\"></div></div><div id=\"energy_container\"><div id=\"bar_chart\"></div></div></div>");
				
				for (var i in menu.items)
				{
					var item = menu.items[i];
					var $item = $('<div class="item"><div class="icon"></div><div>'+item.name+'</div></div>');
					item["item"] = $item;
					item["index"] = i;
					switch(item.type)
					{
						case 'schema':
							$item.find("div.icon").addClass("home");
							var $container = $('<div class="schema"></div>').load("images/"+item.schema);
							$pages.append($container);
							item["container"] = $container;
							break;
						case 'energy':
							$item.find("div.icon").addClass("chart");
							item["container"] = $pages.find("#energy_container");
							item["load"] = barChart.fetch;
					  		break;
						case 'line':
							$item.find("div.icon").addClass("chart");
							item["container"] = $pages.find("#chart_container");
							item["load"] = lineChart.fetch;
							item["page"] = "analogChart.php"
							item["table"] = new Table(item);
					  		break;
						case 'power':
							$item.find("div.icon").addClass("chart");
							item["container"] = $pages.find("#chart_container");
							item["load"] = lineChart.fetch;
							item["page"] = "powerChart.php";
							item["table"] = new Table(item);
					  		break;
					}
					$item.data(item);
					$menu.append($item);
				}

				$menu.find("div.item").hover(function() {
					$(this).addClass("hover");
				},
				function() {
					$(this).removeClass("hover");
				});
				
				$menu.find("div.item").click(function() {
					location.hash = $(this).data("index");
				});
				
				$(document).ready(function() {
					$("#menu").append($menu.children());
					$("#pages").append($pages.children());
					lineChart.init();
					barChart.init();
					menu.handle();
				});
		    }
		});
	},
	checkBrowser: function()
	{
		if(($.browser.chrome && $.browser.version.slice(0,2)>6) ||
		   ($.browser.webkit && $.browser.version.slice(0,3)>533) ||
		   ($.browser.mozilla && $.browser.version.slice(0,3)>=2.0) ||
		   ($.browser.msie && $.browser.version.slice(0,2)>7) ||
		   ($.browser.opera && $.browser.version.slice(0,4)>11.5) )
		{
			$(document).ready(menu.display);
		}
		else
		{		
			$(document).ready(function() {
				$("#browser a").click(function() {		
					menu.display();
				});
			});
		}
	},
	display: function()
	{
		$("#browser").hide();
		if(!$("div.item").is(":visible")) {
			$("div.item").fadeIn('slow');
		}	
	},
	handle: function()
	{
		var id = location.hash.substr(1);
		if(id == "home" || menu.items[id]==null){
			$("#logo").animate({'top':'50%','left':'50%'});
			$("#menu").fadeIn();
			$("body").animate({'background-color':'#EEE'});
			$("#content").animate({'top':'100%'},function(){
				$("#content").hide();
			});
			menu.selectedItem = null;
		}
		else if(menu.items[id] != menu.selectedItem){
			menu.selectedItem = menu.items[id];
			if($("#menu").is(':visible')){
				var newItem = menu.items[id].item;
				$("div.active").removeClass("active");
				newItem.addClass("active");
				var indicator = $("#indicator");
				var top = newItem.position().top + 14;
				var left = newItem.position().left -1;
				if(!indicator.is(':visible'))
				{
					indicator.css({'top': top , 'left': left});
					indicator.fadeIn();
				}
				if(indicator.position().top != top)
				{
					indicator.animate({'top':top});
				}
				indicator.animate({'left':left}, function() {
					$("#logo").animate({'top':230,'left':230});
					$("#menu").fadeOut();
					$("body").animate({'background-color':'#FFF'});
					$("#content").show().animate({'top':90}, function() {
						$("#content").trigger('complete');
					});
					
					menu.showContent();
				});
			}
			else
			{
				menu.showContent();
			}
		}
	},
	showContent: function()
	{
		$("#pages > table.chartinfo").detach();
		$("#pages").children().hide();
		menu.selectedItem["container"].show();
		
		switch(menu.selectedItem["type"]) {
			case "schema":
				toolbar.hideDateNavigation();
				actualValues.fetchData();
				break;
			case "energy":
				toolbar.showDateNavigation();
				toolbar.showGrouping();
				menu.selectedItem.load();
				break;
			default:
				toolbar.showDateNavigation();
				toolbar.showPeriod();
				menu.selectedItem.load();
				menu.selectedItem.table.getTable().appendTo("#pages");
				break;
		}
	}
}


var actualValues = 
{
	init: function()
	{
		this.fetchData();
		setTimeout(this.timer, 30000);
	},
	fetchData: function()
	{
		$.ajax({
			url: "latest.php",
			dataType:"json",
			success: this.display
		});
	},
	timer: function()
	{
		if(menu.selectedItem && menu.selectedItem["type"] == "schema")
		{
			actualValues.fetchData();
		}
		setTimeout(actualValues.timer, 30000);
	},
	display: function(data)
	{
		for(var i in actualValues.values) {
			var value = actualValues.values[i];
			$(value.path).text(value.format.replace(/((DIGITAL|MWH|KWH)\()?#\.?(#*)\)?/g, function(number,tmp,modifier,fractions) {
				switch(modifier) {
					case "DIGITAL":
						return converter.digital(data[value.frame][value.type]);
					case "MWH":
						return converter.mwh(data[value.frame][value.type]).toFixed(fractions.length);
					case "KWH":
						return converter.kwh(data[value.frame][value.type]).toFixed(fractions.length);
					default:
						return data[value.frame][value.type].toFixed(fractions.length);
				}

			}));
		}
	}
}

var converter = {
	digital: function(value)
	{
		if(value == 1) {
			return 'EIN';
		}
		else {
			return 'AUS';
		}
	},
	mwh: function(value)
	{
		return value/1000;
	},
	kwh: function(value)
	{
		return value%1000;
	}
}

google.load('visualization', '1', {'packages':['corechart']});
menu.checkBrowser();
menu.init();

$(document).ready(function() {
	actualValues.init();
	toolbar.init();
	
	$(window).on("hashchange", menu.handle);
});