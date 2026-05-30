import { useEffect, useState } from "react";
import ChartBase from "./ChartBase";

function LineChart({ newData }) {
  const arr = Array.from({ length: 12 }, (_, i) => `${i + 1}月`);
  const [initData, setInitData] = useState({});
  useEffect(() => {
    const newArr = newData.map((el) => {
      return { ...el, released_at: new Date(el.released_at) };
    });
    const init = Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [i + 1, 0]),
    );
    const monthly = newArr.reduce((acc, item) => {
      console.log(item);
      const month = new Date(item.created_at).getMonth() + 1;

      acc[month] += item.price;
      return acc;
    }, init);

    setInitData(monthly);
  }, [newData]);

  const data = {
    labels: arr,
    datasets: [
      {
        label: "月份-總金額折線圖", // 圖表標題
        data: Object.values(initData), // 各區塊的數據
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
        formatter: (value) => {
          const cost = new Intl.NumberFormat("zh-TW", {
            style: "currency",
            currency: "TWD",
            minimumFractionDigits: 0,
          }).format(value);

          if (value === 0) return "";
          return `${cost}`;
        },
      },
    },
  };

  return (
    <div className="w-75">
      <ChartBase type="line" data={data} options={options} />
    </div>
  );
}
export default LineChart;
