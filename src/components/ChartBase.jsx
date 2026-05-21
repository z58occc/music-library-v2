import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

function ChartBase({ type, data, options = {} }) {
  Chart.register(ChartDataLabels);
  const canvasRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    chartRef.current = new Chart(canvasRef.current, {
      type,
      data,
      options,
    });

    return () => {
      // 元件卸載時銷毀，防止記憶體洩漏
      chartRef.current?.destroy();
    };
  }, []);
  useEffect(() => {
    // 資料更新時重繪
    if (!chartRef.current) return;
    chartRef.current.data = data;
    chartRef.current.update();
  }, [data]);
  return (
    <>
      <canvas ref={canvasRef}></canvas>
    </>
  );
}

export default ChartBase;
