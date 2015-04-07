/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="mapGDI.js" />

//左边栏宽度
var westWidth = 200;
//右边栏宽度
var eastWidth = 200;
//用户信息高度
var userinfoHeight = 80;
//地图工具高度
var maptoolHeight = 220;
//鹰眼地图宽度
var eyeWidth = 250;
//鹰眼地图高度
var eyeHeight = 200;
//地图相关配置
var mapConfig = {
    //地图URL地址
    Url: "http://115.239.252.70:20000/",
    //地图城市
    City: "tongzi",
    //地图初始X坐标
    CenterX: 16616,
    //地图初始Y坐标
    CenterY: 7124,
    //地图鹰眼显示
    Eye: true,
    //地图默认级别
    Zoom: 2,
    //地图控制条
    Control: true,
    //地图切换
    Layer: false
};
var loadState = {
    state1: '数据努力加载中……'
};
var errorState = {
    SysPrompt: '系统提示：',
    LoadException: '加载数据出现异常！',
    LoadError: '错误，数据获取失败！',
    ServerNoResponse: '服务器未响应！',
    SelectRow: '请选择要处理的数据！',
    SelectOnlyRow: '请选择唯一一条数据！',
    DeleteSuccess: '删除数据成功！',
    DeleteFail: '删除数据失败！',
    SubmitSuccess: '提交数据成功！',
    SubmitFail: '提交数据失败！',
    show: function (msg) {
        Ext.MessageBox.show({
            title: this.SysPrompt,
            icon: Ext.MessageBox.INFO,
            buttons: Ext.MessageBox.OK,
            msg: msg,
            animate: true,
            closable: false
        });
    },
    warning: function (msg) {
        Ext.MessageBox.show({
            title: this.SysPrompt,
            icon: Ext.MessageBox.WARNING,
            buttons: Ext.MessageBox.OK,
            msg: msg,
            animate: true,
            closable: false
        });
    },
    confirm: function (msg, callback) {
        Ext.MessageBox.show({
            title: this.SysPrompt,
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (callback && callback instanceof Function) {
                    callback(btn);
                }
            },
            msg: msg,
            animate: true,
            closable: false
        });
    },
    confirmYes: function (msg, callback) {
        Ext.MessageBox.show({
            title: this.SysPrompt,
            icon: Ext.MessageBox.QUESTION,
            buttons: Ext.MessageBox.YESNO,
            fn: function (btn) {
                if (btn == 'yes' && callback && callback instanceof Function) {
                    callback(btn);
                }
            },
            msg: msg,
            animate: true,
            closable: false
        });
    }
};
var states = Ext.create('Ext.data.SimpleStore', {
    fields: ['v', 'd'],
    data: [[0, '否'], [1, '是']]
});
states.load();

var checkBoxItems = Ext.create('Ext.data.SimpleStore', {
    fields: ['v', 'd'],
    data: [[0, '禁用'], [1, '启用']]
});
checkBoxItems.load();

var genderItems = new Ext.data.SimpleStore({
    fields: ['v', 'd'],
    data: [
        [0, '女'],
        [1, '男'],
        [2, '保密']
    ]
});

var sortLevel = Ext.create("Ext.data.SimpleStore", {
    fields: ['v', 'd'],
    data: [
        [0, "极低"],
        [25, "低"],
        [50, "一般"],
        [75, "中等"],
        [100, "高"]
    ]
});
sortLevel.load();

var markItems = Ext.create("Ext.data.SimpleStore", {
    fields: ['v', 'd'],
    data: [
        [1, "标签"],
        [2, "线条"],
        [3, "区域"]
    ]
});
markItems.load();

var markTypeItems = Ext.create("Ext.data.SimpleStore", {
    fields: ['v', 'd'],
    data: [
        [1, "标注单点"],
        [2, "标注线条"],
        [3, "标注区域"]
    ]
});
markTypeItems.load();

var liveTypes = new Ext.data.SimpleStore({
    fields: ['v', 'd'],
    data: [
        [1, '常住'],
        [2, '暂住'],
        [3, '境外'],
        [4, '重点']
    ]
});

