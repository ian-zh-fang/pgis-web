/// <reference path="../../Buildings/building.js" />
/// <reference path="maptheme.js" />
/// <reference path="maptheme.js" />
/// <reference path="../../Hotel/hotelQuery.js" />
/// <reference path="../../Hotel/hotel.js" />
/// <reference path="../../Population/Population.js" />
/// <reference path="../../Plan/PrePlan.js" />

/// <reference path="extjs4.2/ext-all.js" />
/// <reference path="Utils.js" />
/// <reference path="common.js" />
/// <reference path="Param.js" />
/// <reference path="Menu.js" />
/// <reference path="Role.js" />
/// <reference path="Department.js" />
/// <reference path="AreaRange.js" />
/// <reference path="User.js" />
/// <reference path="Area.js" />
/// <reference path="Plan.js" />
/// <reference path="BelongTo.js" />
/// <reference path="../../Hotel/hotelstayQuery.js" />
/// <reference path="../../MarkType/MarkType.js" />
/// <reference path="../../Mark/MarkQuery.js" />
/// <reference path="../../ViolatedParkAndCapture/Capture.js" />
/// <reference path="../../ViolatedParkAndCapture/CaptureQuery.js" />
/// <reference path="../../YJBJ/YJBJ.js" />
/// <reference path="../../YJBJ/YJDistributed.js" />
/// <reference path="../../JCJ_JJDB/JCJDistributed.js" />
/// <reference path="maptheme.js" />
/// <reference path="../../JCJ_JJDB/JCJ_JJDB.js" />
/// <reference path="../../Sys/User.js" />
/// <reference path="../../Monitor/MonitorDistributed.js" />
/// <reference path="../../Monitor/Monitor.js" />
/// <reference path="../../Officer/officerManager.js" />
/// <reference path="../../Buildings/buildingManager.js" />
/// <reference path="../../Buildings/buildingQuery.js" />
/// <reference path="../../Monitor/MonitorManager.js" />
/// <reference path="../../Administrative/administrativeManager.js" />
/// <reference path="../../PatrolTrack/PatrolTrackHistory.js" />
/// <reference path="../../PatrolTrack/PatrolTrackManager.js" />
/// <reference path="../../PatrolTrack/PatrolTrack.js" />
/// <reference path="../../PatrolTrack/PatrolTrackOnDevices.js" />
/// <reference path="../../Plan/Plan.js" />
/// <reference path="../../Sys/UserInfo.js" />
/// <reference path="../../Company/companyQuery.js" />
/// <reference path="../../Company/Company.js" />
/// <reference path="../../Employee/employeeQuery.js" />
/// <reference path="../../Statistics/statistics.js" />
/// <reference path="../../Statistics/statisticscase.js" />
/// <reference path="../../Statistics/statisticscompany.js" />
/// <reference path="../../Statistics/statisticshotel.js" />
/// <reference path="../../AJJBXX/ajmanager.js" />
/// <reference path="../../Statistics/statisticsmonitor.js" />
/// <reference path="../../Statistics/statisticspopulation.js" />
/// <reference path="../../GlobalPostionSystem/display.js" />
/// <reference path="../../GlobalPostionSystem/manager.js" />

