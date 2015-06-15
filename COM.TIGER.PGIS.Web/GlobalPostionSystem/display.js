/// <reference path="../Resources/js/extjs4.2/ext-all-dev.js" />
/// <reference path="../Resources/js/Config.js" />
/// <reference path="../Resources/js/common.js" />
/// <reference path="../Resources/js/Utils.js" />
/// <reference path="../Resources/js/Param.js" />
/// <reference path="../Resources/js/maskLoad.js" />
/// <reference path="../Resources/js/qForm.js" />

//GPS警力分布和轨迹回放

var $gpsdisplay = $gpsdisplay || { isInit: false };

(function ($) {

    if ($.isInit)
        return true;

    $.model = { track: Ext.id("model") };
    Ext.define($.model.track, {
        extend: 'Ext.data.Model',
        fields: [
            { name: 'ID' },
            { name: 'DeviceID' },
            { name: 'OfficerNum' },
            { name: 'X' },
            { name: 'Y' },
            { name: 'CurrentTime' },
            { name: 'Device' }
        ]
    });
    
    var imgpath = $.imgpath = '../Resources/images/';
    $.basic_url = 'GlobalPostionSystem/GpsHandler.ashx?req=';
    $.resultcontainerid = 'extEast';

    $.DisplayDevice = function (track) {
        var defaults = {
            ID: 0, DeviceID: null, OfficerNum: null, X: 0, Y: 0, CurrentTime: null, Device: {
                ID: 0, DeviceID: null, OfficerID: null, BindTime: null, CarID: 0, CarNum: '', DType: 0
            }
        };
        Ext.apply(defaults, track);

        var point = ELatLng2EPoint({ Lat: defaults.X, Lng: defaults.Y });
        defaults.X = point.X;
        defaults.Y = point.Y;

        //在地图上显示定位信息
        var imgname = "policeman.png";
        if(defaults.Device && defaults.Device.DType == 2)
            imgname = "police.png";

        var html = String.Format('<div style="width:32px; text-align:center;"><img style="width:32px;height:32px;" src="{0}{1}"  title="{2}" alt="{2}" ></img></div>', imgpath, imgname, defaults.Device ? defaults.Device.OfficerID || defaults.Device.CarNum || defaults.Device.DeviceID : defaults.DeviceID);
        EMap.AppendEntity(String.Format('{0}', defaults.ID), { x: defaults.X, y: defaults.Y, exX: 16, exY: 16 }, {
            html: html, callback: $.TrackPointClick, args: {
                data: defaults
            }
        });

        return defaults;
    };

    $.TrackPointClick = function (track) {
        var defaults = {
            ID: 0, DeviceID: null, OfficerNum: null, X: 0, Y: 0, CurrentTime: null, Device: {
                ID: 0, DeviceID: null, OfficerID: null, BindTime: null, CarID: 0, CarNum: '', DType: 0
            }
        };
        Ext.apply(defaults, track.data);
        var point = EPoint2ELatLng({ X: defaults.X, Y: defaults.Y });
        defaults.X = point.Lat;
        defaults.Y = point.Lng;

        var imgname = 'policeman.png';
        if (defaults.Device && defaults.Device.DType == 2) {
            imgname = 'police.png';
        }

        var html = '<table style="margin-left:15px;">';
        html += '<tr style="height:22px;line-height:22px;"><td></td><td></td></tr>';
        html += Ext.util.Format.format('<tr style="height:18px;line-height:18px;"><td>设备号：</td><td>{0}</td></tr>', defaults.DeviceID || '暂无');
        html += Ext.util.Format.format('<tr style="height:18px;line-height:18px;"><td>警员号：</td><td>{0}</td></tr>', defaults.OfficerNum || '暂无');
        html += Ext.util.Format.format('<tr style="height:18px;line-height:18px;"><td>车牌号：</td><td>{0}</td></tr>', defaults.Device && defaults.Device.Number ? defaults.Device.CarNum : '暂无');
        html += Ext.util.Format.format('<tr style="height:18px;line-height:18px;"><td>经度：</td><td>{0}</td></tr>', defaults.X);
        html += Ext.util.Format.format('<tr style="height:18px;line-height:18px;"><td>维度：</td><td>{0}</td></tr>', defaults.Y);
        html += '</table>';

        var panel = {
            layout: 'border',
            border: 0,
            items: [{
                region: 'west',
                width: 100,
                border: 0,
                html: Ext.util.Format.format('<div style="height:100px; margin:5px auto; text-align:center;"><img style="width:100%;height:100%;" src="{0}{1}" ></div>', imgpath, imgname)
            }, {
                region: 'center',
                border: 0,
                layout: 'fit',
                html: html
            }]
        };
        var wind = ExtHelper.CreateWindow({
            title: 'GPS 单兵设备绑定和位置信息',
            layout: 'fit',
            width: 320,
            height: 180,
            resizable: false
        });
        wind.add(panel);
    };

    $.locate = function (val) {
        var defaults = {
            ID: 0, DeviceID: null, OfficerNum: null, X: 0, Y: 0, CurrentTime: null, Device: {
                ID: 0, DeviceID: null, OfficerID: null, BindTime: null, CarID: 0, CarNum: '', DType: 0
            }
        };

        var track = Object.$DecodeObj(val);
        //var point = ELatLng2EPoint({ Lat: track.X, Lng: track.Y });
        //track.X = point.X;
        //track.Y = point.Y;

        var val = $.DisplayDevice(track);
        EMap.MoveTo(val.X, val.Y);
    };

    $.ShowResultPanel = function (component) {
        var c = Ext.getCmp($.resultcontainerid);
        c.removeAll(true);
        c.add(component);
        if (c.collapsed) {
            c.expand();
        }
    };

    $.Grid = function (options) {
        var defaults = {
            req: null,
            params: {},
            pager: false,
            loaded: Ext.emptyFn,
            getCoords:Ext.emptyFn,
            model: null,
            columns: [],
            toolbar:null
        };
        Ext.apply(defaults, options);

        var store = ExtHelper.CreateStore({
            storeId: Ext.id(),
            model: defaults.model,
            url: Ext.util.Format.format("{0}{1}", $gpsdisplay.basic_url, defaults.req),
            total: defaults.pager,
            params:defaults.params,
            listeners: {
                'load': function (s, records, successful, eOpts) {
                    var coords = [];
                    Ext.Array.each(records, function (record, index, arr) {
                        var dat = record.getData();
                        var point = ELatLng2EPoint({ Lat: dat.X, Lng: dat.Y });
                        dat.X = point.X;
                        dat.Y = point.Y;
                        
                        defaults.loaded(dat);
                        coords.push(dat.X);
                        coords.push(dat.Y);
                    });
                    //在此调用绘制图线接口
                    defaults.getCoords(coords, records);
                }
            }
        });

        var grid = ExtHelper.CreateGridNoCheckbox({
            store: store,
            columns: defaults.columns,
            pager: defaults.pager,
            toolbar: defaults.toolbar
        });
        
        return grid;
    };

    return true;

})($gpsdisplay);

