import { useEffect, useState } from "react";
import Doughnut from "../components/Doughnut";
import LineChart from "../components/LineChart";
import axios from "../utils/axios";

function ChartPage() {
  const [newData, setNewData] = useState([]);
  const url = `${import.meta.env.VITE_SUPABASE_URL}/albums`;
  const chartOptions = [
    { value: "donut", label: "類型-金額" },
    { value: "line", label: "月份-金額" },
  ];
  const [chartType, setChartType] = useState("donut");

  async function fetchPost() {
    try {
      const res = await axios.get(url, {
        params: {
          select: "*, singers(name), formats(name)", // 直接把 singers 表的 name 帶回來
        },
      });
      setNewData(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <>
      <div className="col-md-9 pt-3">
        <div className="d-flex">
          {chartType === "donut" && <Doughnut newData={newData} />}
          {chartType === "line" && <LineChart newData={newData} />}
          <div className="dropdown">
            <button
              className="btn btn-secondary dropdown-toggle"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              圖表類型
            </button>
            <ul
              className="dropdown-menu cursor-pointer"
              aria-labelledby="dropdownMenuButton1"
            >
              {chartOptions.map((el, i) => {
                return (
                  <li key={i}>
                    <span
                      className="dropdown-item"
                      onClick={() => setChartType(el.value)}
                    >
                      {el.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChartPage;
