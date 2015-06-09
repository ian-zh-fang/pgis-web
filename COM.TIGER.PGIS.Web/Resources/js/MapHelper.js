
/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="maptheme.js" />
/// <reference path="maskLoad.js" />
/// <reference path="Buildings/buildingQuery.js" />

var vM, vMe;
var _BuildingPopLayer;
var _PolyLayer;
var _Layer = [];
//图层绘制函数注册表
//每一个图层的绘制函数都应该在此注册
var _LayerDrawFunctionRegister = [];
//当前选中标注提示框ID值
var _ActiveMarkLableID = undefined;

//基于观察者模式，设定全局处理程序，用于统一地图事件回调
var _GetCoording = function (coords, eOpts) {
    ///<summary>
    /// 获取当前坐标点位置回调函数
    ///<para>每获取一个位置都将触发此回调函数</para>
    ///</summary>
    ///<param name="coords" type="Array">当前位置坐标</param>
    ///<param name="eOpts" type="Object">
    /// 回调方法参数
    ///<para>emap:EMap 当前地图对象操作函数</para>
    ///<para>args:Object 自定义参数</para>
    ///</param>
};
var _GetCoorded = function (coords, eOpts) {
    ///<summary>
    /// 获取位置坐标点动作结束回调函数
    ///<para>任何一次停止获取位置坐标都将触发此回调函数</para>
    ///</summary>
    ///<param name="coords" type="Array">当前位置坐标</param>
    ///<param name="eOpts" type="Object">
    /// 回调方法参数
    ///<para>emap:EMap 当前地图对象操作函数</para>
    ///<para>args:Object 自定义参数</para>
    ///</param>
};
var _PanelQueryCallback = function (x1, y1, x2, y2, flg) {
    ///<summary>
    /// 矩形框选查询回调函数
    ///</summary>
    ///<param name="x1" type="Number">左上角横坐标</param>
    ///<param name="y1" type="Number">左上角纵坐标</param>
    ///<param name="x2" type="Number">右下角横坐标</param>
    ///<param name="y2" type="Number">右下角纵坐标</param>
    ///<param name="flg" type=""></param>
};
//不规则多边形各顶点座标组
var _PolyQueryCoords = [];
var _PolyQueryCallback = function (coords) {
    ///<summary>
    /// 多边形框选查询回调函数
    ///</summary>
    ///<param name="coords" type="Array">所有的坐标信息</param>
}
var _Draw = function (eOpts) {
    ///<summary>
    /// 用于地图绘制图形回调函数
    ///<para>每一次绘制图层都将回调该函数</para>
    ///</summary>
    ///<param name="eOpts" type="Object">
    /// 回调方法参数
    ///<para>emap:EMap 当前地图对象操作函数</para>
    ///<para>args:Object 自定义参数</para>
    ///</param>
    
    var fn;
    for (var i in _LayerDrawFunctionRegister) {
        fn = _LayerDrawFunctionRegister[i].draw;
        if (fn && fn instanceof Function) {
            fn();
        }
    }
};
var _MapZoomChanged = function (z) {
    ///<summary>
    /// 用户地图缩放回调函数
    ///<para>对地图进行任何的缩放操作，都将回调此函数</para>
    ///</summary>
    ///<paran name="z" type="Number">地图缩放级别</param>

    if (!vM || !vMe) return false;
    //已经创建地图
    if (vM.Zoom() < 4) {
        vMe.Zoom(vM.Zoom());
    }
    if (_Draw && _Draw instanceof Function) {
        _Draw({
            emap: EMap,
            args: null
        });
    }

    _MapthemeCallback();
};
var _MapRepaint = function () {
    ///<summary>
    /// 地图重绘回调函数
    ///<para>对地图任何的重绘都将回调此函数</para>
    ///</summary>
    if (_Draw && _Draw instanceof Function) {
        _Draw({ emap: EMap, args: null });
    }
};
//@ 主题地图回调函数
var _MapthemeCallback = function () {

    if (vM.Zoom() > 2) {
        return false;
    }

    if (typeof $maptheme === 'undefined')
        return false;

    if (!$maptheme)
        return false;

    EMap.Clear();
    //在此处获取主题地图信息
    $maptheme.Generator().Load();
};

