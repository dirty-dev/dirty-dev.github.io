//localStorage.setItem("JSON",'{"tabs":[{"name":"Entertainment","parent":null,"links":[{"key":"Youtube","url":"https://www.youtube.com/feed/subscriptions"},{"key":"Soundcloud","url":"https://soundcloud.com/you/likes"},{"key":"Pinterest","url":"https://www.pinterest.com/"}]},{"name":"Utilities","parent":null,"links":[{"key":"Gmail","url":"https://mail.google.com/mail/u/0/#inbox"},{"key":"Google Drive","url":"https://drive.google.com/drive/u/0/my-drive"}]},{"name":"Reference","parent":null,"links":[{"key":"Processing","url":"https://processing.org/reference/"}]},{"name":"Games","parent":null,"links":[]},{"name":"2D","parent":"Reference","links":[{"key":"Blueprints","url":"https://www.the-blueprints.com/"},{"key":"Sketchup Textures","url":"https://www.sketchuptextureclub.com/textures"}]},{"name":"AI Images","parent":"2D","links":[{"key":"Wombo","url":"https://app.wombo.art/"},{"key":"Mage","url":"https://www.mage.space/"}]},{"name":"EDF","parent":"Games","links":[{"key":"EDF Guns","url":"http://weapon.edf.jpn.com/4-1/?p=r"},{"key":"EDF Levels","url":"https://steamcommunity.com/sharedfiles/filedetails/?id=1546539186"}]}]}');
//'{"tabs":[{"name":"Games","tabs":[{"name":"EDF","tabs":[],"links":[{"key":"EDF Guns","url":"http://weapon.edf.jpn.com/4-1/?p=r"},{"key":"EDF Levels","url":"https://steamcommunity.com/sharedfiles/filedetails/?id=1546539186"}]}],"links":[]},{"name":"Pictures","tabs":[],"links":[{"key":"AI Images","url":"https://app.wombo.art/"}]}]}'
var space = '&nbsp';
var json = JSON.parse(localStorage.getItem("JSON"));
var tabWidth;
initJSON();
//console.log(JSON.stringify(json, undefined, 4));
const toggleNav = () => {
  document.body.dataset.nav = document.body.dataset.nav === "true" ? "false" : "true";
}
$(document).ready(function(){
   $( "#bookmark" ).submit(function( event ) {
		var ky = $("#url_name").val();
		var value = $("#url").val();
		var tabSelect = $("#tabSelect").val();
		event.preventDefault();
		json.tabs[tabSelect].links.push({key: ky, url: value});
		localStorage.setItem("JSON", JSON.stringify(json));
		populateBookmarks();
		$("#url_name").val('');
		$("#url").val('');
	});
	$( "#ntab" ).submit(function( event ) {
		var ky = $("#ntab_name").val();
		var value = $("#ntabSelect").val();
		value = value=='null'?null:value;
		event.preventDefault();
		json.tabs.push({name: ky, parent: value, links: [null]});
		localStorage.setItem("JSON", JSON.stringify(json));
		populateBookmarks();
		updateTabs();
		$("#ntab_name").val('');
		$("#ntabSelect").val('null');
	});
	$( "#dltab" ).submit(function( event ) {
		var ky = $("#dltabSelect").val();
		var value = $("#ntabSelect").val();
		value = value=='null'?null:value;
		event.preventDefault();
		json.tabs.push({name: ky, parent: value, links: [null]});
		localStorage.setItem("JSON", JSON.stringify(json));
		populateBookmarks();
		updateTabs();
		$("#ntab_name").val('');
		$("#ntabSelect").val('null');
	});
	$( "#dtab" ).submit(function( event ) {
		var value = $("#dtabSelect").val();
		var tname = json.tabs[value].name;
		event.preventDefault();
		if(json.tabs[value].parent==null){
			if(json.tabs[value].links.length>0){
				var conf = confirm("Delete tab and its links?");
				if(conf){
					json.tabs.splice(value,1);
					initJSON();
					localStorage.setItem("JSON", JSON.stringify(json));
				}
			}else{
				var child=-1;
				for(var i=0;i<json.tabs.length;i++){
					if(json.tabs[i].parent==tname){
						child=i;
						break;
					}
				}
				if(child>-1){
					var conf = confirm("Delete tab and its children?");
					if(conf){
						json.tabs.splice(value,1);
						initJSON();
						localStorage.setItem("JSON", JSON.stringify(json));
					}
				}else{
					json.tabs.splice(value,1);
					localStorage.setItem("JSON", JSON.stringify(json));
					initJSON();
				}
			}
		}else{
			var parentInd=0;
			for(var i=0;i<json.tabs.length;i++){
				if(json.tabs[i].name==json.tabs[value].parent){
					parentInd=i;
					break;
				}
			}
			for(var i=0;i<json.tabs[value].links.length;i++){
				json.tabs[parentInd].links.push({key:json.tabs[value].links[i].key, url:json.tabs[value].links[i].url});
			}
			json.tabs.splice(value,1);
			localStorage.setItem("JSON", JSON.stringify(json));
		}
		populateBookmarks();
		updateTabs();
	});
	
	$("#dltabSelect").change(function() {
		setLinkList($(this).val());
	});
	
	document.getElementById("defaultOpen").click();
	populateBookmarks();
	updateTabs();
});