var nationTypes = new Ext.data.SimpleStore({
    fields: ['v', 'd'],
    data: [
        [1, "汉族"],
        [2, "蒙古族"],
        [3, "回族"],
        [4, "藏族"],
        [5, "维吾尔族"],
        [6, "苗族"],
        [7, "彝族"],
        [8, "壮族"],
        [9, "布依族"],
        [10, "朝鲜族"],
        [11, "满族"],
        [12, "侗族瑶族"],
        [13, "白族"],
        [14, "土家族"],
        [15, "哈尼族"],
        [16, "哈萨克族"],
        [17, "傣族"],
        [18, "黎族"],
        [19, "僳僳族"],
        [20, "佤族"],
        [21, "畲族"],
        [22, "高山族"],
        [23, "拉祜族"],
        [24, "水族"],
        [25, "东乡族"],
        [26, "纳西族"],
        [27, "景颇族"],
        [28, "柯尔克"],
        [29, "孜族"],
        [30, "土族"],
        [31, "达斡尔族"],
        [32, "仫佬族"],
        [33, "羌族"],
        [34, "布朗族"],
        [35, "撒拉族"],
        [36, "毛南族"],
        [37, "仡佬族"],
        [38, "锡伯族"],
        [39, "阿昌族"],
        [40, "普米族"],
        [41, "塔吉克族"],
        [42, "怒族"],
        [43, "乌孜别克族"],
        [44, "俄罗斯族"],
        [45, "鄂温克族"],
        [46, "德昂族"],
        [47, "保安族"],
        [48, "裕固族"],
        [49, "京族"],
        [50, "塔塔尔族"],
        [51, "独龙族"],
        [52, "鄂伦春族"],
        [53, "赫哲族"],
        [54, "门巴族"],
        [55, "珞巴族"],
        [56, "基诺族"]
    ]
});

var provinceLessNamesStore = new Ext.data.SimpleStore({
    fields: ['v', 'd'],
    data: [
        ['京', '（京）'],
        ['津', '（津）'],
        ['沪', '（沪）'],
        ['渝', '（渝）'],
        ['冀', '（冀）'],
        ['豫', '（豫）'],
        ['云', '（云）'],
        ['辽', '（辽）'],
        ['黑', '（黑）'],
        ['湘', '（湘）'],
        ['皖', '（皖）'],
        ['鲁', '（鲁）'],
        ['新', '（新）'],
        ['苏', '（苏）'],
        ['浙', '（浙）'],
        ['赣', '（赣）'],
        ['鄂', '（鄂）'],
        ['桂', '（桂）'],
        ['甘', '（甘）'],
        ['晋', '（晋）'],
        ['蒙', '（蒙）'],
        ['陕', '（陕）'],
        ['吉', '（吉）'],
        ['闽', '（闽）'],
        ['贵', '（贵）'],
        ['粤', '（粤）'],
        ['青', '（青）'],
        ['藏', '（藏）'],
        ['川', '（川）'],
        ['宁', '（宁）'],
        ['琼', '（琼）']
    ]
});

var FireRatingLevel = new Ext.data.SimpleStore({
    fields: ['v', 'd'],
    data: [
        [1, '高'],
        [2, '中'],
        [3, '普通'],
        [4, '低']
    ]
});

var menusIconBind = Ext.create("Ext.data.SimpleStore", {
    fields: ['v', 'd'],
    data: [
        ['badd', '<div class="badd" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">添加<div>'],
        ['bupdate', '<div class="bupdate" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">更改<div>'],
        ['bdel', '<div class="bdel" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">删除<div>'],
        ['bcog', '<div class="bcog" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">设置<div>'],
        ['btool', '<div class="btool" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">工具<div>'],
        ['brefresh', '<div class="brefresh" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">刷新<div>'],
        ['bquit', '<div class="bquit" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">离开<div>']
    ]
});
menusIconBind.load();

