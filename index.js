let topPackages = new Set();
function search(s)
{
		var output = document.getElementById('gitList');
		var data={
      		'message' : s.value,
      		'published':false,
      	};
		var url='https://api.github.com/search/repositories?q='+s.value+'+language:assembly&sort=stars&order=desc';
		$.ajax({
		url: url,
		type:"GET",
		data: JSON.stringify(data),
		contentType:"application/json",
		success: function(data) {
			console.log(data['items']);
			for(var i=0;i<data['items'].length;i++)
    		{
    			var gitRepo = document.createElement("p");
    			var contents_url = data['items'][i].contents_url;
    			gitRepo.innerHTML = data['items'][i].name + " " + data['items'][i].forks + " " + data['items'][i].stargazers_count 
    				+ " " + data['items'][i].contents_url;
    				// + " " + '<button id="but' + i +'" onclick="clickImport(contents_url)"> Import </button>';
    			
    			var btn = document.createElement("button");
    			btn.innerHTML = 'Import ' + i;
    			btn.setAttribute("id", 'btn'+i)
				btn.addEventListener("click", function(event){
    			console.log("clicked");
    			event.preventDefault();
    		});
    			output.appendChild(gitRepo);
				output.appendChild(btn);
    		}
    		document.body.appendChild(output);
		},
		error: function(data, e1, e2) {
			alert(" message error")
		}
	})
}


function clickImport(url)
{
	console.log("clicked");
	url=url.substring(0,url.length-7);
	$.ajax({
		url: url,
		type:"GET",
		contentType:"application/json",
		success: function(data) {
			// console.log("after clicking import" + url);
			// var list=data.length;
			// var flag=false;
			// for(var i=0;i<list;i++)
			// {
			// 	if(data[i].name==="package.json")
			// 	{
			// 		flag=true;
			// 		getDependencies(data[i].download_url);
			// 	}
			// }
			// if(!flag)
			// 	console.log("This project does not contain a valid package.json file");
			// else
			// 	console.log("Packages tracked");
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
		contentType:"application/json",    
		success: function(data) {

			for(var i=0;i<data.length;i++)
				topPackages.add(data['dependencies'][i]);
		},
		error: function(data, e1, e2) {
		console.log(" message error")

		}
	})
}

function goTop()
{
	window.location="topPackages.html?"+topPackages;
}