(function ($) {

    if ($.isInit)
        return true;

    $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'DeviceID', text: '设备编号', flex: 1, sortable: false, hidden: false },
        {
            dataIndex: 'ID', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                var dat = c.getData();
                var val = Object.$EncodeObj(dat);
                return Ext.util.Format.format('<span class="a" onclick="{0}(\'{1}\')">定位</span>', '$gpsdisplay.locate', val);
            }
        }
    ];

    $.interval = 0;
    $.form = qForm.getQueryForm(qForm.qFormType.gpsLocation, function (form, button) {
        var items = form.items.items;
        var params = {};
        var cp = items[0];
        params.TimeInterval = cp.value;

        var tipstart = '开始获取实时分布数据';
        var tipstop = '停止获取实时分布数据';

        if ($.interval) {
            clearInterval($.interval);
            $.interval = 0;
        }
        
        if (button.text == tipstart) {
            $gpsdisplay.ShowResultPanel($gpsdisplay.Grid({
                req: 'currentpts',
                params: params,
                loaded: $gpsdisplay.DisplayDevice,
                model: $gpsdisplay.model.track,
                columns: $.columns
            }));
            
            $.interval = setInterval(function () {
                $gpsdisplay.ShowResultPanel($gpsdisplay.Grid({
                    req: 'currentpts',
                    params: params,
                    loaded: $gpsdisplay.DisplayDevice,
                    model: $gpsdisplay.model.track,
                    columns: $.columns
                }));
            }, params.TimeInterval * 1000);

            button.setText(tipstop);
            cp.setDisabled(true);
            
            errorState.show("GPS 单兵作战程序已经开始...");
        } else {
            cp.setDisabled(false);
            button.setText(tipstart);

            errorState.show("GPS 单兵作战程序已经停止...");
        }
        
    });
    $.getForm = function () {
        return qForm.getQueryForm(qForm.qFormType.gpsLocation, function (form, button) {
            var items = form.items.items;
            var params = {};
            var cp = items[0];
            params.TimeInterval = cp.value;

            var tipstart = '开始获取实时分布数据';
            var tipstop = '停止获取实时分布数据';

            if ($.interval) {
                clearInterval($.interval);
                $.interval = 0;
            }

            if (button.text == tipstart) {
                $gpsdisplay.ShowResultPanel($gpsdisplay.Grid({
                    req: 'currentpts',
                    params: params,
                    loaded: $gpsdisplay.DisplayDevice,
                    model: $gpsdisplay.model.track,
                    columns: $.columns
                }));

                $.interval = setInterval(function () {
                    $gpsdisplay.ShowResultPanel($gpsdisplay.Grid({
                        req: 'currentpts',
                        params: params,
                        loaded: $gpsdisplay.DisplayDevice,
                        model: $gpsdisplay.model.track,
                        columns: $.columns
                    }));
                }, params.TimeInterval * 1000);

                button.setText(tipstop);
                cp.setDisabled(true);

                errorState.show("GPS 单兵作战程序已经开始...");
            } else {
                cp.setDisabled(false);
                button.setText(tipstart);

                errorState.show("GPS 单兵作战程序已经停止...");
            }

        });
    };

    return $.isInit = true;;

})($gpsdisplay.location = $gpsdisplay.location || { isInit: false });