var mapIConClses = Ext.create("Ext.data.SimpleStore", {
    fields: ['v', 'd'],
    data: [
        ['atm', '<div class="atm" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">ATM<div>'],
        ['school', '<div class="school" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">学校<div>'],
        ['hospital', '<div class="hospital" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">医院<div>'],
        ['dispatch', '<div class="dispatch" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">快递<div>'],
        ['jyz', '<div class="jyz" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">加油站<div>'],
        ['busstation', '<div class="busstation" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">公交站<div>'],
        ['car', '<div class="car" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">汽车租赁<div>'],
        ['ctqcz', '<div class="ctqcz" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">长途汽车站<div>'],
        ['dd', '<div class="dd" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">典当<div>'],
        ['jddd', '<div class="jddd" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">禁毒大队<div>'],
        ['jrwd', '<div class="jrwd" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">金融网点<div>'],
        ['jtjc', '<div class="jtjc" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">交通警察<div>'],
        ['wb', '<div class="wb" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">网吧<div>'],
        ['trainstation', '<div class="trainstation" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">火车站<div>'],
        ['pcs', '<div class="pcs" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">派出所<div>'],
        ['xzdd', '<div class="xzdd" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">刑侦大队<div>'],
        ['yey', '<div class="yey" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">幼儿园<div>'],
        ['ylcs', '<div class="ylcs" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">娱乐场所<div>'],
        ['zagt', '<div class="zagt" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">治安岗亭<div>'],
        ['zfjg', '<div class="zfjg" style="height:20px; line-height:20px; background-repeat:no-repeat; padding-left:30px;">政府机关<div>']
    ]
});
mapIConClses.load();



//菜单处理函数绑定
var menusFnBind = Ext.create("Ext.data.SimpleStore", {
    fields: ['v', 'd'],
    data: [
        ["", "（空）"],
        ["paramFn", "参数管理"],
        ["areaFn", "辖区管理"],
        ["administrativeFn", "行政区划管理"],
        ["areaRangeFn", "辖区范围管理"],
        ["menuFn", "菜单信息管理"],
        ["roleFn", "角色信息管理"],
        ["departmentFn", "组织机构管理"],
        ["officerFn", "警员信息管理"],
        ["userFn", "用户信息管理"],
        ["ChangePasswordFn", "修改密码"],
        ["UserInfoFn", "用户资料"],
        ['belongtoFn', '数据归属单位类型查询'],
        ['markFn', '信息采集'],
        ['markTypeFn', '标注类型'],
        ['planFn', '预案管理模块'],
        ['planQueryFn', '预案查看模块'],
        ['markRangeFn', '信息采集分布'],
        ['markLocationFn', '标注信息分布树'],
        ['buildingFn','实有楼房'],
        ['buildingInfoFn', '楼房信息管理'],
        ['PopulationFn', '实有人口查询'],
        ['MonitorFn', '视频监控查询'],
        ['MonitorHandlerFn', '视频监控管理'],
        ['MonitorDistributedFn', '视频空间查询'],
        ['JCJ_JJDBFn', '三台合一案件查询'],
        ['YJBJFn', '一键报警案件查询'],
        ['YJDistributedFn', '一键报警案件分布'],
        ['JCJDistributedFn', '三台合一案件分布'],
        ['caseFn', '案事件查询'],
        ['captureFn', '违停抓拍管理'],
        ['captureQueryFn', '违停抓拍查询'],
        ['PatrolAreaMangerFn', '巡防区域管理'],
        ['PatrolTrackManagerFn', '电子巡逻路线管理'],
        ['PatrolTrackNomalFn', '正常巡逻'],
        ['PatrolTrackRandomFn', '随机巡逻'],
        ['PatrolTrackRecordsFn', '巡逻记录'],
        ['syQueryFn', '实有人员查询'],
        ['ckQueryFn', '常住人员查询'],
        ['zakQueryFn', '暂住人员查询'],
        ['jwQueryFn', '境外人员查询'],
        ['zhkQueryFn', '重点人员查询'],
        ['kxQueryFn', '人口空间查询'],
        ['companyFn', '单位信息管理'],
        ['companQueryFn', '单位信息查询'],
        ['employeeFn', '从业人员查询'],
        ['hotelFn', '旅馆信息管理'],
        ['hotelQueryFn', '旅馆信息查询'],
        ['hotelStayQueryFn', '旅馆住宿人员查询'],
        ['hotelEmployeeQueryFn', '旅馆从业人员查询'],
        ['ckMapthemeFn', '常住人口主题地图'],
        ['zkMapthemeFn', '暂住人口主题地图'],
        ['zhkMapthemeFn', '重点人口主题地图'],
        ['jwMapthemeFn', '境外人口主题地图'],
        ['popStatisticsFn', '人口统计'],
        ['compStatisticsFn', '单位统计'],
        ['hotelStatisticsFn', '酒店，宾馆，旅店统计'],
        ['caseStatisticsFn', '案件统计'],
        ['monitorStatisticsFn', '监控，巡逻统计'],
        ['gpsMangagerFn', 'GPS绑定信息管理'],
        ['gpsLocationsFn', 'GPS警力分布'],
        ['gpsPanelQuery', 'GPS框选警力分布'],
        ['gpsDisplayAtFn', 'GPS设备跟踪']
    ]
});
menusFnBind.load();