function CreateMap() {
    ///<summary>
    /// 实例化地图，并注册地图祥光回调函数
    ///</summary>

    //debugger;
    vM = vEdushiMap;
    vMe = veyeEdushiMap;

    vM.LoadControl("InfoWindow", function () { });

    //vM.LoadPlug("SogouMap", function () { });
    //地图缩放
    vM.detachEvent(AlaMap.KeyWord.EventName.MapZoomChange, _MapZoomChanged);
    vM.attachEvent(AlaMap.KeyWord.EventName.MapZoomChange, _MapZoomChanged);
    //地图重绘
    vM.detachEvent(AlaMap.KeyWord.EventName.Repaint, _MapRepaint);
    vM.attachEvent(AlaMap.KeyWord.EventName.Repaint, _MapRepaint);
    //地图鹰眼联动
    vMe.attachEvent(AlaMap.KeyWord.EventName.MapMoveEnd, function (x, y, flg) {
        if (flg == 0) { vM.MoveTo(x, y, true); }
    });
    //地图移动
    vM.attachEvent(AlaMap.KeyWord.EventName.MapMoveEnd, function (x, y, flg) {
        
        if (flg == 0) { vMe.MoveTo(x, y, true); }
        
        _MapthemeCallback();
    });
    //楼房热区点击
    vM.attachEvent(AlaMap.KeyWord.EventName.SpotClick, function (spot) {
        EMap.ShowBuildingPop(spot);
    });
    //测距
    vM.attachEvent(AlaMap.KeyWord.EventName.ScaleEnd, function (distance, flg) {

        Ext.Msg.alert("通知", "测距操作结束，总距离为：" + parseFloat(distance).toFixed(2) + " 米。");

    });
    //获取当前位置坐标
    vM.attachEvent(AlaMap.KeyWord.EventName.GetCoordsIng, function (coords) {
        if (_GetCoording && _GetCoording instanceof Function) {
            _GetCoording(coords, { emap: EMap });
        }
    });
    //停止获取位置坐标动作
    vM.attachEvent(AlaMap.KeyWord.EventName.GetCoordsEnd, function (coords) {
        if (_GetCoorded && _GetCoorded instanceof Function) {
            _GetCoorded(coords, { emap: EMap });
        }
    });
    //矩形框选回调事件
    vM.attachEvent(AlaMap.KeyWord.EventName.PaneEnd, function (x1, y1, x2, y2, flg) {
        _PanelQueryCallback(x1, y1, x2, y2, flg);
    });
};
//地图控制对象
var EMap = {
    vmap/*当前地图对象*/: vM,
    ShowBuildingPop: function (spot) {
        var defaults = { ID: null, Name: null, Cx:0, Cy:0 };
        Ext.apply(defaults, spot);

        //var content = "<div style='margin-top:20px'>名称：<span class='a' title='点击查看详细信息' >" + defaults.Name + "</span></div>";
        //vM.InfoWindow.Open(content, defaults.Cx, defaults.Cy);
        var mask = maskGenerate.start({msg:'正在获取数据，请稍等 ...'});
        Object.$Get({
            url: 'Buildings/BuildingHelp.ashx?req=getbd',
            params: { ids: defaults.ID },
            callback: function (options, success, response) {
                mask.stop();
                if (!success)
                    return errorState.show(errorState.LoadError);

                var items =[].concat(Ext.JSON.decode(response.responseText));
                if (items.length > 0)
                {
                    loadBuildingDetail(function () {
                        buildingQuery.ShowDetail(items[0]);
                    });
                }
            }
        });

        function loadBuildingDetail(c) {

            if (typeof buildingQuery !== 'undefined' && c instanceof Function) {
                return c();
            }

            LoadModlues.loadJS(typeof $bunit, 'Buildings/buildingQuery.js', function () {
                c();
            });
        }
    },
    ViewSpotAreas: function (s) {
        vM.ViewSpotAreas(s);
    },
    EyeMap: function (v) {
        var eyePanel = Ext.getCmp("eyePanelID");
        if (!eyePanel.hidden) {
            eyePanel.hide();
        } else {
            eyePanel.show();
        }
    },
    ChangeLayer: function () {
        var to3d = Ext.getElementById("3d");
        var towx = Ext.getElementById("wx");
        var to2d = Ext.getElementById("2d");

        to3d.onclick = function () {
            this.style.backgroundImage = 'url(Resources/images/1-1.gif)';
            towx.style.backgroundImage = 'url(Resources/images/2.gif)';
            to2d.style.backgroundImage = 'url(Resources/images/3.gif)';

            vM.ViewSystemMapLayer(true, 'MapPicLayer');
            vM.ViewSystemMapLayer(false, 'RoadPicLayer');
            vM.ViewSystemMapLayer(false, '2DPicLayer');
            EMap.ViewSpotAreas(true);
        };
        towx.onclick = function () {
            to3d.style.backgroundImage = 'url(Resources/images/1.gif)';
            this.style.backgroundImage = 'url(Resources/images/2-1.gif)';
            to2d.style.backgroundImage = 'url(Resources/images/3.gif)';

            vM.ViewSystemMapLayer(false, 'MapPicLayer');
            vM.ViewSystemMapLayer(true, 'RoadPicLayer');
            vM.ViewSystemMapLayer(false, '2DPicLayer');
            EMap.ViewSpotAreas(false);
        };
        to2d.onclick = function () {
            to3d.style.backgroundImage = 'url(Resources/images/1.gif)';
            towx.style.backgroundImage = 'url(Resources/images/2.gif)';
            this.style.backgroundImage = 'url(Resources/images/3-1.gif)';

            vM.ViewSystemMapLayer(false, 'MapPicLayer');
            vM.ViewSystemMapLayer(false, 'RoadPicLayer');
            vM.ViewSystemMapLayer(true, '2DPicLayer');
            EMap.ViewSpotAreas(false);
        };

    },
    ViewLabel: function (v) {
        var z = vM.Zoom();
        if (!vM.Property.VisibleSpotLabels['hotarea'] && z > 1) {
            vM.ZoomTo(1);
        }
        vM.ViewSpotLabels(!vM.Property.VisibleSpotLabels['hotarea'], 'hotarea');
    },
    Scale: function () {
        vM.StartScale();
    },
    ZoomIn: function () {
        //debugger;
        var z = vM.Zoom();
        if (z < 4) {
            vM.ZoomTo(z + 1);
        }
    },
    ZoomOut: function () {
        //debugger;
        var z = vM.Zoom();
        if (z > 0) {
            vM.ZoomTo(z - 1);
        }
    },
    FullMap: function () {
        vM.FlatZoom(4);
    },
    GetCoords: function (options) {
        ///<summary>
        /// 获取二维平面位置坐标
        ///</summary>
        ///<param name="options" type="Object">
        /// 自定义参数
        ///<para>coording:Function 获取二位平面当前位置坐标，回调函数</para>
        ///<para>coorded:Function 获取二维平面位置坐标动作停止，回调函数</para>
        ///<para>args:Object 自定义参数</para>
        ///</param>

        var me = this;
        _GetCoording = function (coords, eOpts) {
            var coording = options.coording;
            eOpts.args = options.args || null;
            if (coording && coording instanceof Function) {
                coording(coords, eOpts);
            }
        };
        _GetCoorded = function (coords, eOpts) {
            var coorded = options.coorded;
            eOpts.args = options.args || null;
            if (coorded && coorded instanceof Function) {
                coorded(coords, eOpts);
            }
        };
        me.StartCoords();
    },
    GetSingleCoords: function (options) {
        ///<summary>
        /// 获取二维平面坐标系中单点座标
        ///</summary>
        ///<param name="options" type="Object">
        /// 自定义参数
        ///<para>callback:Function 每获取一个座标都将回调此函数</para>
        ///<para>args:Object 自定义参数</para>
        ///</param>

        var me = this;
        me.GetCoords({
            coording: function () {
                me.StopCoords();
            },
            coorded: function (coords, eOpts) {
                var cb = options.callback;
                if (cb && cb instanceof Function) {
                    cb(coords, eOpts);
                }
            },
            args: options.args || {}
        });
    },
    StopCoords: function () {
        ///<summary>
        /// 强制停止获取坐标动作
        ///</summary>

        var me = this;
        vM.StopGetCoords();
    },
    StartCoords: function (options) {
        ///<summary>
        /// 开始取点操作，并设定提示信息
        ///</summary>
        ///<param name="options" type="Object">
        /// 自定义参数
        ///<para>tip:String 提示信息</para>
        ///</param>

        var me = this;
        var defaultmsg = '左键取点，右键撤销，双击结束。';
        options = options || {};
        var tip = options.tip || defaultmsg;
        if ('string' != typeof tip) {
            tip = defaultmsg;
        }
        vM.TipGetCoords = tip;
        vM.StartGetCoords();
    },
    PanelQuery: function (options) {
        ///<summary>
        /// 开始矩形框选操作
        ///</summary>
        ///<param name="options" type="Object">
        /// 自定义参数
        ///<para>callback:Function 回调函数</para>
        ///</param>
        var defaults = { callback: null };
        Ext.apply(defaults, options);

        _PanelQueryCallback = function (x1, y1, x2, y2, flg) {
            if (defaults.callback && defaults.callback instanceof Function) {
                var coords = [];
                coords.push(x1);
                coords.push(y1);
                coords.push(x2);
                coords.push(y2);
                defaults.callback(coords, flg);
            }
        };
        vM.StartPane();
    },
    PolyQuery: function (options) {
        ///<summary>
        /// 开始多边形框选操作
        ///</summary>
        ///<param name="options" type="Object">
        /// 自定义参数
        ///<para>callback:Function 回调函数</para>
        ///</param>
        var defaults = { callback: null };
        Ext.apply(defaults, options);

        var me = this;
        var layerid = String.Format("layerid_{0}", new Date().getTime());
        var fillcolor = '#FFFFFF';
        var strokecolor = '#FFCC00';
        me.GetCoords({
            coording: function (coords) {
                //绘制多边形
                //debugger;
                //if (coords.length <= 4) return;
                //me.DrawPoly(layerid, {
                //    coords: coords,
                //    fillcolor: fillcolor,
                //    strokecolor: strokecolor,
                //    size: 3,
                //    opacity:0.5
                //});
            },
            coorded:function (coords) {
                if (defaults.callback && defaults.callback instanceof Function) {
                    defaults.callback(coords);
                }
            }
        });
    },
    GetLayerID: function (id) {
        ///<summary>
        /// 获取图层ID
        ///</summary>
        ///<param name="id" type="String">自定义ID</param>
        ///<returns type="String">返回系统图层ID</returns>

        return String.Format('com_pgis_togerhz_layer_{0}', id);
    },
    GetLayer: function (id) {
        ///<summary>
        /// 获取指定ID的图层
        ///</summary>
        ///<param name="id" type="String">图层ID</param>

        var me = this;
        id = me.GetLayerID(id);
        return _Layer[id] = _Layer[id] || vM.NewMapLayer(id, 271, true);
    },
    RegisterDraw: function (name, fn) {
        ///<summary>
        /// 注册绘图事件
        ///</summary>
        ///<param name="name" type="String">处理函数名</param>
        ///<param name="fn" type="Function">处理函数</param>
        name = String.Format("drawlayerFnName_{0}", name);
        _LayerDrawFunctionRegister[name] = {
            draw: fn
        };
    },
    DrawDot: function (id, data, options) {
        ///<summary>
        /// 画点
        ///</summary>
        ///<param name="id" type="String">图层ID</param>
        ///<param name="data" type="Object">
        /// 图层数据
        ///<para>x：原点横坐标</para>
        ///<para>y：原点纵坐标</para>
        ///<para>size：原点大小</para>
        ///<para>color：原点颜色</para>
        ///<para>opacity：图层透明度（0-1之间的小数）</para>
        ///<para>w：图标宽度</para>
        ///<para>h：图标高度</para>
        ///<para>exX：图标偏移横坐标</para>
        ///<para>exY：图标偏移纵坐标</para>
        ///<para>candrag：移动标识，true标识可以移动</para>
        ///<para>autoremove：自动删除标识，true标识可以删除</para>
        ///<para>autozoomchangeremove：级别缩放是否删，true标识可以删除</para>
        ///<para>autoresize：自适应大小</para>
        ///</param>
        ///<param name="options" type="Object">
        /// 实体数据
        ///<para>iconcls：图标</para>
        ///<para>text：提示信息</para>
        ///<para>style：样式信息</para>
        ///</param>

        var me = this;
        var defaults = {
            x: 0,
            y: 0,
            size: 1,
            color: '#000000',
            opacity: 0.7
        };
        var nm = id || String.Format("{0}", new Date().getTime());
        id = 'dot_' + id;
        Object.extend(defaults, data);
        var fn = function () {
            var layer = me.GetLayer(id);
            layer.innerHTML = '';
            vM.DrawDot(layer, defaults.x, defaults.y, defaults.size, defaults.color, defaults.opacity);
            me.AppendEntity(id, data, options);
        };
        me.RegisterDraw(nm, fn);
        //首次调用
        fn();
    },
    DrawDotEx: function (id, data, options) {
        ///<summary>
        /// 画点
        ///</summary>
        ///<param name="id" type="String">图层ID</param>
        ///<param name="data" type="Object">
        /// 图层数据
        ///<para>x：原点横坐标</para>
        ///<para>y：原点纵坐标</para>
        ///<para>size：原点大小</para>
        ///<para>color：原点颜色</para>
        ///<para>opacity：图层透明度（0-1之间的小数）</para>
        ///<para>w：图标宽度</para>
        ///<para>h：图标高度</para>
        ///<para>exX：图标偏移横坐标</para>
        ///<para>exY：图标偏移纵坐标</para>
        ///<para>candrag：移动标识，true标识可以移动</para>
        ///<para>autoremove：自动删除标识，true标识可以删除</para>
        ///<para>autozoomchangeremove：级别缩放是否删，true标识可以删除</para>
        ///<para>autoresize：自适应大小</para>
        ///</param>
        ///<param name="options" type="Object">
        /// 实体数据
        ///<para>iconcls：图标</para>
        ///<para>text：提示信息</para>
        ///<para>style：样式信息</para>
        ///<para>html：页面代码</para>
        ///</param>

        var me = this;
        var defaults = {
            x: 0,
            y: 0,
            size: 1,
            color: '#000000',
            opacity: 0.7
        };
        var nm = id || String.Format("{0}", new Date().getTime());
        id = 'dot_' + id;
        Object.extend(defaults, data);
        var fn = function () {
            var layer = me.GetLayer(id);
            layer.innerHTML = '';
            vM.DrawDot(layer, defaults.x, defaults.y, defaults.size, defaults.color, defaults.opacity);


            me.AppendEntity(id, data, options);
        };
        me.RegisterDraw(nm, fn);
        //首次调用
        fn();
    },
    DrawLine: function (id, data, center) {
        ///<summary>
        /// 画一条线
        ///</summary>
        ///<param name="id" type="String">图层ID</param>
        ///<param name="data" type="Object">
        /// 图层数据
        ///<para>coords：坐标组</para>
        ///<para>size：线条大小</para>
        ///<para>color：线条颜色</para>
        ///<para>opacity：图层透明度（0-1之间的小数）</para>
        ///</param>
        ///<param name="center" type="Object">
        /// 图层中心原点坐标
        ///<para>x：横坐标</para>
        ///<para>y：纵坐标</para>
        ///</param>

        var me = this;
        var defaults = {
            coords: undefined,
            size: 3,
            color: '#000000',
            opacity: 0.7
        };
        var nm = id;
        id = 'line_' + id;
        var fn = function () {
            Object.extend(defaults, data);
            var layer = me.GetLayer(id);
            layer.innerHTML = '';
            vM.DrawPolyLine(layer, defaults.coords, defaults.size, '#' + defaults.color, defaults.opacity);
        };
        me.RegisterDraw(nm, fn);
        //首次调用
        fn();
    },
    DrawCircle: function (id, data) {
        ///<summary>
        /// 画椭圆
        ///</summary>
        ///<param name="id" type="String">图层ID</param>
        ///<param name="data" type="Object">
        /// 图层数据
        ///<para>x：中心原点横坐标</para>
        ///<para>y：中心原点纵坐标</para>
        ///<para>rx：横向半径</para>
        ///<para>ry：纵向半径</para>
        ///<para>size：边框大小</para>
        ///<para>fillcolor：内部区域颜色</para>
        ///<para>strokecolor：边框颜色</para>
        ///<para>opacity：图层透明度（0-1之间的小数）</para>
        ///</param>

        var me = this;
        var defaults = {
            x: 0,
            y: 0,
            rx: 10,
            ry: 10,
            size: 1,
            fillcolor: '#000000',
            strokecolor: '#000000',
            opacity: 0.7
        };
        var nm = id;
        id = 'circle_' + id;
        Object.extend(defaults, data);
        var fn = function () {
            var layer = me.GetLayer(id);
            layer.innerHTML = '';
        };
        me.RegisterDraw(nm, fn);
        //首次调用
        fn();
    },
    DrawPoly: function (id, data, center, callback) {
        ///<summary>
        /// 画不规则多边形图
        ///</summary>
        ///<param name="id" type="String">图层ID</param>
        ///<param name="data" type="Object">
        /// 图层数据
        ///<para>coords：坐标组</para>
        ///<para>size：多边形边框宽度</para>
        ///<para>fillcolor：多边形内部区域颜色</para>
        ///<para>strokecolor：多边形边框颜色</para>
        ///<para>opacity：图层透明度（0-1之间的小数）</para>
        ///</param>
        ///<param name="center" type="Object">
        /// 图层中心原点坐标
        ///<para>x：多边形中心原点横坐标</para>
        ///<para>y：多边形中心原点纵坐标</para>
        ///</param>

        var me = this;
        var defaults = {
            coords: undefined,
            size: 1,
            fillcolor: '#000000',
            strokecolor: '#000000',
            opacity: 0.7
        };
        var nm = id;
        id = 'ploy_' + id;
        Object.extend(defaults, data);
        var fn = function () {
            var layer = me.GetLayer(id);
            layer.innerHTML = '';
            var ploy = vM.DrawPoly(layer, defaults.coords, defaults.size, defaults.fillcolor, defaults.strokecolor, defaults.opacity);
            if (typeof (callback) != 'undefined') {
                ploy.onclick = callback;
            }
        };
        me.RegisterDraw(nm, fn);
        //首次调用
        fn();
    },
    AppendEntity: function (id, data, options) {
        ///<summary>
        ///在地图上添加新的图标
        ///</summary>
        ///<param name="id" type="String">图层ID</param>
        ///<param name="data" type="Object">
        /// 图层数据
        ///<para>参数：(o, layer, autoresize, x, y, w, h, exX, exY, candrag, autoremove, autozoomchangeremove)</para>
        ///<para>autoresize：自适应大小</para>
        ///<para>x：图标位置横坐标</para>
        ///<para>y：图标位置纵坐标</para>
        ///<para>w：图标宽度</para>
        ///<para>h：图标高度</para>
        ///<para>exX：图标偏移横坐标</para>
        ///<para>exY：图标偏移纵坐标</para>
        ///<para>candrag：移动标识，true标识可以移动</para>
        ///<para>autoremove：自动删除标识，true标识可以删除</para>
        ///<para>autozoomchangeremove：级别缩放是否删，true标识可以删除</para>
        ///</param>
        ///<param name="options" type="Object">
        /// 实体数据
        ///<para>iconcls：图标</para>
        ///<para>text：提示信息</para>
        ///<para>style：样式信息</para>
        ///<para>html：页面代码</para>
        ///</param>

        var me = this;
        var vm = vM;
        var d = { iconcls: '', text: '', style: '', html: '', callback: null, args:null };
        var dd = { autoresize: false, x: 0, y: 0, w: 17, h: 17, exX: 0, exY: 0, candrag: false, autoremove: false, autozoomchangeremove: false };
        var o = Object.extend(d, options);
        var od = Object.extend(dd, data);

        id = 'entity_' + id;
        var layer = me.GetLayer(id);
        layer.innerHTML = '';
        var e = vm.$C('div');
        e.onclick = function () {
            var argu = arguments;
            if (o.callback && o.callback instanceof Function) {
                o.callback(o.args, argu);
            }
        };
        e.innerHTML = String.Format('<span title="{0}" class="cursor background-repeat {1}" >{2}</span>', o.text, o.iconcls, o.html);
        //添加图标，返回标注ID
        var eid = vm.AppendEntity(e, layer, od.autoresize, od.x, od.y, od.w, od.h, od.exX, od.exY, od.candrag, od.autoremove, od.autozoomchangeremove);
    },
    AppendEntityEx: function (options) {
        ///<summary>
        /// 添加实体层到地图中
        ///</summary>
        var me = this;
        var defaults = {
            // 图层ID
            id: undefined,
            // 图层配置属性
            autoresize: false,
            x: 0,
            y: 0,
            offset_x: 0,
            offset_y: 0,
            width: 100,
            height: 26,
            candrag: false,
            autoremove: false,
            autozoomchangeremove: false,
            className: '',
            // 图层内容
            title: null,
            innerHTML: '',
            click: function () { }
        };
        Object.extend(defaults, options);
        defaults.offset_x = defaults.offset_x || defaults.width / 2;
        defaults.offset_y = defaults.offset_y || defaults.height / 2;

        id = String.Format("entity_{0}", defaults.id);
        var layer = me.GetLayer(id);
        layer.innerHTML = '';
        var dom = vM.$C('div');
        dom.innerHTML = defaults.innerHTML;
        dom.className = defaults.className;
        dom.onclick = function () {
            if (defaults.click && defaults.click instanceof Function)
                defaults.click();
        };
        var eid = vM.AppendEntity(dom, layer, defaults.autoresize, defaults.x, defaults.y, defaults.width, defaults.height, defaults.offset_x, defaults.offset_y, defaults.candrag, defaults.autoremove, defaults.autozoomchangeremove);
        return eid;
    },
    AppendLabel: function (options) {

        var me = this;
        var defaults = {
            // 图层ID
            id: undefined,
            // 图层配置属性
            autoresize: false, x: 0, y: 0, width: 60, height: 26, offset_x: -3, offset_y: 22, candrag: false, autoremove: false, autozoomchangeremove: false,
            // 图层内容
            title: null, mouseover/*鼠标移动到图层上回调函数*/: null, click/*单击事件回调函数*/: null
        };
        Object.extend(defaults, options);
        //前缀，防止ID重复
        var prefix = 'com_pgis_tigerhz_marklabel_';
        function activemark(obj) {
            var dom;
            if (_ActiveMarkLableID) {
                dom = document.getElementById(_ActiveMarkLableID);
                dom.className = 'div-mark-tip-content content-cut';
                dom.parentElement.className = 'div-mark-tip';
            }
            obj.className = 'div-mark-tip-active-content content-cut';
            obj.parentElement.className = 'div-mark-tip-active';
            _ActiveMarkLableID = String.Format("{0}{1}", prefix, defaults.id);
        }

        function blurmark(obj) {
            if (_ActiveMarkLableID != String.Format("{0}{1}", prefix, obj.getAttribute('did'))) {
                //需要清楚本身的激活状态
                obj.className = 'div-mark-tip-content content-cut';
                obj.parentElement.className = 'div-mark-tip';
            }
        }

        function mouseout(obj) {
            blurmark(obj);
        }

        function mouseover(obj) {
            activemark(obj);
            if (defaults.mouseover && defaults.mouseover instanceof Function) {
                defaults.mouseover(obj);
            }
        }

        function click(obj) {
            activemark(obj);
            if (defaults.click && defaults.click instanceof Function) {
                defaults.click(obj);
            }
        }

        defaults.innerHTML = String.Format('<div class="div-mark-tip" title="{0}"><div id="{1}{2}" did="{2}" class="div-mark-tip-content content-cut" >{0}</div></div>', defaults.title, prefix, defaults.id);
        me.AppendEntityEx(defaults);
    },
    MoveTo: function (x, y) {
        ///<summary>
        /// 移动到平面坐标系中指定的座标
        ///</summary>
        ///<param name="x" type="Number">横坐标</param>
        ///<param name="y" type="Number">纵坐标</param>

        var me = this;
        vM.MoveTo(x, y);
    },
    Clear: function () {
        ///<summary>
        /// 清除图层信息，并且禁止重绘地图时重绘图层
        ///</summary>

        for (var l in _Layer) {
            _Layer[l].innerHTML = '';
        }
        //重绘地图时，会触发此回调函数。在此，移除绘制图像注册函数
        _LayerDrawFunctionRegister = [];
    },
    GetCurrentWindowCoords: function (cb) {
        /// <summary>获取当前窗口的左上角和右下角座标</summary>
        /// <param name="cb" type="Function(Array coords)">回调函数</param>
        /// <returns type="Array" />

        var coords = [].concat(vM.GetMapPosCurrentRegion());
        cb(coords);
        return coords;
    },
    OpenInfoWindow: function (options) {
        /// <summary>打开提示信息窗口</summary>
        /// <param name="options" type="Object">
        /// <para>html:String</para>
        /// <para>x:Number</para>
        /// <para>y:Number</para>
        /// </param>

        var defaults = { html: '', x: 0, y: 0 };
        Object.extend(defaults, options);

        vM.InfoWindow.Open(defaults.html, defaults.x, defaults.y);
        EMap.MoveTo(defaults.x, defaults.y);
    },
    CloseInfoWindow: function () {
        vM.InfoWindow.Close();
    },
    CreateLabel: function (options) {
        var defaults = { text: '', title: '' };
        Object.extend(defaults, options);

        return String.Format('<div style="cursor:pointer; color:#15498b; font-size:11px; font-weight:700; background-color:#ddd; text-align:center; line-height:{1}px;" title="{0}({2})" >{0}</div>', defaults.text, 16, defaults.title);
    },
    AppendLabelEx: function (options) {
        var defaults = {
            id: 0,
            width: 46,
            height: 16,
            x: 0,
            y: 0,
            text: '无数据',
            title: '无数据',
            className: 'content-cut a',
            click: function () { }
        };
        Object.extend(defaults, options);

        defaults.innerHTML = EMap.CreateLabel({ text: defaults.text, title: defaults.title });
        EMap.AppendEntityEx(defaults);
    }
};

