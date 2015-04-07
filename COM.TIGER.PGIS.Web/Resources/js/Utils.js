/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="Config.js" />
/// <reference path="common.js" />

// 异步加载JS方法 start
Ext.define("ENetwork", {
    statics: {
        GetExecutionID: function () {
            var a = new Date,
            b = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate(), a.getHours(), a.getMinutes(), a.getSeconds(), a.getMilliseconds());
            b += Math.round(Math.random() * 1000000);
            return b;
        },
        DownloadScriptCallback: function (a) {
            if (a) { a(); }
        },
        GetAttachTarget: function () {
            if (document.getElementsByTagName("head")[0] != null) {
                return document.getElementsByTagName("head")[0];
            } else {
                alert("");
            }
        }
    },
    DownloadScript: function (a, b, c) {
        /// <summary>
        /// 异步加载JS
        /// </summary>
        /// <param name="a">URL路径</param>
        /// <param name="b">回调方法</param>
        try {
            if (a == null || a == "undefined" || a.length == 0) {
                alert("err_noscripturl");
            }
            var elScript = document.createElement("script");
            elScript.type = "text/javascript";
            elScript.language = "javascript";
            elScript.id = typeof (c) == "undefined" ? ENetwork.GetExecutionID() : c;
            elScript.src = a;
            if (navigator.userAgent.indexOf("IE") >= 0) {
                elScript.onreadystatechange = function () {
                    if (elScript && ("loaded" == elScript.readyState || "complete" ==
                    elScript.readyState)) {
                        elScript.onreadystatechange = null;
                        ENetwork.DownloadScriptCallback(b)
                    }
                };
            } else {
                elScript.onload = function () {
                    elScript.onload = null;
                    ENetwork.DownloadScriptCallback(b);
                };
            }
            if (Ext.getElementById(c) ){
                ENetwork.GetAttachTarget().removeChild(Ext.getElementById(c));
            }
            ENetwork.GetAttachTarget().appendChild(elScript);
            return elScript.id;
        }
        catch (e) {
            alert(e.message);
        }
    }
});
//end

//加载模块
Ext.define("LoadModlues", {
    statics: {
        loadJS: function (o, url, cf) {
            if (o == "object") {
                delete o;
            }
            Ext.Loader.loadScript({
                url: url, onLoad: cf
            })
        }
    }
});


//定义颜色选择器
Ext.define('ColorField', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.colorfield',
    requires: ['Ext.picker.Color'],
    triggerCls: 'x-form-color-trigger',
    createPicker: function () {
        var me = this;
        return Ext.create('Ext.picker.Color', {
            pickerField: me,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            listeners: {
                select: function (picker, selColor) {
                    me.setValue(selColor);
                    // 实现根据选择的颜色来改变背景颜色,根据背景颜色改变字体颜色,防止看不到值

                    var r = parseInt(selColor.substring(0, 2), 16);
                    var g = parseInt(selColor.substring(2, 4), 16);
                    var b = parseInt(selColor.substring(4, 6), 16);
                    var a = new Ext.draw.Color(r, g, b);
                    var l = a.getHSL()[2];
                    if (l > 0.5) {
                        me.setFieldStyle('background:#' + selColor + ';color:#000000');
                    }
                    else {
                        me.setFieldStyle('background:#' + selColor + ';color:#FFFFFF');
                    }
                }
            }
        });
    }
});

var $address = $address || {};
(function ($) {
    var tp = null;
    $.getAutoComplete = getAutoComplete;

    function getAutoComplete(options) {
        var defaults = { url: 'XAddress/AddressHelper.ashx?req=mat', tp: tp = tp || defaultCompeteModel(), val: 'Content', field: 'Content', text: null, name: null, render: renderCallback, value: '' };
        Ext.apply(defaults, options);

        var autofield = Autocompletefield.create({
            url: defaults.url,
            modelType: defaults.tp,
            rendercallback: defaults.render,
            displayField: defaults.field,
            valueField: defaults.val,
            fieldLabel: defaults.text,
            name: defaults.name,
            value:defaults.value
        });
        return autofield;
    }

    function defaultCompeteModel() {
        var tp = identityManager.createId('model');
        Ext.define(tp, {
            extend: 'Ext.data.Model',
            fields: [
                { name: 'ID' },
                { name: 'Content' },
                { name: 'AdminID' },
                { name: 'OwnerInfoID' },
                { name: 'StreetID' },
                { name: 'NumID' },
                { name: 'UnitID' },
                { name: 'RoomID' }
            ]
        });
        return tp;
    }

    function renderCallback(name) {
        return String.Format('<div style="line-height:22px;padding:2px 10px" class="content-cut">{{0}}</div>', name);
    }
})($address);