var organTypes = new Ext.data.SimpleStore({
    fields: ['v', 'd'],
    data: [
        [1, '企事业单位'],
        [2, '酒店，宾馆，旅店'],
        [3, '重点场所']
    ]
});

///<summary>
/// （枚举类型）组件在容器中的位置
///<para>这个值只有在确定布局值的情况有效</para>
///</summary>
var RegionEnum = function () {
    function constructor() {
        this.North = 'North';
        this.South = 'South';
        this.West = 'West';
        this.East = 'East';
        this.Center = 'Center';
    }
    var r = r || new constructor();
    return r;
}();

///<summary>
/// （枚举类型）组件布局方式
///<para>确定容器的布局方式</para>
///</summary>
var layoutEnum = function () {
    function constructor() {
        this.Auto = 'Auto';
        this.Card = 'Card';
        this.Fit = 'Fit';
        this.Hbox = 'Hbox';
        this.Vbox = 'Vbox';
        this.Anchor = 'Anchor';
        this.Table = 'Table';
        this.Border = 'Border';
    }
    var l = l || new constructor();
    return l;
}();

//请求回发默认值
var responseDefault = {
    getAllResponseHeaders: function () { },
    getResponseHeader: function () { },
    request: undefined,
    requestId: undefined,
    responseText: undefined,
    responseXML: undefined,
    status: undefined,
    statusText: undefined
};

//请求回发结果默认值
var requestDefaultEx = {
    state: false,
    result: undefined
};

//请求回发结果默认值
var requestDefault = function () {
    function constructor() {
        this.success = false;
        this.msg = "Init exception";
        this.result = undefined;
    }
    var s = s || new constructor();
    return s;
}();

//动态加载iframe插件，应用于页面
Ext.Loader.setConfig({
    enabled: true, //开启异步加载模式 
    paths: {//声明文件的位置 
        'Ext.ux': 'Resources/js/extjs4.2/ux'
    }
});
//Ext.require(['Ext.ux.IFrame']);

//标识符管理器
var identityManager = identityManager || {};
(function ($) {

    //@private param
    var tickcount = 0;

    //@public

    $.fn = $.constructor.prototype;

    $.createId = function (prefix) {
        /// <summary>
        /// 创建唯一的标识符
        /// </summary>
        /// <param name="prefix" type="String">标识符前缀</param>
        /// <returns type="String" />
        var pre = prefix || 'identity';
        return "x-" + pre + "-" + (++tickcount);
    };

    //@private function


})(identityManager);

(function ($) {

    $.$Supper = function (supper, name) {
        /// <summary>创建新的对象，该对象有一个固定的属性 Parent 标识该对象的</summary>
        /// <param name="name" type="String">对象名称</param>
        /// <returns type="Object" />

        if (!name)
            throw new ReferenceError('null reference.');

        var _$ = supper || {};
        var o = _$[name] = _$[name] || {};
        o.supper = _$;
        return o;
    };

    $.$EncodeObj = function (obj) {
        /// <summary>将 Json 对象序列化为 Json 字符串，并用 64 位码加密</summary>
        /// <param name="obj" type="Object">需要加密的对象</param>
        /// <returns type="String" />

        obj = JSON.stringify(obj);
        obj = encodeURI(obj);
        return obj;
    };

    $.$DecodeObj = function (val) {
        /// <summary>将用 64 位码加密的字符串反序列化为 Json 对象</summary>
        /// <param name="val" type="String"></param>
        /// <returns type="String" />

        val = decodeURI(val);
        val = JSON.parse(val);
        return val;
    };

    $.$Get = function (options) {
        /// <summary>获取数据</summary>
        /// <param name="options" type="Object">
        /// 请求参数信息:
        /// <para>String url: 数据请求地址</para>
        /// <para>Object params: 数据请求参数</para>
        /// <para>String method: 'GET', 'POST'两个值之一，默认为 'POST'</para>
        /// <para>Function(options, success, response) callback: 数据请求完成回调函数，该函数总是会执行</para>
        /// <para>Function() success: 数据请求成功回调函数</para>
        /// <para>Function() failure: 数据请求失败回调函数</para>
        /// </param>
        /// <returns type="Ext.Ajax.request" />

        var defaults = { url: null, params: null, method: 'POST', callback: Ext.emptyFn, success: Ext.emptyFn, failure: Ext.emptyFn };
        Ext.apply(defaults, options);

        if (!defaults.url)
            throw new ReferenceError();

        return Ext.Ajax.request(defaults);
    };

})(Object);

