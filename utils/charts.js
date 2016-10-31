/**
 * Created by trigkit4 on 2016/10/24.
 * type:pie饼图,bar柱状图
 * point:圆心坐标
 * radius:圆心半径
 */

var Charts = function (params) {
    var type = params.type,
        data = params.data,
        colors = params.colors,
        txt = params.txt || '',
        canvasId = params.canvasId,
        point = params.point || '',
        radius = params.radius,
        context = wx.createContext(),
        total = 0;
    for (var i = 0; i < data.length; i++) {
        total += data[i];//累加
    }
    //饼图
    if(type == 'pie'){
        for (var j = 0; j < data.length; j++) {
            context.beginPath();

            var start = 0;
            if (j > 0) {
                for (var k = 0; k < j; k++) {
                    start += data[k] / total * 2 * Math.PI;
                }
            }
            context.arc(point.x, point.y, radius, start, data[j] / total * 2 * Math.PI);

            context.lineTo(point.x, point.y);

            context.setFillStyle(colors[j]);

            context.fill();
            context.closePath();
        }

        wx.drawCanvas({
            canvasId: canvasId,
            actions: context.getActions()
        })
    }else if(type == "ring"){

        for (var a = 0; a < data.length; a++) {
            context.beginPath();
            //起点弧度
            var startRing = 0;
            if (a > 0) {
                for (var b = 0; b < a; b++) {
                    startRing += data[b] / total * 2 * Math.PI;
                }
            }

            context.arc(point.x, point.y, radius, startRing, data[a] / total * 2 * Math.PI);
            context.setLineWidth(radius/3);
            context.setStrokeStyle(colors[a]);
            context.stroke();
            context.closePath();
        }

        wx.drawCanvas({
            canvasId: canvasId,
            actions: context.getActions()
        })
    }
    //柱状图
    else if(type == 'bar'){
        var arr = params.data,
            showYAxis = params.showYAxis,
            colors = params.colors || "#fb999a",
            cHeight = params.cHeight || 300,//表格高度
            cWidth = params.cWidth || 500,//表格宽度
            bWidth = params.bWidth || 20,//每根柱状图宽度
            xCaption = params.xCaption || '', //x轴底部说明文字
            yCaption = params.yCaption || '', //y轴底部说明文字
            bMargin = params.bMargin || 16;//柱子间距

        var cxt  = wx.createContext();
        //chart property
        var cMargin, cSpace;
        var cMarginSpace, cMarginHeight;

        //single bar property
        var totalBars,maxValue;

        //bar animation
        var flag , t100,speed;

        //Y axis property
        var totLabelsOnYAxis;

        function chartSet() {

            // chart properties
            cMargin = -50;//图表与canvas边界距离
            cSpace = 50;
            if(showYAxis){
                cMargin = 10;
            }
            cMarginSpace = cMargin + cSpace;//0,y轴与左边文字距离
            cMarginHeight = 40*2 + cHeight;//canvas顶部距离
            // bar properties
            totalBars = arr.length;
            // find maximum value on chart
            maxValue = 0;
            for (var i = 0; i < totalBars; i++) {
                var arrVal = arr[i].split(",");
                var barVal = parseInt(arrVal[1]);
                if (parseInt(barVal) > parseInt(maxValue))
                    maxValue = barVal;//获取最大值
            }
            totLabelsOnYAxis = 10;
            // 初始化动画参数
            flag = 0;
            t100 = 100;
            speed = 10;
        }
        // draw chart axis, labels and markers
        function drawAxisLabelMarkers() {
            cxt.lineWidth = "1.0";
            // draw y axis
            drawAxis(cMarginSpace, cMarginHeight, cMarginSpace, cMargin);
            // draw x axis
            //x轴与y轴水平距离,x与y垂直距离，x轴宽度
            drawAxis(cMarginSpace, cMarginHeight, cMarginSpace + cWidth+20, cMarginHeight);
            cxt.lineWidth = "1.0";
            drawMarkers();
        }

        //画轴
        function drawAxis(x, y, X, Y) {
            cxt.beginPath();
            cxt.moveTo(x,y);
            cxt.lineTo(X,Y);
            cxt.setStrokeStyle("#cccccc");//x Axis and y Axis border color
            cxt.closePath();
            cxt.stroke();
        }

        // draw chart markers on X and Y Axis
        function drawMarkers() {
            var numMarkers = parseInt(maxValue / totLabelsOnYAxis);
            cxt.textAlign = "center";
            // Y Axis
            for (var a = 0; a <= totLabelsOnYAxis; a++) {
                var markerVal = a * numMarkers;
                var markerValHt = a * numMarkers * cHeight;
                var xMarkers = cMarginSpace - 25;//y轴数值与Y轴距离
                var yMarkers = cMarginHeight - (markerValHt / maxValue);
                cxt.fillText(markerVal, xMarkers, yMarkers);
            }
            // X Axis
            cxt.textAlign = 'center';
            for (var b = 0; b < totalBars; b++) {
                var arrVal = arr[b].split(",");
                var name = arrVal[0];
                var markerXPos = (cMarginSpace + bMargin)
                    + (b * (bWidth + bMargin)) + (bWidth/2) -10;
                var markerYPos = cMarginHeight + 20;//x轴数值与x轴距离
                cxt.fillText(name, markerXPos, markerYPos);//x轴底部文字
            }
            cxt.save();
            // Add Y Axis title
            cxt.translate(cMargin + 10, cHeight / 2);
            cxt.rotate(Math.PI * -90 / 180);
            cxt.fillText(yCaption, 0, 0);
            cxt.restore();
            // Add X Axis Title
            cxt.fillText(xCaption, cMarginSpace +
                (cWidth / 4), 20 );//底部文字与x轴距离
        }
        //动画
        function drawChartWithAnimation() {
            if (flag < t100) {
                flag = flag + 1;
                setTimeout(drawChartWithAnimation, speed);

            }
            for (var i = 0; i < totalBars; i++) {
                var arrVal = arr[i].split(",");
                var bVal = parseInt(arrVal[1]);//获取树状图数值
                var bHt = (bVal * cHeight / maxValue) /   flag;//bar height
                var bX = cMarginSpace + (i * (bWidth + bMargin)) + bMargin;
                var bY = cMarginHeight - bHt - 2;//cMarginHeight=> 380
                var textY = cMarginHeight - bHt-10;
                console.log( bHt );
                drawRectangle(bX, bY, bWidth, bHt);
                // draw(bX,bY,bWidth,maxValue-bHt);
                cxt.setFillStyle("#000000");//singer bar number color
                cxt.fillText(bVal,bX+4,textY);//singer bar number

            }

            // Loop through the total bars and draw

        }
        function drawRectangle(x, y, w, h) {
            cxt.beginPath();
            cxt.rect(x, y, w, h);
            cxt.setStrokeStyle("#ffffff");//single bar border color
            cxt.setFillStyle(colors);//single bar bgcolor
            cxt.stroke();
            cxt.fill();
            cxt.closePath();
        }
        chartSet();
        drawAxisLabelMarkers();
        drawChartWithAnimation();

        wx.drawCanvas({
            canvasId: canvasId,
            actions: cxt.getActions()
        });
    }
};
module.exports = Charts;
