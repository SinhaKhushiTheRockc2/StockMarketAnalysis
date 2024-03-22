let myChart; // Declare myChart globally
let timeDataArry = [];
let priceArry = [];

document.addEventListener('DOMContentLoaded', () => {
  fetchData('aapl','1mo');
});

//Fetching Data for the Chart
async function getData() {
  try {
    let res = await fetch("https://stocks3.onrender.com/api/stocks/getstocksdata");
    let response = await res.json();
    return response;
  } catch (err) {
    console.error(err);
  }
}

//Function that will display the data of the chart
async function displayData(timePeriod, stockName) {
  try {
    const data = await getData();
    let stockData = data.stocksData.find(stock => stock[stockName.toUpperCase()]);
    if (!stockData) {
      console.error(`Data for ${stockName} not found.`);
      return;
    }

    let stock = stockData[stockName.toUpperCase()];
    console.log(stock);
    let oneMonths = stock[timePeriod].timeStamp;
    console.log(oneMonths);
    let price = stock[timePeriod].value;
    priceArry=[];
    timeDataArry=[];
    for (let p of price) {
      priceArry.push(p.toFixed(2));
    }

    for (let timeData of oneMonths) {
      let date = new Date(timeData * 1000).toLocaleDateString();
      timeDataArry.push(date);
    }

    // After fetching data, update the chart
    updateChart();
  } catch (err) {
    console.error(err);
  }
}

//Function for updating the chart on the screen
function updateChart() {
  const ctx = document.getElementById('myChart').getContext('2d');
  
  if (myChart) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: timeDataArry,
      datasets: [
        {
          data: priceArry,
          label: "Stock Pricing",
          backgroundColor: ["red", "blue", "green", "pink"],
          borderColor: ["black", "maroon", "teal"],
          borderWidth: 3,
        },
      ],
    },
    options: {
      responsive: false,
      plugins: {
        tooltip: {
          enabled: true,
          backgroundColor: "#0ef",
          titleColor: "black",
          bodyColor: "#254589",
        },
        title: {
          display: true,
          text: "Stock Pricing Chart",
          fontSize: 50,
          fontColor: "maroon",
        },
        legend: {
          display: true,
          position: "bottom",
        },
        animation: {
          duration: 8000,
        },
      },
    },
  });
}

//Function that makes the chart visible on the screen
async function fetchData(stockName,timePeriod) {
  displayData(timePeriod, stockName);
}

document.addEventListener('DOMContentLoaded',()=>{
  fetchStockStatsData();
});

//Function for fetching data for the list section
async function fetchStockStatsData() {
  try {
    let res = await fetch("https://stocks3.onrender.com/api/stocks/getstockstatsdata");
    let data = await res.json();
    displayStockStats(data.stocksStatsData);
  } catch (err) {
    console.error(err);
  }
}

const listContainerDiv=document.getElementById('list-container');
const oneMonth=document.getElementById('onemtn');
const threeMonth=document.getElementById('threemtn');
const oneYear=document.getElementById('oneYears');
const fiveYears=document.getElementById('fiveYears');
const stockArr=[];

//Function that displays the list on the screen
function displayStockStats(stocksStatsData) {
  stocksStatsData.forEach(stock => {
    for (let stockName in stock) {
      if (stock.hasOwnProperty(stockName)) {
        let stockData = stock[stockName];
        const listBtn=document.createElement('button');
        const bookValue=document.createElement('span');
        const profit=document.createElement('span');
        listBtn.textContent=stockName;
        const stockNameValue=stockName;
        bookValue.textContent=`$${stockData.bookValue}`;
        profit.textContent=`${stockData.profit.toFixed(2)}%`;
        const value=stockData.profit;
        if(value<=0){
          profit.style.color='red';
        }else{
          profit.style.color='green';
        }
        const listDiv=document.createElement('div');
        listDiv.appendChild(listBtn);
        listDiv.appendChild(bookValue);
        listDiv.appendChild(profit);
        listContainerDiv.appendChild(listDiv);
        listBtn.addEventListener('click',()=>fetchData(stockName,'1mo'));
        listBtn.addEventListener('click',()=>addSummary(stockData,stockNameValue));
      }
    }
  });
}

//Function for fetching the summary of each stock
async function fetchSummary() {
  try {
    let res = await fetch("https://stocks3.onrender.com/api/stocks/getstocksprofiledata");
    let data = await res.json();
    return data.stocksProfileData;
  } catch (err) {
    console.error(err);
  }
}

const stockNameSpan=document.getElementById('stockName');
const bookValueSpan=document.getElementById('bookValue');
const profitSpan=document.getElementById('profit');
const summaryPara=document.getElementById('summary');

//Adds the summary on the screen
async function addSummary(stockData,stockName){
  try {
    const data=await fetchSummary();
    console.log(stockName);
    stockNameSpan.textContent=stockName;
    bookValueSpan.textContent=`$${stockData.bookValue}`;
  profitSpan.textContent=`${stockData.profit}%`;
    data.forEach(stock => {
      for(let name in stock){
        if(stock.hasOwnProperty(name) &&name===stockName){
          const stockData=stock[name];
          summaryPara.textContent=stockData.summary;  
        }
      }
    });
    //Event listeners for each button present on the chart
    oneMonth.addEventListener('click',()=>changeChart(stockName,'1mo'));
    threeMonth.addEventListener('click',()=>changeChart(stockName,'3mo'));
    oneYear.addEventListener('click',()=>changeChart(stockName,'1y'));
    fiveYears.addEventListener('click',()=>changeChart(stockName,'5y'));
  } catch (error) {
    
  }
}

//Function for chaging the charts everytime any of the four buttons present on the chart is clicked based on the stock selected
function changeChart(stockName,time){
  fetchData(stockName,time);
}