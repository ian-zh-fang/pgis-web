using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Hotel
{
    /// <summary>
    /// HotelHelp 的摘要说明
    /// </summary>
    public class HotelHelp : PageBase, IHttpHandler
    {
        [System.ComponentModel.Composition.Import(typeof(IFun.IHotel))]
        private IFun.IHotel _instance = null;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            { 
                case "page":
                    PageHotels();
                    break;
                case "getonhotel":
                    GetOnHotel();
                    break;
                case "getonroom":
                    //@ 指定人员同住人员
                    GetOnRoom();
                    break;
                case "getontogether":
                    //@ 指定人员同行人员
                    GetOnTogether();
                    break;
                case "getonmove":
                    //@ 指定人员入住轨迹
                    GetOnMove();
                    break;
                case "upd":
                    //@ 变更地址
                    UpdateAddress();
                    break;
                case "match":
                    //@ 模糊匹配酒店名称
                    MatchHotel();
                    break;
                case "qform":
                    //@ 前端查询酒店
                    QueryHotel();
                    break;
                case "sqform":
                    //@ 前端查询住宿人员
                    QueryHotelStay();
                    break;
                default:
                    break;
            }
        }

        //@ 前端查询住宿人员
        private void QueryHotelStay()
        {
            var name = HttpContext.Current.Request["Name"];
            var code = HttpContext.Current.Request["CredentialsNum"];
            var hname = HttpContext.Current.Request["HName"];
            var roomnum = HttpContext.Current.Request["PutinRoomNum"];
            var ptime = HttpContext.Current.Request["PutinTime"];
            var gtime = HttpContext.Current.Request["GetoutTime"];

            var data = _instance.QueryHotelStay(name, code, hname, roomnum, ptime, gtime, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 前端查询酒店
        private void QueryHotel()
        {
            var name = HttpContext.Current.Request["Name"];
            var addr = HttpContext.Current.Request["Addr"];

            var data = _instance.QueryHotel(name, addr, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 模糊匹配酒店名称
        private void MatchHotel()
        {
            var name = HttpContext.Current.Request["query"];

            var data = _instance.MatchHotel(name);
            ExecuteSerialzor(data);
        }

        //@ 变更地址
        private void UpdateAddress()
        {
            var id = HttpContext.Current.Request["ID"];
            var addr = HttpContext.Current.Request["Addr"];

            if (string.IsNullOrEmpty(addr)) {
                ExecuteObj(1);
                return;
            }

            var data = _instance.UpdateAddress(id, addr);
            ExecuteObj(data);
        }

        //@ 指定人员入住轨迹
        private void GetOnMove()
        {
            var id = HttpContext.Current.Request["id"];

            var data = _instance.GetOnMove(id, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 指定人员同行人员
        private void GetOnTogether()
        {
            var id = HttpContext.Current.Request["id"];
            var putintime = HttpContext.Current.Request["putintime"];

            var data = _instance.GetOnTogether(id, putintime);
            ExecuteSerialzor(data);
        }

        //@ 指定人员同住人员
        private void GetOnRoom()
        {
            var id = HttpContext.Current.Request["id"];
            var roomnum = HttpContext.Current.Request["roomnum"];
            var putintime = HttpContext.Current.Request["putintime"];

            var data = _instance.GetOnRoom(id, roomnum, putintime);
            ExecuteSerialzor(data);
        }

        //@ 分页获取指定酒店内的住宿人员信息
        private void GetOnHotel()
        {
            var id = HttpContext.Current.Request["id"];

            var data = _instance.GetOnHotel(id, CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        //@ 分页查询就酒店，宾馆，旅店详细信息
        private void PageHotels()
        {
            var data = _instance.PageHotels(CurrentPage, PagerSize);
            ExecuteSerialzor(data);
        }

        public new bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }
}