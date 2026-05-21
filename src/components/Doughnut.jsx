import ChartBase from "./ChartBase";

function Doughnut({ newData }) {
  let lpCost = 0;
  let cdCost = 0;
  let tapeCost = 0;
  newData.forEach((el) => {
    switch (el.format_id) {
      case 1:
        lpCost += el.price;
        break;
      case 2:
        cdCost += el.price;
        break;
      case 3:
        tapeCost += el.price;
        break;
      default:
        break;
    }
  });

  const data = {
    labels: ["黑膠", "唱片", "卡帶"], // 標籤
    datasets: [
      {
        label: "My Pie Chart", // 圖表標題
        data: [lpCost, cdCost, tapeCost], // 各區塊的數據
        backgroundColor: [
          // 設定每個區塊的顏色
          "rgba(255, 99, 132, 0.2)", // 紅色
          "rgba(54, 162, 235, 0.2)", // 藍色
          "rgba(255, 206, 86, 0.2)", // 黃色
        ],
        borderColor: [
          // 設定邊框顏色
          "rgba(255, 99, 132, 1)", // 紅色邊框
          "rgba(54, 162, 235, 1)", // 藍色邊框
          "rgba(255, 206, 86, 1)", // 黃色邊框
        ],
        borderWidth: 1, // 邊框寬度
      },
    ],
  };

  const options = {
    aspectRatio: 1.5,
    responsive: true, // 使圖表響應式
    plugins: {
      legend: {
        position: "top", // 圖例顯示位置
      },
      tooltip: {
        enabled: true, // 啟用工具提示
      },
      datalabels: {
        color: "#000", // 文字顏色
        font: {
          size: 16,
          weight: "bold",
        },
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          const cost = new Intl.NumberFormat("zh-TW", {
            style: "currency",
            currency: "TWD",
            minimumFractionDigits: 0,
          }).format(value);
          if (value === 0) return "";
          return `${label}\n${cost}`;
        },
      },
    },
  };


  return (
    <div className="w-50">
      <ChartBase type="doughnut" data={data} options={options} />
    </div>
  );
}
export default Doughnut;
