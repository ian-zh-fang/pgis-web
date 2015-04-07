/// <reference path="extjs4.2/ext-all-dev.js" />

/// <summary>遮罩层处理</summary>
var maskHandler = maskHandler || {};
(function ($) {

    var mask = null;

    (function (me) {

        /// <summary>遮罩层实体</summary>
        me.mask = mask;

        me.Show = function (options) {
            /// <summary>显示遮罩层</summary>
            /// <param name="options" type="Object">
            /// <para>p:String HTML元素ID</para>
            /// <para>msg:String 提示消息</para>
            /// </param>

            startMask(options);
        };

        me.Hide = function () {
            /// <summary>隐藏遮罩层</summary>

            stopMask();
        };

    })($.mask = $.mask || {});

    function createmask(options) {    //私有方法
        options = options || {};
        p = options.p || Ext.getBody();
        msg = options.msg || '正在处理数据...';
        mask = new Ext.LoadMask(p, { msg: msg });
        return mask;
    }

    function startMask(options) {
        createmask(options).show();
    }

    function stopMask() {
        if (mask) {
            mask.hide();
        }
    }

})(maskHandler);


var maskGenerate = maskGenerate || {};
(function ($) {

    $.start = function (options) {
        var instance = new constructor(options);
        instance.mask.show();
        return instance;
    }
    
    function constructor(options) {
        var defaults = { p: null, msg: '正在处理数据...' };
        Ext.apply(defaults, options);

        var fn = {};

        var mask = fn.mask = new Ext.LoadMask(defaults.p || Ext.getBody(), { msg: defaults.msg });

        fn.stop = function () { mask.hide(); };

        return fn;
    }

})(maskGenerate);