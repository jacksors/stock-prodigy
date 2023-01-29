import Chart from "react-apexcharts";

const StockChart = (props) => {
  return (
    <Chart
      options={{
        chart: {
          id: "stock",
          background: "",
        },
        xaxis: {
          type: "datetime",
          min:
            props.stockHistory.at(-1).x > new Date("1 Jan 2010")
              ? props.stockHistory.at(-1).x.getTime()
              : new Date("1 Jan 2010").getTime(),
          max: new Date(),
        },
        theme: {
          mode: "dark",
        },
        yaxis: {
          labels: {
            formatter: function (value) {
              return value.toFixed(2);
            },
          },
        },
        fill: {
          type: "solid",
          colors: ["#F44336"],
        },
      }}
      series={[
        {
          name: "series-1",
          data: props.stockHistory,
        },
      ]}
      width="500"
      type={props.chartType}
    />
  );
};

export default StockChart;