(function ($) {

    if ($.isInit)
        return true;

    var mCoords = [];
    var mRecords = [];
    var lineColor = "ff0000";
    var isAnimate = false;
    var completedAnimateCallback = function (coords, records) {
        if (records.length > 0) {
            EMap.Clear();
            var dat = records[0].getData();

            //绘制图线
            EMap.DrawLine(Ext.util.Format.format("gpstrakline-{0}", dat.ID), { coords: coords, color: lineColor });

            for (var i = 0; i < records.length; i++) {
                dat = records[i].getData();
                dat.ID = dat.ID + "_" + i;

                $gpsdisplay.DisplayDevice(dat);
            }
        }
    };

    $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'CurrentTime', text: '经过时间', flex: 1, sortable: false, hidden: false },
        {
            dataIndex: 'ID', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                var dat = c.getData();
                var val = Object.$EncodeObj(dat);
                return Ext.util.Format.format('<span class="a" onclick="{0}(\'{1}\')">定位</span>', '$gpsdisplay.locate', val);
            }
        }
    ];

    //移动，并绘制轨迹
    $.trakline = function (coords, records) {
        //绘制移动实体
        function drawTrackEntity(dat, x, y) {
            var defaults = {
                ID: 0, DeviceID: null, OfficerNum: null, CurrentTime: null, Device: {
                    ID: 0, DeviceID: null, OfficerID: null, BindTime: null, CarID: 0, CarNum: '', DType: 0
                }
            };
            Ext.apply(defaults, dat);

            var imgname = "policeman.png";
            if (defaults.Device && defaults.Device.DType == 2)
                imgname = "police.png";

            var html = String.Format('<div style="width:32px; text-align:center;"><img style="width:32px;height:32px;" src="{0}{1}"  title="{2}" ></img></div>', $gpsdisplay.imgpath, imgname, defaults.Device ? defaults.Device.OfficerID || defaults.Device.CarNum || defaults.Device.DeviceID : defaults.DeviceID);
            EMap.AppendEntity(String.Format('trackmove-{0}', defaults.ID), { x: x, y: y, exX: 16, exY: 16 }, {
                html: html, callback: $gpsdisplay.TrackPointClick, args: {
                    data: defaults
                }
            });
        };

        coords = [].concat(coords).reverse();
        if (coords.length < 4)
            return 0;

        var dat = records[0].getData();//数据正文
        var speed = 100;//单位时间内指定方向移动的距离
        var startx = coords.pop();//起点x
        var starty = coords.pop();//起点y
        var endx = coords.pop();//终点x
        var endy = coords.pop();//终点y
        var offsetx = 0;//每单位时间内x方向移动的距离
        var offsety = 0;//每单位时间内y方向移动的距离
        var nextx = 0;//下一个坐标x
        var nexty = 0;//下一个坐标y
        var vectorx = true;//x轴方向。0：反方向；1：同方向
        var vectory = true;//y轴方向。0：反方向；1：同方向
        var lengthx = 0;//起点和终点x轴相对偏移量
        var lengthy = 0;//起点和终点y轴相对偏移量
        var buffer = [startx, starty];

        //绘制起始点
        drawTrackEntity(dat, startx, starty);
        var interval = setInterval(function () {
                       
            if (isAnimate) {
                lengthx = endx - startx;
                lengthy = endy - starty;

                //计算X轴方向
                vectorx = lengthx >= 0;
                vectory = lengthy >= 0;
                //设定单位时间内X轴方向移动的距离
                offsetx = speed;
                offsety = Math.abs(lengthy) * offsetx / Math.abs(lengthx);

                if (offsetx < Math.abs(lengthx) && offsety < Math.abs(lengthy)) {

                    if (vectorx) {
                        nextx = startx + offsetx;
                    } else {
                        nextx = startx - offsetx;
                    }
                    if (vectory) {
                        nexty = starty + offsety;
                    } else {
                        nexty = starty - offsety;
                    }
                } else {
                    nextx = endx;
                    nexty = endy;
                }

                buffer.push(nextx);
                buffer.push(nexty);
                //绘制图线
                EMap.DrawLine(
                    Ext.util.Format.format("gpstrakline-{0}", dat.ID),
                    {
                        coords: buffer,
                        color: lineColor
                    });
                //实体发生移动
                drawTrackEntity(dat, nextx, nexty);
                //从新设定起始点
                startx = nextx;
                starty = nexty;

                //校验当前节点尚未执行完成
                if (startx != endx)
                    return 0;
                //校验当前节点尚未执行完成
                if (starty != endy)
                    return 0;

                //校验是否存在下一个节点
                if (startx == endx && starty == endy && coords.length != 0 && 0 < coords.length / 2) {

                    endx = coords.pop();
                    endy = coords.pop();

                    return 0;
                }
            }

            //此处清理内存
            clearInterval(interval);
            delete buffer;
            delete coords;
            delete drawTrackEntity;
            delete dat;
            delete speed;
            delete startx;
            delete starty;
            delete endx;
            delete endy;
            delete nextx;
            delete nexty;
            delete offsetx;
            delete offsety;
            delete lengthx;
            delete lengthy;
            delete vectorx;
            delete vectory;

            isAnimate = false;
            completedAnimateCallback(mCoords, mRecords);
            return 0;

        }, 100);
    };

    $.getForm = function () {
        return qForm.getQueryForm(qForm.qFormType.gpsTrack, function (form) {
            var items = form.items.items;
            var params = {};
            for (var i = 0; i < items.length; i++) {
                var cp = items[i];
                params[cp.name] = cp.value;
            }

            $gpsdisplay.ShowResultPanel($gpsdisplay.Grid({
                req: 'historypts',
                params: params,
                //loaded: $gpsdisplay.DisplayDevice,
                toolbar: {
                    enable: true,
                    items: [{
                        xtype: 'button',
                        text: '开始动画',
                        iconCls: 'animate_play',
                        handler: function () {
                            if (isAnimate) {
                                errorState.show("正在执行，请稍等 ...");
                                return 0;
                            }

                            EMap.Clear();
                            isAnimate = true;
                            $.trakline(mCoords, mRecords);
                        }
                    }, {
                        xtype: 'button',
                        text: '停止动画',
                        iconCls: 'animate_stop',
                        handler: function () {
                            if (!isAnimate) {
                                errorState.show("请先开始动画!");
                            }
                            isAnimate = false;
                            return 0;
                        }
                    }]
                },
                getCoords: function (coords, records) {
                    mCoords = coords;
                    mRecords = records;
                    completedAnimateCallback(coords, records);
                },
                model: $gpsdisplay.model.track,
                columns: $.columns
            }));
        });
    };

    $.form = $.getForm();

    return $.isInit = true;;

})($gpsdisplay.track = $gpsdisplay.track || { isInit: false });

