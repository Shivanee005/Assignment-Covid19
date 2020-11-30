var input
Highcharts.data({
  googleSpreadsheetKey: '19VT6PiKjioPCQyowAeuXH0PMjMUw0zYXiGMNifTEcAU',

  parsed: function (columns) {

    var data = [];
    Highcharts.each(columns[0], function (code, i) {
      data.push({
        code: code.toUpperCase(),
        value: parseFloat(columns[2][i]),
        name: columns[1][i]
      });
    });

    Highcharts.mapChart('container', {
      chart: {
        map: 'custom/world',
        borderWidth: 1
      },

      colors: ['rgba(19,64,117,0.05)', 'rgba(19,64,117,0.2)', 'rgba(19,64,117,0.4)',
        'rgba(19,64,117,0.5)', 'rgba(19,64,117,0.6)', 'rgba(19,64,117,0.8)', 'rgba(19,64,117,1)'],

      title: {
        text: 'COVID 19 cases by country '
      },

      mapNavigation: {
        enabled: true
      },

      legend: {
        title: {
          text: 'Number of Infected Individuals',
          style: {
            color: ( // theme
              Highcharts.defaultOptions &&
              Highcharts.defaultOptions.legend &&
              Highcharts.defaultOptions.legend.title &&
              Highcharts.defaultOptions.legend.title.style &&
              Highcharts.defaultOptions.legend.title.style.color
            ) || 'black'
          }
        },
        align: 'left',
        verticalAlign: 'bottom',
        floating: true,
        layout: 'vertical',
        valueDecimals: 0,
        backgroundColor: ( // theme
          Highcharts.defaultOptions &&
          Highcharts.defaultOptions.legend &&
          Highcharts.defaultOptions.legend.backgroundColor
        ) || 'rgba(255, 255, 255, 0.85)',
        symbolRadius: 0,
        symbolHeight: 14
      },

      colorAxis: {
        dataClasses: [{
          to: 100
        }, {
          from: 100,
          to: 500
        }, {
          from: 500,
          to: 1000
        }, {
          from: 1000,
          to: 5000
        }, {
          from: 5000,
          to: 10000
        }, {
          from: 10000,
          to: 50000
        }, {
          from: 50000
        }]
      },
      
      plotOptions: {
            series: {
                events: {
                    click: function (e) {
                        input=e.point.name
                        
                        setButtonFunctions(input);
                        var text = e.point.name + ' (' + e.point.value + ')';
                        if (!this.chart.clickLabel) {
                            this.chart.clickLabel = this.chart.renderer.label(text, 0, 250)
                                .css({
                                    width: '100px'
                                })
                                .add();
                        } else {
                            this.chart.clickLabel.attr({
                                text: text
                            });
                        }
                    }
                }
            }
        },

      series: [{
        data: data,
        joinBy: ['iso-a3', 'code'],
        animation: true,
        name: 'People Infected',
        states: {
          hover: {
            color: '#a4edba'
          }
        },
        tooltip: {
          valueSuffix: ''
        },
        shadow: false
      }]
    });
  },
  error: function () {
    document.getElementById('container').innerHTML = '<div class="loading">' +
      '<i class="icon-frown icon-large"></i> ' +
      'Error loading data from Google Spreadsheets' +
      '</div>';
  }
});

// PART 2

const MY_API_KEY = '04efd303aamsh5849b12e0b8054bp192fe9jsne3151d6698b5';
let covid19data;

(function onLoad()
{
   
    setButtonFunctions(input);

           getLatestCOVID19Data();
})();

function setButtonFunctions(val)
{   
    var input1=val
    if (input1 == "United Arab Emirates") {
 input1 = "UAE";
}
  if (input1 == "United States of America") {
 input1 = "USA";
  }
    document.getElementById('countries').value=input1;
      function myFunction() {}
      document.getElementById('go').onclick = function() { 
        const selectedValue = document.getElementById('countries').value;
        const countryData = covid19data.filter(c => c.country == selectedValue)[0];
        

        const newConfirmed = document.getElementById('covidNewConfirmed');
        const totalConfirmed = document.getElementById('covidTotalConfirmed');
        const covidNewDeaths = document.getElementById('covidNewDeaths');
        const covidTotalDeaths = document.getElementById('covidTotalDeaths');
        const lastUpdated = document.getElementById('covidLastUpdate');

        (countryData.cases.new) ? newConfirmed.innerHTML = 'New confirmed cases: ' + countryData.cases.new : newConfirmed.innerHTML = 'New confirmed cases: 0';
        (countryData.cases.total) ? totalConfirmed.innerHTML = 'Total confirmed cases: ' + countryData.cases.total : totalConfirmed.innerHTML = 'Total confirmed cases: 0';
        (countryData.deaths.new) ? covidNewDeaths.innerHTML = 'New deaths: ' + countryData.deaths.new : covidNewDeaths.innerHTML = 'New deaths: 0';
        (countryData.deaths.total) ? covidTotalDeaths.innerHTML = 'Total deaths: ' + countryData.deaths.total : covidTotalDeaths.innerHTML = 'Total deaths: 0';
        lastUpdated.innerHTML = 'Last updated: ' + countryData.day;
    };

}
async function getLatestCOVID19Data()
{
    await fetch("https://covid-193.p.rapidapi.com/statistics", {
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "covid-193.p.rapidapi.com",
            "x-rapidapi-key": MY_API_KEY
        }
    })
    .then(response => response.json())
    .then(response => {
        

        // save covid data to global variable
        covid19data = response.response;
    })
    .catch(err => {
        console.log(err);
    });
}