//菜单鼠标事件处理程序
function menu_mouseout_handler(obj, e, itm) {
    if (e.getRelatedTarget() != null) {
        if (!e.getRelatedTarget().contains(e.getTarget()) && !obj.getEl().contains(e.getRelatedTarget())) {
            obj.hide();
        }
        else if (e.getRelatedTarget().contains(obj.getEl().dom)) {
            obj.hide();
        }
    }
}
//系统参数管理
function paramFn() {
    LoadModlues.loadJS(typeof ParamManager, "sys/Param.js", function () {
        ParamManager.GetParam();
    });
}
//
function areaRangeFn() {
    LoadModlues.loadJS(typeof arearangeManager, "Area/AreaRange.js", function () {
        arearangeManager.createRootGrid();
    });
}
//
function areaFn(id) {
    LoadModlues.loadJS(typeof AreaManager, "Area/Area.js", function () {
        AreaManager.queryForm(id);
    });
}
//
function PatrolAreaMangerFn(id) {
    LoadModlues.loadJS(typeof PatrolAreaManager, "PatrolArea/PatrolArea.js", function () {
        PatrolAreaManager.CreateForm(id);
    });
} 
function PatrolAreaFn(id) {
    LoadModlues.loadJS(typeof PatrolAreaManager, "PatrolArea/PatrolArea.js", function () {
        PatrolAreaManager.queryForm(id);
    });
}
//单位数据归属地管理
function belongtoFn() {
    LoadModlues.loadJS(typeof belongtoManager, "Resources/js/BelongTo.js", function () {
        belongtoManager.createGrid();
    });
}
//菜单管理
function menuFn() {
    LoadModlues.loadJS(typeof menuManager, "sys/Menu.js", function () {
        menuManager.pagingTopMenu();
    });
}
//系统角色管理
function roleFn() {
    LoadModlues.loadJS(typeof roleManager, "sys/Role.js", function () {
        roleManager.pagingRole();
    });
}
//组织机构管理
function departmentFn() {
    LoadModlues.loadJS(typeof departmentManager, "sys/Department.js", function () {
        departmentManager.createView();
    });
}
//系统用户管理
function userFn() {
    LoadModlues.loadJS(typeof userManager, "sys/User.js", function () {
        userManager.getGrid();
    });
}
//行政区划管理
function administrativeFn() {
    LoadModlues.loadJS(typeof adminManager, 'Administrative/administrativeManager.js', function () {
        adminManager.tabpanel.Show();
    });
}
//采集标注管理
function markFn() {
    LoadModlues.loadJS(typeof markManager, "Mark/Mark.js", function () {
        
    });
}
//采集标注类型管理（已停用）
function markTypeFn() {
    LoadModlues.loadJS(typeof markTypeManager, "Mark/MarkType.js", function () {
        
    });
};
//采集标注分布查询
function markLocationFn() {
    LoadModlues.loadJS(typeof markTypeManager, "Mark/MarkQuery.js", function () {
        var c = markQuery.tree.tree();
        showQueryForm(c);
    });
}
//标注查询
function markRangeFn() {
    LoadModlues.loadJS(typeof markQuery, "Mark/MarkQuery.js", function () {
        var c = markQuery.query.form();
        showQueryForm(c);
    });
}
//违停抓拍区域管理
function captureFn() {
    LoadModlues.loadJS(typeof capture, 'ViolatedParkAndCapture/Capture.js', function () {
        captureManager.window();
    });
}
//违停抓拍区域查询
function captureQueryFn() {
    LoadModlues.loadJS(typeof captureQuery, 'ViolatedParkAndCapture/CaptureQuery.js', function () {
        showQueryForm(captureQuery.tree.tree);
    });
}

//方案预案管理
function planFn() {    
    LoadModlues.loadJS(typeof PPM, "Plan/PrePlan.js", function () {

    });
}
//方案预案查询
function planQueryFn() {
    LoadModlues.loadJS(typeof planQuery, "Plan/Plan.js", function () {
        showQueryForm(planQuery.grid.grid, true);
    });
}
//楼房查询
function buildingFn() {
    LoadModlues.loadJS(typeof buildingQuery, "Buildings/buildingQuery.js", function () {
        showQueryForm(buildingQuery.Show());
    });
}
//楼房信息维护
function buildingInfoFn() {
    //LoadModlues.loadJS(typeof buildingManager, "Buildings/buildingManager.js", function () {
    //    buildingManager.Show();
    //});

    LoadModlues.loadJS(typeof $building, "Buildings/building.js", function () {
        $building.Show();
    });
}
//人口
function PopulationFn() {
    LoadModlues.loadJS(typeof PopulationManager, "Population/Population.js", function () {
        PopulationManager.InvokeSearchForm();
    });
}
//监控
function MonitorFn() {
    LoadModlues.loadJS(typeof MonitorManager, "Monitor/Monitor.js", function () {
        showQueryForm(monitorManager.query.form);
    });
}
//监控后端管理
function MonitorHandlerFn() {
    LoadModlues.loadJS(typeof monitorHandler, "Monitor/MonitorManager.js", function () {
        monitorHandler.tabpanel.Show();
    });
}
//监控空间查询
function MonitorDistributedFn() {
    LoadModlues.loadJS(typeof monitorDistributed, "Monitor/MonitorDistributed.js", function () {
        showQueryForm(monitorDistributed.query.form);
    });
}
//三台合一报警
function JCJ_JJDBFn() {
    LoadModlues.loadJS(typeof JCJ_JJDBManager, "JCJ_JJDB/JCJ_JJDB.js", function () {
        showQueryForm(JCJ_JJDBManager.form);
    });
}
//学校，金融一键报警
function YJBJFn() {
    LoadModlues.loadJS(typeof YJBJManager, "YJBJ/YJBJ.js", function () {
        showQueryForm(YJBJQuery.form);
    });
}
//一键报警案件分布
function YJDistributedFn() {
    LoadModlues.loadJS(typeof yjDistribute, 'YJBJ/YJDistributed.js', function () {
        showQueryForm(yjDistribute.form);
    });
}
//三台合一案件分布
function JCJDistributedFn() {
    LoadModlues.loadJS(typeof jcjDistribute, 'JCJ_JJDB/JCJDistributed.js', function () {
        showQueryForm(jcjDistribute.form);
    });
}

