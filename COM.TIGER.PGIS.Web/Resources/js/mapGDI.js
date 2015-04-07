/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="MapHelper.js" />

Ext.define('Com.tigerhz.pgis.class.MapGDI', {
    //alias: 'mapGDI',
    //singleton: true,

    config: {
        VM: undefined,
        _layer/*图层信息*/: [],
        _clearStatue/*图层清除标识，True标识图层需要被清除，禁止重新绘画；False标识图层需要绘制*/:true,
        _coordinateHandler/*获取坐标动作参数*/: {
            flag: false,//获取位置坐标事件回调函数已经注册。True标识已经注册，False标识尚未注册
            coordingcallback: function (args, coords) {
                ///<summary>
                /// 获取当前位置坐标，总是会触发此回调函数
                ///<para>此函数可以自定义，如果此属性被映射为非Function，那么不在触发</para>
                ///</summary>
                ///<param name="args" type="Object">自定义的回调参数，如果没有指定，此被映射为当前的地图对象</param>
                ///<param name="coords" type="Array">当前位置的座标值。一个长度为2的数组，第零个值为横坐标值，第一个值为纵坐标值</param>
            },
            coordedcallback: function (args, coords) {
                ///<summary>
                /// 获取位置坐标动作结束，总是会触发此回调函数
                ///<para>此函数可以自定义，如果此属性被映射为非Function，那么不在触发</para>
                ///</summary>
                ///<param name="args" type="Object">自定义的回调参数，如果没有指定，此被映射为当前的地图对象</param>
                ///<param name="coords" type="Array">当前位置的座标值。一个长度为2的数组，第零个值为横坐标值，第一个值为纵坐标值</param>
            }
        }
    },
    //constructor: function (cfg) {
    //    this.initConfig(cfg);
    //},
    GetCoords: function (arg, callback, multiple) {
        ///<summary>
        /// 获取地图中选取的坐标点
        ///</summary>
        ///<param name="arg" type="Object">回调方法的第一个参数</param>
        ///<param name="callback" type="Function">
        /// 取点完成的回调方法
        ///<para>回调方法参数说明：</para>
        ///<para>arg：传入的自定义参数</para>
        ///<para>coords：选取地图所有点坐标</para>
        ///</param>
        ///<param name="multiple" type="Boolean">设置为true，标识可以连续取点</param>

        var vm = this.getVM();        
        var getCoording = function (coords) {
            if (!multiple) {
                //选取单个点，直接结束
                vm.StopGetCoords();
            }
        };

        this.RegistGetCoordsEvent(getCoording, callback, arg);
    },
    GetCoordsEx: function (options) {
        ///<summary>
        /// 获取坐标点事件
        ///</summary>
        ///<param name="options" type="Object">
        /// 自定义参数
        ///<para>getcoording:Function 获取当前坐标点座标回调函数</para>
        ///<para>getcoorded:Function 获取座标动作结束回调函数</para>
        ///</param>
        ///<returns></returns>

        var me = this;
        var defaults = { getcoording: function () { }, getcoorded: function () { }, arg: null };
        Ext.apply(defaults, options);

        me.RegistGetCoordsEvent(defaults.getcoording, defaults.getcoorded, defaults.arg);
    },
    GetSingle: function (callback) {
        ///<summary>
        /// 获取单点数据
        ///</summary>
        ///<param name="callback" type="Function">取点完成回调方法</param>

        var vm = this.getVM();

        this.RegistGetCoordsEvent(function (coords) {
            vm.StopGetCoords();
        }, callback);
    },
    GetMultiple: function (callback) {
        ///<summary>
        /// 获取多点数据
        ///</summary>
        ///<param name="callback" type="Function">取点完成回调方法</param>

        this.RegistGetCoordsEvent(function () { }, callback);
    },
    RegistGetCoordsEvent: function (coordingCallback, coordedCallback, arg) {
        ///<summary>
        /// 注册获取菜单事件
        ///</summary>
        ///<param name="coordingCallback" type="Function">取点操作进行中回调函数</param>
        ///<param name="coordedCallback" type="Function">取点操作完成回调函数</param>
        ///<param name="arg" type="Object">自定义参数</param>

        var me = this;
        var vm = this.getVM();
        var coordHandler = me.get_coordinateHandler();

        coordHandler.coordingcallback = coordingCallback;
        coordHandler.coordedcallback = coordedCallback;
        if (!coordHandler.flag) {
            var getCoording = function (coords) {
                if (coordHandler.coordingcallback && coordHandler.coordingcallback instanceof Function) {
                    var arr = [];
                    arr.push(coords[coords.length - 2]);
                    arr.push(coords[coords.length - 1]);
                    coordHandler.coordingcallback(arg || me, arr);
                }
            };
            var getCoorded = function (coords) {
                if (coordHandler.coordedcallback && coordHandler.coordedcallback instanceof Function) {
                    coordHandler.coordedcallback(arg || me, coords);
                }
            };

            //取点操作进行中 
            vm.detachEvent(AlaMap.KeyWord.EventName.GetCoordsIng);
            vm.attachEvent(AlaMap.KeyWord.EventName.GetCoordsIng, getCoording);
            //取点操作结束 
            vm.detachEvent(AlaMap.KeyWord.EventName.GetCoordsEnd);
            vm.attachEvent(AlaMap.KeyWord.EventName.GetCoordsEnd, getCoorded);
            
            coordHandler.flag = true;
        }
        //开始取点
        vm.StartGetCoords();
    },
    StopCoords: function (options) {
        ///<summary>
        /// 强制停止获取坐标点动作
        ///</summary>
        var me = this;
        var vm = me.getVM();
        var defaults = { callback: function () { } };
        Ext.apply(defaults, options);
        vm.StopGetCoords();
        if (defaults.callback && defaults.callback instanceof Function) {
            defaults.callback(me);
        }
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

        //var me = this;
        //var vm = this.getVM();
        //var d = {
        //    x: 0,
        //    y: 0,
        //    size: 1,
        //    color: '#000000',
        //    opacity: 0.7
        //};
        //id = 'dot_' + id;
        //var o = Ext.apply({}, data, d);
        //var layer = this.GetLayer(id);
        //function draw() {
        //    if (!me.get_clearStatue()) {
        //        vm.DrawDot(layer, o.x, o.y, o.size, o.color, o.opacity);
        //        me.MoveTo({ x: o.x, y: o.y });
        //        me.RegistEvents(draw);
        //        //追加标注图标
        //        me.AppendEntity(id, data, options);
        //    }
        //}
        //me.set_clearStatue(false);
        //draw();
        EMap.DrawDot(id, data, options);
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

        //var me = this;
        //var vm = this.getVM();
        //var d = {
        //    coords: undefined,
        //    size: 3,
        //    color: '#000000',
        //    opacity: 0.7
        //};
        //id = 'line_' + id;
        //var o = Ext.apply({}, data, d);
        //var layer = me.GetLayer(id);
        //function draw() {
        //    if (!me.get_clearStatue()) {
        //        layer.innerHTML = '';
        //        //var coords = o.coords.split(',');
        //        //for (var i = 0; i <= coords.length - 4; i+=2) {
        //        //    vm.DrawLine(layer, coords[i], coords[i + 1], coords[i + 2], coords[i + 3], o.size, o.color, o.opacity);
        //        //}
        //        vm.DrawPolyLine(layer, o.coords, o.size, '#' + o.color, o.opacity);
        //        me.MoveTo(center);
        //        me.RegistEvents(draw);
        //    }
        //}
        //me.set_clearStatue(false);
        //draw();

        EMap.DrawLine(id, data, center);
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

        //var me = this;
        //var d = {
        //    x: 0,
        //    y: 0,
        //    rx: 10,
        //    ry: 10,
        //    size: 1,
        //    fillcolor: '#000000',
        //    strokecolor: '#000000',
        //    opacity: 0.7
        //};
        //Ext.apply(d, data);
        //id = 'circle_' + id;
        //var layer = me.GetLayer(id);
        //var draw = function () {
        //    if (!me.get_clearStatue()) {

        //    }
        //}
        //me.set_clearStatue(false);
        //draw();

        EMap.DrawCircle(id, data);
    },
    DrawPloy: function (id, data, center) {
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

        //var me = this;        
        //var d = {
        //    coords: undefined,
        //    size: 1,
        //    fillcolor: '#000000',
        //    strokecolor: '#000000',
        //    opacity: 0.7
        //};
        //id = 'ploy_' + id;
        //var o = Ext.apply({}, data, d);
        //var vm = me.getVM();
        //var layer = me.GetLayer(id);
        //function draw() {
        //    if (!me.get_clearStatue()) {
        //        layer.innerHTML = '';
        //        vm.DrawPoly(layer, o.coords, o.size, o.fillcolor, o.strokecolor, o.opacity);
        //        me.MoveTo(center);
        //        me.RegistEvents(draw);
        //    }
        //};
        //me.set_clearStatue(false);
        ////开始画图
        //draw();

        EMap.DrawPoly(id, data, center);
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
        ///</param>
        
        var me = this;
        var vm = me.getVM();
        var d = { iconcls: 'badd', text: '', style: '' };
        var dd = { autoresize: false, x: 0, y: 0, w: 17, h: 17, exX: 0, exY: 0, candrag: false, autoremove: false, autozoomchangeremove: false };
        var o = Ext.apply({}, options, d);
        var od = Ext.apply({}, data, dd);

        id = 'entity_' + id;
        var layer = me.GetLayer(id);
        layer.innerHTML = '';
        var e = vm.$C('div');
        e.innerHTML = Ext.String.format('<span title="{0}" class="cursor background-repeat {1}" ></span>', o.text, o.iconcls);
        //添加图标，返回标注ID
        var eid = vm.AppendEntity(e, layer, od.autoresize, od.x, od.y, od.w, od.h, od.exX, od.exY, od.candrag, od.autoremove, od.autozoomchangeremove);
    },
    AppendButton: function (id, data, btnOpts) {
        ///<summary>
        /// 向地图中添加地图按钮
        ///</summary>
        var me = this;
        var vm = me.getVM();
        var defaults = { autoresize: false, x: 0, y: 0, w: 40, h: 22, exX: 0, exY: 0, candrag: false, autoremove: true, autozoomchangeremove: false };
        var bOpts = { type: 'button', text: '添加', click: null };
        id = 'entity-button-' + id;
        var layer = me.GetLayer(id);
        layer.innerHTML = '';
        //添加数据
        Ext.apply(defaults, data);
        //按钮设置
        Ext.apply(bOpts, btnOpts);

        var e = vm.$C('div');
        var clickcallback = function (me) {
            if (bOpts.click && bOpts.click instanceof Function) {
                bOpts.click(me);
            }
        };
        e.innerHTML = '<input type="button" value="' + bOpts.text + '" click="clickcallback(this)" />';
        var eid = vm.AppendEntity(e, layer, defaults.autoresize, defaults.x, defaults.y, defaults.w, defaults.h, defaults.exX, defaults.exY, defaults.candrag, defaults.autoremove, defaults.autozoomchangeremove);
    },
    MoveTo: function (point) {
        ///<summary>
        ///屏幕中心移动到指定的坐标
        ///</summary>
        ///<param name="point" type="Object">
        ///<para>x:横坐标</para>
        ///<para>y:纵坐标</para>
        ///</param>
        var d = { x: 0, y: 0 };
        var obj = Ext.apply({}, point, d);
        this.getVM().MoveTo(obj.x, obj.y);
    },
    GetLayer: function (id) {
        ///<summary>
        /// 获取指定ID的图层
        ///</summary>
        ///<param name="id" type="String">图层ID</param>
        id = 'Com_tigerhz_pgis_' + id;
        return this.get_layer()[id] = this.get_layer()[id] || this.getVM().NewMapLayer(id, 271, true);
    },
    RegistEvents: function (method) {
        ///<summary>
        /// 注册事件
        ///</summary>
        ///<param name="method" type="Function">回调方法名称</param>
        var vm = this.getVM();

        //注册地图缩放事件
        vm.detachEvent(AlaMap.KeyWord.EventName.MapZoomChange, method);
        vm.attachEvent(AlaMap.KeyWord.EventName.MapZoomChange, method);
        //注册地图重绘事件
        vm.detachEvent(AlaMap.KeyWord.EventName.Repaint, method);
        vm.attachEvent(AlaMap.KeyWord.EventName.Repaint, method);
    },
    ClearLayer: function () {
        ///<summary>
        /// 清除图层信息
        ///<para>系统将清楚所有的图层，如果没有指定清除的图层ID</para>
        ///</summary>

        EMap.Clear();
    }
});

var mapGDI = mapGDI || Ext.create('Com.tigerhz.pgis.class.MapGDI');
mapGDI.setVM(vEdushiMap);