(function ($) {

    if ($.isInit)
        return true;

    $.columns = [
        { xtype: 'rownumberer', width: 25, sortable: false, hidden: false, renderer: function (a, b, c, d) { return d + 1; } },
        { dataIndex: 'DeviceID', text: '设备编号', flex: 1, sortable: false, hidden: false },
        {
            dataIndex: 'ID', width: 45, sortable: false, hidden: false, renderer: function (a, b, c) {
                var dat = c.getData();
                var val = Object.$EncodeObj(dat);
                return Ext.util.Format.format('<span class="a" onclick="{0}(\'{1}\')">定位</span>', '$gpsdisplay.locate', val);
            }
        }
    ];

    $.form = qForm.getQueryForm(qForm.qFormType.panelQuery, function (coords) {
        //将2.5D地图坐标转换成GPS坐标

        var point = null;
        for (var i = 0; i < coords.length - 1; i += 2) {
            point = EPoint2ELatLng({ X: coords[i], Y: coords[i + 1] });
            coords[i] = point.Lat;
            coords[i + 1] = point.Lng;
        }
        delete point;
        delete i;

        EMap.Clear();
        $gpsdisplay.ShowResultPanel($gpsdisplay.Grid({
            req: 'qcoords',
            params: { coords: coords },
            loaded: $gpsdisplay.DisplayDevice,
            model: $gpsdisplay.model.track,
            columns: $.columns
        }));
    });
    $.getForm = function () {
        return qForm.getQueryForm(qForm.qFormType.panelQuery, function (coords) {
            //将2.5D地图坐标转换成GPS坐标

            var point = null;
            for (var i = 0; i < coords.length - 1; i += 2) {
                point = EPoint2ELatLng({ X: coords[i], Y: coords[i + 1] });
                coords[i] = point.Lat;
                coords[i + 1] = point.Lng;
            }
            delete point;
            delete i;

            EMap.Clear();
            $gpsdisplay.ShowResultPanel($gpsdisplay.Grid({
                req: 'qcoords',
                params: { coords: coords },
                loaded: $gpsdisplay.DisplayDevice,
                model: $gpsdisplay.model.track,
                columns: $.columns
            }));
        });
    };

    $.Grid = function (options) { };

    return $.isInit = true;;

})($gpsdisplay.kx = $gpsdisplay.kx || { isInit: false });