//String Extension
(function (s) {
    s.Format = function () {
        ///<summary>
        /// 格式化输出字符串
        ///</summary>
        //debugger;
        var me = this;
        var args = arguments;
        if (args.length == 0) return '';
        var str = args[0];
        if (!str) return '';
        if ('string' != typeof str) return '';
        //校验序列从0开始
        if (!/{[0]}/g.test(str)) throw new RangeError();

        str = str.replace(/{(\d+)}/g, function () {
            var index = new Number(arguments[1]);

            if ('undefined' === typeof args[index + 1]) {
                //不存在设置的值，抛出错误
                //throw new RangeError();
                //提示警告信息
                Ext.log(String.Format('args[{0}]', index + 1), String.Format('args[{0}] is undefined', index + 1));
                return '';
            }

            if (args[index + 1] == null) {

                //提示警告信息
                Ext.log(String.Format('args[{0}]', index + 1), String.Format('args[{0}] is null', index + 1));
                return '';
            }

            return args[index + 1].toString();
        });
        return str;
    };
    s.prototype.Format = function () {
        ///<summary>
        /// 格式化输出字符串
        ///</summary>

        var me = this;
        var args = arguments;
        if (arguments.length == 0) return me;
        if (!/{[0]}/g.test(me)) throw new RangeError();
        var str = me.replace(/{(\d+)}/g, function (m, num) {
            var index = new Number(num);

            if ('undefined' === typeof args[index])
                return '';

            if (null == args[index])
                return '';

            return args[index].toString();
        });
        return str;
    };
})(String);
//RegExp Extension
(function (r) {
    r.prototype.Matches = function (val) {
        ///<summary>
        /// 获取正则表达是的所有分组信息
        ///</summary>
        ///<param name="val" type="String">需要匹配的值</param>
        ///<returns type="Array">匹配值组</returns>

        var me = this;
        var result = [];
        if (val && 'string' == typeof val) {
            var v = null;
            while (v = me.exec(val)) {
                result.push(v);
            }
        }
        return result;
    };
})(RegExp);
//Array Extension
(function (arr) {
    arr.prototype.FindIndex = function (v) {
        ///<summary>
        /// 获取指定值在数组中的位置
        ///<para>如果不指定，返回-1</para>
        ///<para>如果不存在，返回-1</para>
        ///</summary>

        var me = this;
        var r = -1;
        for (var i = 0; i < me.length; i++) {
            if (me[i] == v) {
                r = i;
                break;
            }
        }
        return r;
    };
    arr.prototype.Each = function (callback) {
        ///<summary>
        /// 遍历所有的数组元素，根据需要设置自动处理函数
        ///</summary>
        ///<param name="callback" type="Function">
        /// 遍历当前元素处理函数，返回需要的对象
        ///<para>参数说明:</para>
        ///<para>[0]:Object 当前遍历元素</para>
        ///<para>[1]:Number 当前遍历元素相对位置0处索引值</para>
        ///<para>[return]:Object 处理函数返回需要的对象</para>
        ///</param>
        ///<returns type="Array"></returns>
        var me = this;
        if (callback && callback instanceof Function) {
            var items = [];
            for (var i = 0; i < me.length; i++) {
                items.push(callback(me[i], i));
            }
            return items;
        }
        return me;
    }
})(Array);
//Object Extension
(function (o) {
    o.extend = function (a, b) {
        ///<summary>
        /// 复制对象b的属性和值到a的对象中，返回对象a
        ///<para>如果对象b和对象a拥有同样的属性，那么对象b中的值将覆盖对象a中同属性的值</para>
        ///</summary>
        ///<param name="a" type="Object">默认值</param>
        ///<param name="b" type="Object">自定义值[...]</param>
        ///<returns type="Object">返回对象a</returns>
        
        a = a || {};
        //复制所有的对象信息到第一个对象中
        for (var i = 1; i < arguments.length && arguments.length > 2; i++) {
            Object.extend(a, arguments[i]);
        }
        if (b && 'object' === typeof b) {
            for (var p in b) {
                //判断复制对象内部对象
                if (b[p] && b[p] instanceof Array) {
                    a[p] = b[p].concat([]);
                    continue;
                }
                if (a[p] && 'object' == typeof a[p] && 'object' === typeof b[p]) {
                    a[p] = Object.extend(a[p], b[p]);
                    continue;
                }
                a[p] = b[p];
            }
        }
        return a;
    };
})(Object);