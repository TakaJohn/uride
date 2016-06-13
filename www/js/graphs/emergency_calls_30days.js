$(function(){
	$.getJSON(uniUrl, {action:"emergency_calls_30days"},function(data) {
		var emergency_calls_30days_date = [];
		var emergency_calls_30days_data = [];
		var i = 0;
		$.each(data, function(k, v) {
			emergency_calls_30days_date.push([i, v.date]);
			emergency_calls_30days_data.push([i, v.data]);
		});
		var emergency_calls_month = data;				
    }).fail(function() {
		console.log("Unable to load emergency calls 30 days.");
	});
	
	  //var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	  //var d1 = [];
	  		  
	  $("#emergency_calls_30days").length && $.plot($("#emergency_calls_30days"), [{
	          data: emergency_calls_30days_data
	      }], 
	      {
	        series: {
	            lines: {
	                show: true,
	                lineWidth: 2,
	                fill: true,
	                fillColor: {
	                    colors: [{
	                        opacity: 0.0
	                    }, {
	                        opacity: 0.2
	                    }]
	                }
	            },
	            points: {
	                radius: 5,
	                show: true
	            },
	            grow: {
	              active: true,
	              steps: 50
	            },
	            shadowSize: 2
	        },
	        grid: {
	            hoverable: true,
	            clickable: true,
	            tickColor: "#f0f0f0",
	            borderWidth: 1,
	            color: '#f0f0f0'
	        },
	        colors: ["#65bd77"],
	        xaxis:{
	        	ticks: emergency_calls_month_date
	        },
	        yaxis: {
	          ticks: 5
	        },
	        tooltip: true,
	        tooltipOpts: {
	          content: "%x.1 : %y.4",
	          defaultTheme: false,
	          shifts: {
	            x: 0,
	            y: 20
	          }
	        }
	      }
	  );
	
	
});