//@PatrolTrack 电子巡逻
//后台管理
function PatrolTrackManagerFn() {
    LoadModlues.loadJS(typeof patroltrackManger, 'PatrolTrack/PatrolTrackManager.js', function () {
        patroltrackManger.window.Show();
    });
}
//正常巡逻
function PatrolTrackNomalFn() {
    LoadModlues.loadJS(typeof patroltrack, 'PatrolTrack/PatrolTrack.js', function () {
        showQueryForm(patroltrack.grid.grid, true);
    });
}
//随机巡逻
function PatrolTrackRandomFn() {
    LoadModlues.loadJS(typeof trackOnDevice, 'PatrolTrack/PatrolTrackOnDevices.js', function () {
        showQueryForm(trackOnDevice.grid.grid, true);
    });
}
//巡逻记录
function PatrolTrackRecordsFn() {
    LoadModlues.loadJS(typeof patroltrackHistory, 'PatrolTrack/PatrolTrackHistory.js', function () {
        showQueryForm(patroltrackHistory.form.form);
    });
}

//修改用户密码
function ChangePasswordFn() {
    LoadModlues.loadJS(typeof userHandler, 'Sys/UserInfo.js', function () {
        userHandler.password.Show();
    });
}

function UserInfoFn() {
    LoadModlues.loadJS(typeof userHandler, 'Sys/UserInfo.js', function () {
        userHandler.info.Show();
    });
}

//警员信息管理
function officerFn() {
    LoadModlues.loadJS(typeof officermanager, 'Officer/officerManager.js', function () {
        officermanager.grid.Show();
    });
}

function syQueryFn() {
    LoadModlues.loadJS(typeof populationQuery, 'Population/Population.js', function () {
        showQueryForm(populationQuery.sy.Form());
    });
}

function ckQueryFn() {
    LoadModlues.loadJS(typeof populationQuery, 'Population/Population.js', function () {
        showQueryForm(populationQuery.ck.Form());
    });
}

function zakQueryFn() {
    LoadModlues.loadJS(typeof populationQuery, 'Population/Population.js', function () {
        showQueryForm(populationQuery.zak.Form());
    });
}

function jwQueryFn() {
    LoadModlues.loadJS(typeof populationQuery, 'Population/Population.js', function () {
        showQueryForm(populationQuery.jw.Form());
    });
}

function zhkQueryFn() {
    LoadModlues.loadJS(typeof populationQuery, 'Population/Population.js', function () {
        showQueryForm(populationQuery.zhk.Form());
    });
}

function kxQueryFn() {
    loadJs(typeof populationQuery, 'Population/Population.js', function () {
        var interval = setInterval(function () {
            if (typeof populationQuery.kx.form !== 'undefined') {
                showQueryForm(populationQuery.kx.form);
                clearInterval(interval);
            }
        }, 100);
    });
}

function companyFn() {
    LoadModlues.loadJS(typeof $param, 'Resources/js/Param.js', function () {
        LoadModlues.loadJS(typeof $company, 'Company/Company.js', function () {
            $company.grid.Show();
        });
    });
}

function companQueryFn() {
    LoadModlues.loadJS(typeof $companyquery, 'Company/companyQuery.js', function () {
        showQueryForm($companyquery.query.form);
    });
}