Ext.require([
    'Ext.grid.plugin.BufferedRenderer',
    'Ext.tip.QuickTipManager',
    'Ext.window.Window',
    'Ext.tab.Panel',
    'Ext.menu.*',
    'Ext.ux.TabScrollerMenu'
]);


Ext.Loader.loadScript({ url: 'Resources/js/Utils.js' });
Ext.Loader.loadScript({ url: 'Resources/js/common.js' });

Ext.Loader.loadScript({ url: 'Resources/js/qForm.js' });
Ext.Loader.loadScript({
    url: 'Resources/js/MapHelper.js', onLoad: function () {
    }
});
Ext.Loader.loadScript({ url: 'Resources/js/ImgPlayer.js' });
Ext.Loader.loadScript({ url: 'Resources/js/swfupload/swfupload.js' });
Ext.Loader.loadScript({ url: 'Resources/js/swfupload/plugins/swfupload.queue.js' });
Ext.Loader.loadScript({ url: 'Resources/js/swfupload/plugins/swfupload.speed.js' });
Ext.Loader.loadScript({ url: 'Resources/js/ExtjsExtention.js' });
Ext.Loader.loadScript({ url: 'Resources/js/menuHandler.js' });
Ext.Loader.loadScript({
    url: 'Building/Building.js'
});
Ext.Loader.loadScript({ url: 'Population/Population.js' });

var InitMap = function () {
    var w = Ext.fly("extCenter").getWidth();

    var ajaxWork = Ext.create("ENetwork");
    var url = mapConfig.Url + "?mapid=map&city=" + mapConfig.City + "&w=" + w + "&x=" + mapConfig.CenterX + "&y=" + mapConfig.CenterY + "&eye=" + mapConfig.Eye + "&ew=250&eh=200&e=utf-8&z=" + mapConfig.Zoom + "&v=0&zb=" + mapConfig.Control + "&s=" + mapConfig.Layer + "";
    ajaxWork.DownloadScript(url, function () {
        //debugger;
        if (typeof (vEdushiMap) != 'undefined') {
            CreateMap();
            initMapGDI();
            loadCSS('Resources/css/MapIcon.css');
            loadCSS('Resources/css/common.css');
        }
    });
};

function initMapGDI(callback) {
    Ext.Loader.loadScript({
        url: 'Resources/js/mapGDI.js',
        onLoad: function () {
            if (callback && callback instanceof Function) {
                callback();
            }
        }
    });
}

function loadCSS(filename) {
    ///<summary>
    /// 加载CSS文件
    ///</summary>
    ///<param name="filename" type="String">文件名称</param>

    var vm = vEdushiMap;
    var f = vm.$C('link');
    f.rel = 'stylesheet';
    f.type = 'text/css';
    f.href = filename;
    vm.ContentWindow.document.getElementsByTagName('head')[0].appendChild(f);
}

function getParams(p) {
    if (p instanceof Object) {
        p = getParamObject(p);
    }

    if (p instanceof Array && p.length > 0) {
        return String.Format("&{0}", p.join('&'));
    }
    return '';
}

function getParamObject(o) {
    var arr = [];
    for (var p in o) {
        arr.push(String.Format('{0}={1}', p, o[p]));
    }
    return arr;
}