(function () {
    Ext.define("Ext.ux.comboTree", {
        extend: "Ext.form.field.Picker",
        requires: ["Ext.tree.Panel"],
        alias: 'widget.combotree',
        "initComponent": function () {
            var self = this;
            Ext.apply(self, {
                fieldLabel: self.fieldLabel,
                labelWidth: self.labelWidth,
                url: self.url,
                valueField: self.valueField,
                displayField:self.displayField,
                store: self.store,
                itemSelected: self.itemSelected || Ext.emptyFn,
                editable:false
            });
            self.callParent();
        },
        "createPicker": function () {
            var self = this;
            var store = this.store;
            if (!store) {
                store = new Ext.data.TreeStore({
                    proxy: {
                        type: 'ajax',
                        url: self.url,
                        actionMethods: 'post'
                    }
                    ,
                    sorters: [{
                        property: 'leaf',
                        direction: 'asc'
                    }, {
                        property: 'text',
                        direction: 'asc'
                    }]
                });
            }
            self.picker = new Ext.tree.Panel({
                height: 200,
                autoScroll: true,
                floating: true,
                focusOnToFront: true,
                shadow: true,
                ownerCt: this.ownerCt,
                useArrows: true,
                store: store,
                rootVisible: false,
                resizable: false
            });
            self.picker.on({
                //"itemdblclick": function (combotree, rec) {
                //    self.picker.hide();
                //},
                "itemclick": function (combotree, rec) {
                    //debugger;
                    var value = rec.raw[self.valueField];
                    var text = rec.raw[self.displayField];
                    self.setValue(text);
                    self.picker.hide();
                    if (self.itemSelected && self.itemSelected instanceof Function) {
                        self.itemSelected(rec.raw, {
                            record: rec,
                            obj: self,
                            tree: combotree
                        });
                    }
                }
            });
            return self.picker;
        },
        "alignPicker": function () {
            var me = this, picker, isAbove, aboveSfx = '-above';
            if (this.isExpanded) {
                picker = me.getPicker();
                if (me.matchFieldWidth) {
                    picker.setWidth(me.bodyEl.getWidth());
                }
                if (picker.isFloating()) {
                    picker.alignTo(me.inputEl, "", me.pickerOffset); // ""->tl   
                    isAbove = picker.el.getY() < me.inputEl.getY();
                    me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls
              + aboveSfx);
                    picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls
              + aboveSfx);
                }
            }
        }
    });
})();

(function () {
    /**
     * Add basic filtering to Ext.tree.Panel. Add as a mixin:
     *  mixins: {
     *      treeFilter: 'MyApp.lib.TreeFilter'
     *  }
     */
    Ext.define('MyApp.lib.TreeFilter', {
        filterByText: function (text) {
            this.filterBy(text, 'text');
        },

        /**
         * Filter the tree on a string, hiding all nodes expect those which match and their parents.
         * @param The term to filter on.
         * @param The field to filter on (i.e. 'text').
         */
        filterBy: function (text, by) {

            this.clearFilter();

            var view = this.getView(),
                me = this,
                nodesAndParents = [];

            // Find the nodes which match the search term, expand them.
            // Then add them and their parents to nodesAndParents.
            this.getRootNode().cascadeBy(function (tree, view) {
                var currNode = this;

                if (currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {
                    me.expandPath(currNode.getPath());

                    while (currNode.parentNode) {
                        nodesAndParents.push(currNode.id);
                        currNode = currNode.parentNode;
                    }
                }
            }, null, [me, view]);

            // Hide all of the nodes which aren't in nodesAndParents
            this.getRootNode().cascadeBy(function (tree, view) {
                var uiNode = view.getNodeByRecord(this);

                if (uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {
                    Ext.get(uiNode).setDisplayed('none');
                }
            }, null, [me, view]);
        },

        clearFilter: function () {
            var view = this.getView();

            this.getRootNode().cascadeBy(function (tree, view) {
                var uiNode = view.getNodeByRecord(this);

                if (uiNode) {
                    Ext.get(uiNode).setDisplayed('table-row');
                }
            }, null, [this, view]);
        }
    });

    Ext.define("MyApp.lib.Tree", {
        extend: 'Ext.tree.Panel',
        alias: 'widget.FilterTree',
        animate: true,
        autoScroll: true,
        rootVisible: false,
        collapsible: false,
        split: false,
        tools: [],
        mixins: {
            treeFilter: 'MyApp.lib.TreeFilter'
        },
        tbar: []
    });
})();

(function (o) {

    var pro = o.constructor.prototype;

    o.constructor.prototype.FindIndex = function (v) {
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
    o.constructor.prototype.Each = function (callback) {
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
        ///<returns></returns>

        var me = this;
        if (callback && callback instanceof Function) {
            var items = [];
            for (var i = 0; i < me.length; i++) {
                items.push(callback(me[i], i));
            }
            return items;
        }
        return me;
    };
    o.constructor.prototype.IndexOf = function (callback) {
        var me = this;
        var index = -1;
        for (var i = 0; i < me.length; i++) {
            if (me[i] && callback(me[i])) {
                index = i;
                break;
            }
        }
        return index;
    };
})([]);

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
//格式化时间输出
(function ($) {
    $.Format = function () {
        var year = $.getFullYear();
        var month = $.getMonth();
        var day = $.getDay();
        var hour = $.getHours();
        var minutes = $.getMinutes();
        var seconds = $.getSeconds();
        
        return String.Format('{0}-{1}-{2} {3}:{4}:{5}', year, month, day, hour, minutes, seconds);
    }
})(Date.prototype);