function removeStorageItem(tabName, index){
	console.log(tabName+', '+index);
	json.tabs[tabName].links.splice(index,1);
	localStorage.setItem("JSON", JSON.stringify(json));
	populateBookmarks();
}

function initJSON(){
	var ptabs = 0;
	for(var i=0;i<json.tabs.length;i++){
		if(json.tabs[i].parent==null)ptabs++;
	}
	tabWidth = 100 / ptabs;
}

function updateTabs(){
	$('#tabSelect').empty();
	$('#ntabSelect').empty();
	$('#dltabSelect').empty();
	$('#dtabSelect').empty();
	for(var i=0;i<json.tabs.length;i++){
		$('#tabSelect').append('<option value="'+i+'">'+json.tabs[i].name+'</option>');
	}
	$('#ntabSelect').append('<option value="null">None</option>');
	for(var i=0;i<json.tabs.length;i++){
		$('#ntabSelect').append('<option value="'+json.tabs[i].name+'">'+json.tabs[i].name+'</option>');
	}
	for(var i=0;i<json.tabs.length;i++){
		$('#dltabSelect').append('<option value="'+i+'">'+json.tabs[i].name+'</option>');
	}
	setLinkList(0);
	for(var i=0;i<json.tabs.length;i++){
		$('#dtabSelect').append('<option value="'+i+'">'+json.tabs[i].name+'</option>');
	}
}

function setLinkList(index){
	console.log(index);
	$('#dlinkSelect').empty();
	for(var i=0;i<json.tabs[index].links.length;i++){
		$('#dlinkSelect').append('<option value="'+i+'">'+json.tabs[index].links[i].key+'</option>');
	}
}

function populateBookmarks(){
	$("#view").empty();
	for(var i=0;i<json.tabs.length;i++){
		if(json.tabs[i].parent==null){
			$("#view").append(
				'<div class="category" style="width:'+tabWidth+'%;">\
					<div class="linkcontent" id="'+i+'">\
						<div class="inset title">'+ json.tabs[i].name +'</div>\
					</div>\
				</div>'
			);
		}else{
			var j=0;
			for(j=0;j<json.tabs.length;j++){
				if(json.tabs[i].parent==json.tabs[j].name){
					break;
				}
			}
			$('#'+j).append(
				'<div class="linksubcontent" id="'+i+'">\
					<div class="inset subtitle">'+json.tabs[i].name+'</div>\
				</div>'
			);
		}
		appendLinks(json.tabs, i);
	}
}

function appendLinks(parnt, ind){
	for(var i=0;i<parnt[ind].links.length;i++){
		$('#'+ind).append(
			'<a href="'+parnt[ind].links[i].url+'"><div class="link outset" id="'+parnt[ind].links[i].key.replace(" ", "")+'">'+parnt[ind].links[i].key+'</div></a>'
		);
	}
}

function tabClick(evt, cityName) {
	var i, tabcontent, tablinks;
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
		tabcontent[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" active inset", " outset");
	}
	document.getElementById(cityName).style.display = "flex";
	evt.currentTarget.className += " active inset";
}