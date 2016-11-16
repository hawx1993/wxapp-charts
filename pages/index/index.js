/**
 * Created by trigkit4 on 2016/10/27.
 */
var Charts = require('./../../utils/charts');

Page({
    data: {
        charts: {
            area: ["上海,750","杭州,425","苏州,960","南京,700","广州,800","厦门,975","北京,375","沈阳,775","泉州,100","哈尔滨,200"],
            pieData: [10, 25, 35, 30]
        }
    },
    onReady:function(){

        var pieCharts = new Charts({
            type: "pie",
            data: this.data.charts.pieData,
            colors: ["#7158ec", "#fec312", "#1db2f4", "#ff3444"],
            canvasId: 'canvas1',
            point: {
                x: 100,
                y: 100
            },
            radius : 50
        });
        new Charts({
            type: "ring",
            data: [10, 25, 35, 30],
            colors: ["#7158ec", "#fec312", "#1db2f4", "#ff3444"],
            canvasId: 'canvas2',
            point: {
                x: 100,
                y: 100
            },
            radius : 50
        });

        new Charts({
            type: 'bar',
            data: this.data.charts.area,
            bgColors: "#46a2ef",
            color: '#383838',
            cHeight: 300,//表格高度
            cWidth: 500,//表格宽度
            bWidth: 22,//柱子宽度
            bMargin: 16,//柱子间距
            showYAxis: false,//是否显示Y轴
            xCaption: '已成交客户地域分布',
            yCaption: '地域成交数',
            canvasId: 'chartContainer'
        });
    }
});