function employeeFn() {
    LoadModlues.loadJS(typeof $employeequery, 'Employee/employeeQuery.js', function () {
        showQueryForm($employeequery.query.GetOnCompany());
    });
}

function hotelFn() {
    LoadModlues.loadJS(typeof $hotel, 'Hotel/hotel.js', function () {
        $hotel.grid.Show();
    });
}

function hotelQueryFn() {
    LoadModlues.loadJS(typeof $hotelquery, 'Hotel/hotelQuery.js', function () {
        showQueryForm($hotelquery.query.form);
    });
}

function hotelStayQueryFn() {
    LoadModlues.loadJS(typeof $hotelstayquery, 'Hotel/hotelstayQuery.js', function () {
        showQueryForm($hotelstayquery.query.form);
    });
}

function hotelEmployeeQueryFn() {
    LoadModlues.loadJS(typeof $employeequery, 'Employee/employeeQuery.js', function () {
        showQueryForm($employeequery.query.GetOnHotel());
    });
}

function ckMapthemeFn() {
    loadJs(typeof $maptheme, 'Resources/js/maptheme.js', function () {
        $maptheme.Generator($maptheme.mod.CK).Load();
    });
}

function zkMapthemeFn() {
    loadJs(typeof $maptheme, 'Resources/js/maptheme.js', function () {
        $maptheme.Generator($maptheme.mod.ZK).Load();
    });
}

function zhkMapthemeFn() {
    loadJs(typeof $maptheme, 'Resources/js/maptheme.js', function () {
        $maptheme.Generator($maptheme.mod.ZHK).Load();
    });
}

function jwMapthemeFn() {
    loadJs(typeof $maptheme, 'Resources/js/maptheme.js', function () {
        $maptheme.Generator($maptheme.mod.Jw).Load();
    });
}

function popStatisticsFn() {
    loadJs(typeof $popstatistics, 'Statistics/statisticspopulation.js', function () {
        $popstatistics.show();
    });
}

function compStatisticsFn() {
    loadJs(typeof $compstatistics, 'Statistics/statisticscompany.js', function () {
        $compstatistics.show();
    });
}

function caseStatisticsFn() {

    loadJs(typeof $casestatistics, 'Statistics/statisticscase.js', function () {
        $casestatistics.show();
    });
}

function monitorStatisticsFn() {

    loadJs(typeof $monitorstatistics, 'Statistics/statisticsmonitor.js', function () {
        $monitorstatistics.show();
    });
}

function hotelStatisticsFn() {

    loadJs(typeof $hotelstatistics, 'Statistics/statisticshotel.js', function () {
        $hotelstatistics.show();
    });
}
//@ 案事件
function caseFn() {
    
    loadJs(typeof $ajmanager, 'AJJBXX/ajmanager.js', function () {
        //showQueryForm($ajmanager.form);
        showQueryForm($ajmanager.getForm());
    });
}

function gpsMangagerFn() {
    loadJs(typeof $gpsmanager, 'GlobalPostionSystem/manager.js', function () {
        $gpsmanager.Show({ req: 'pgallbind' });
    });
}

function gpsDisplayAtFn() {
    loadJs(typeof $gpsdisplay, 'GlobalPostionSystem/display.js', function () {
        showQueryForm($gpsdisplay.track.getForm());
    });
}

function gpsLocationsFn() {
    loadJs(typeof $gpsdisplay, 'GlobalPostionSystem/display.js', function () {
        showQueryForm($gpsdisplay.location.getForm());
    });
}

function gpsPanelQuery() {
    loadJs(typeof $gpsdisplay, 'GlobalPostionSystem/display.js', function () {
        showQueryForm($gpsdisplay.kx.getForm());
    });
}

//加载地址
function loadJs(obj, path, callback) {
    if (obj !== 'undefined') {
        return callback();
    }

    LoadModlues.loadJS(obj, path, function () {
        callback();
    });
}

//@public fn

//显示查询面板
function showQueryForm(c, fit) {
    //EMap.Clear();
    var containerid = 'cQueryCondition';
    var container = Ext.getCmp(containerid);
    container.removeAll();
    container.add({
        xtype: 'panel',
        layout: fit ? 'fit' : 'auto',
        border: 0,
        items: [c]
    });
}
