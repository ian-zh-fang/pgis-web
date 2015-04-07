using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Monitor
{
    /// <summary>
    /// MonitorHelp 的摘要说明
    /// </summary>
    public class MonitorHelp :PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IMonitor))]
        private IFun.IMonitor _instance;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "1":
                    //后台分页管理
                    Pagging();
                    break;
                case "add":    
                    //添加新的监控设备信息
                    AddEntity(EntityType.MONITOR);
                    break;
                case "upd":
                    //更新指定的监控设备信息
                    UpdateEntity(EntityType.MONITOR);
                    break;
                case "del":
                    //移除指定的监控设备信息
                    DeleteEntities(EntityType.MONITOR);
                    break;
                case "tadd":
                    //添加新的监控设备类型信息
                    AddEntity(EntityType.TYPE);
                    break;
                case "tupd":
                    //更新指定的监控设备类型信息
                    UpdateEntity(EntityType.TYPE);
                    break;
                case "tdel":
                    //移除指定的监控设备类型信息
                    DeleteEntities(EntityType.TYPE);
                    break;
                case "doadd":
                    //添加新的监控设备用途信息
                    AddEntity(EntityType.DOTYPE);
                    break;
                case "doupd":
                    //更新指定的监控设备用途信息
                    UpdateEntity(EntityType.DOTYPE);
                    break;
                case "dodel":
                    //移除指定的监控设备用途信息
                    DeleteEntities(EntityType.DOTYPE);
                    break;
                case "addr":
                    //自动完成地址查询
                    AutoCompleteAddress();
                    break;
                case "type":
                    //设备类型查询
                    GetTypes();
                    break;
                case "dotype":
                    //设备用途查询
                    GetDoTypes();
                    break;
                case "search":
                    //查询
                    PageQuery();
                    break;
                case "coords":
                    //框选查询
                    QueryDistribute();
                    break;
                default:
                    break;
            }
        }

        private void QueryDistribute()
        {
            var coords = HttpContext.Current.Request["coords"];
            var data = _instance.Query(coords);
            Execute(HttpContext.Current, data, true);
        }

        private void AddEntity(EntityType tp)
        {
            var data = 0;
            switch (tp)
            { 
                case EntityType.MONITOR:
                    data = _instance.AddDevice(GetQueryParamsCollection<Model.MMonitorDevice>());
                    break;
                case EntityType.TYPE:
                    data = _instance.AddType(GetQueryParamsCollection<Model.MParam>());
                    break;
                case EntityType.DOTYPE:
                    data = _instance.AddDoType(GetQueryParamsCollection<Model.MParam>());
                    break;
                default: 
                    break;
            }
            Execute(HttpContext.Current, data);
        }

        private void UpdateEntity(EntityType tp)
        {
            var data = 0;
            switch (tp)
            {
                case EntityType.MONITOR:
                    data = _instance.UpdateDevice(GetQueryParamsCollection<Model.MMonitorDevice>());
                    break;
                case EntityType.TYPE:
                    data = _instance.UpdateType(GetQueryParamsCollection<Model.MParam>());
                    break;
                case EntityType.DOTYPE:
                    data = _instance.UpdateDoType(GetQueryParamsCollection<Model.MParam>());
                    break;
                default:
                    break;
            }
            Execute(HttpContext.Current, data);            
        }

        private void DeleteEntities(EntityType tp)
        {
            var ids = HttpContext.Current.Request["ids"];
            var data = 0;
            switch (tp)
            {
                case EntityType.MONITOR:
                    data = _instance.DeleteDevices(ids);
                    break;
                case EntityType.TYPE:
                    data = _instance.DeleteTypes(ids);
                    break;
                case EntityType.DOTYPE:
                    data = _instance.DeleteDoTypes(ids);
                    break;
                default:
                    break;
            }
            Execute(HttpContext.Current, data);   
        }

        private void GetTypes()
        {
            var data = _instance.GetTypes();
            Execute(HttpContext.Current, data, true);
        }

        private void GetDoTypes()
        {
            var data = _instance.GetDoTypes();
            Execute(HttpContext.Current, data, true);
        }

        private void Pagging()
        {
            var data = _instance.Page(CurrentPage, PagerSize);
            Execute(HttpContext.Current, data, true);
        }

        private void AutoCompleteAddress()
        {
            var data = _instance.Match(HttpContext.Current.Request["query"]);
            Execute(HttpContext.Current, data, true);
        }

        private void PageQuery()
        {
            var name = HttpContext.Current.Request["Name"];
            var num = HttpContext.Current.Request["Num"];
            var dotypeid = string.IsNullOrWhiteSpace(HttpContext.Current.Request["DoTypeID"]) ? 0 : Convert.ToInt32(HttpContext.Current.Request["DoTypeID"]);
            var address = HttpContext.Current.Request["Addr"];
            var data = _instance.PageQuery(name, num, dotypeid, address, CurrentPage, PagerSize);
            Execute(HttpContext.Current, data, true);
        }

        public new bool IsReusable
        {
            get
            {
                return false;
            }
        }

        enum EntityType : byte
        {
            MONITOR = 0x00,
            TYPE,
            DOTYPE,
        }
    }
}