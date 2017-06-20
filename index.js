var topPackages = new Set();
var packageMap = new Object();
function search(s)
{
		var output = document.getElementById('gitList');
		var data={
      		'message' : s.value,
      		'published':false,
      	};
		var url='https://api.github.com/search/repositories?q='+s.value;
		$.ajax({
		url: url,
		type:"GET",
		data: JSON.stringify(data),
		contentType:"application/json",
		success: function(data) {
			console.log(data['items']);
            var body = document.getElementsByTagName('body')[0];
            body.removeChild(body.lastChild); // Remove last created serach result

            var mainBody = document.createElement('div');

            var tbl = document.createElement('table');
            tbl.style.width = '100%';
            tbl.setAttribute('border', '1');

            // Creating bar chart axis
            var x = new Array(10);
            var y = new Array(10);

            // Creting table header
            var header = tbl.createTHead();
            var hrow = header.insertRow(0);
            var hcell1 = hrow.insertCell(0);
            hcell1.innerHTML = "<b>Repository Name</b>";
            var hcell2 = hrow.insertCell(1);
            hcell2.innerHTML = "<b>Fork Count</b>";
            var hcell3 = hrow.insertCell(2);
            hcell3.innerHTML = "<b>Star Count</b>";
            var hcell4 = hrow.insertCell(3);
            hcell4.innerHTML = "<b>Import packages from this repository</b>";

            // Generating table rows
            var tbdy = document.createElement('tbody');
			for(var i=0;i<data['items'].length;i++)
    		{
                var tr = document.createElement('tr');
                var td1 = document.createElement('td');
                td1.appendChild(document.createTextNode(data['items'][i].full_name));
                var td2 = document.createElement('td');
                td2.appendChild(document.createTextNode(data['items'][i].forks_count));
                var td3 = document.createElement('td');
                td3.appendChild(document.createTextNode(data['items'][i].stargazers_count));
                var td4 = document.createElement('td');

                var contents_url = data['items'][i].contents_url;

                if(i < 10)
                {
                    x[i] = data['items'][i].full_name;
                    y[i] = data['items'][i].stargazers_count;
                }
    			/*var gitRepo = document.createElement("p");
    			var contents_url = data['items'][i].contents_url;
    			gitRepo.innerHTML = data['items'][i].full_name + " " + data['items'][i].forks_count + " " + data['items'][i].stargazers_count
    				+ " " + data['items'][i].contents_url;
    				// + " " + '<button id="but' + i +'" onclick="clickImport(contents_url)"> Import </button>';
    			*/
    			/*var btn = document.createElement("button");
    			btn.innerHTML = 'Import';
    			btn.setAttribute("id", 'btn'+i);
                btn.addEventListener("click", function(event){
    			clickImport(contents_url);
    			event.preventDefault();
    		});*/
                var card = document.createElement("input");
                card.type = "button";
                card.value = "Import";
                card.onclick = (function(contents_url) {
                    /*console.log(card.value);
                    clickImport(contents_url);*/
                    return function () {
                        clickImport(contents_url);
                    }
                })(contents_url);
                td4.appendChild(card);
                tr.appendChild(td1);
                tr.appendChild(td2);
                tr.appendChild(td3);
                tr.appendChild(td4);
    			/*output.appendChild(gitRepo);
				output.appendChild(btn);*/
                tbdy.appendChild(tr);
    		}
            tbl.appendChild(tbdy);
			mainBody.appendChild(tbl);
            // body.appendChild(tbl);
            var data = [
                {
                    x: x,
                    y: y,
                    type: 'bar'
                }
            ];

            var graph = document.createElement("div");
            Plotly.newPlot(graph, data);
            graph.setAttribute("align","center");
            mainBody.appendChild(graph);
            //body.appendChild(graph);
            body.appendChild(mainBody);
    		//document.body.appendChild(output);
		},
		error: function(data, e1, e2) {
			alert(" message error")
		}
	})
}


function clickImport(url)
{
	console.log("clicked with url: " + url);
	url=url.substring(0,url.length-7);
	$.ajax({
		url: url,
		type:"GET",
		contentType:"application/json",
		success: function(data) {
			// console.log("after clicking import " + url);
			var list=data.length;
			var flag=false;
			for(var i=0;i<list;i++)
			{
				if(data[i].name==="package.json")
				{

					flag=true;
					getDependencies(data[i].download_url);
				}
			}
			if(!flag)
				console.log("This project does not contain a valid package.json file");
			else
				console.log("Packages tracked");
		},
		error: function(data, e1, e2) {
		console.log(" message error")
		}
	})
}

function getDependencies(url)
{
	$.ajax({
		url: url,
		type:"GET",
		success: function(data) {
            var jsonData = JSON.parse(data);
            console.log(jsonData);
            // Adding Dependencies to the list
            var dep = jsonData.dependencies;
            if(typeof dep !== "undefined")
            {
                console.log(dep);
                var depSize = dep.length;
                console.log(depSize);
                for(var name in dep)
                {
                    if(name in packageMap) {
                        packageMap[name] = packageMap[name] + 1;
                    }
                    else{
                        packageMap[name] = 1;
                    }
                }
            }
            // Adding Dev-Dependencies to the list
            var devDep = jsonData.devDependencies;
            if(typeof devDep !== "undefined")
            {
                console.log(devDep);
                var devDepSize = devDep.length;
                console.log(devDepSize);
                for(var name in devDep)
                {
                    if(name in packageMap) {
                        packageMap[name] = packageMap[name] + 1;
                    }
                    else{
                        packageMap[name] = 1;
                    }
                }
            }
            console.log(packageMap);
		},
		error: function(data, e1, e2) {
		console.log(" message error")
		}
	})
}

function helper(req)
{
	console.log("inside helper");
	console.log(req);
	topPackages=req;
}
var cnt=0;
function getTopPackages()
{
	/*helper(topPackages);
	console.log("tops");
	console.log(topPackages);
	
	//document.getElementById("dispTop").innerHTML="check";
	//window.location="topPackages.html?";
	for (var it = topPackages.values() , val= null; val=it.next().value; ) {
		if(cnt<10){
    		document.getElementById("dispTop").innerHTML+=val;
    		cnt++;
            }
    }*/
    window.location="topPackages.html?";
    var sortable = [];
    for (var package in packageMap) {
        sortable.push([package, packageMap[package]]);
    }

    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    console.log(sortable);
    $('#myDiv').append("<ul id='newList'></ul>");
    for (cnt = 0; cnt < 10; cnt++) {
        $("#newList").append("<li>"+sortable[cnt]+"</li>");
    }

}