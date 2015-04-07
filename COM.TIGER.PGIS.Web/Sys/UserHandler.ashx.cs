using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace COM.TIGER.PGIS.Web.Sys
{
    /// <summary>
    /// UserHandler 的摘要说明
    /// </summary>
    public class UserHandler : PageBase, IHttpHandler
    {

        [System.ComponentModel.Composition.Import(typeof(PGIS.IFun.ISys))]
        private PGIS.IFun.ISys sys;

        public new void ProcessRequest(HttpContext context)
        {
            InitContainer(context);
            switch (context.Request["req"])
            {
                case "1":
                    PagingEntities();
                    break;
                case "2":
                    //获取指定用户的菜单
                    GetUserRoles();
                    break;
                case "3":
                    //保存新的角色信息
                    SaveUserRoles();
                    break;
                case "add":
                    //添加
                    AddEntity();
                    break;
                case "up":
                    //修改
                    UpdateEntity();
                    break;
                case "del":
                    DeleteEntities();
                    //删除
                    break;
                case "changepwd":
                    ChangePassword();
                    break;
                case "updata":
                    //修改用户资料
                    ChangeInfo();
                    break;
                default:
                    var obj = GetUserInfo();
                    Execute(context, obj);
                    break;
            }
        }

        private void ChangeInfo()
        {
            var name = HttpContext.Current.Request["Name"];
            var identityid = HttpContext.Current.Request["IdentityID"];
            var gender = int.Parse(HttpContext.Current.Request["Gender"]);
            var tel = HttpContext.Current.Request["Tel"];

            var user = GetUser();
            var data = sys.ChangeInfo(user.ID, name, identityid, tel, gender);
            if (data > 0)
            {//修改用户cookie数据

                user.Name = name;
                user.Gender = gender;
                if (user.Officer != null)
                {
                    user.Officer.IdentityID = identityid;
                    user.Officer.Tel = tel;
                }

                var ticketstr = GetTicketString(user);
                SetCookieValue(ticketstr);
            }

            Execute(HttpContext.Current, data);
        }

        private void ChangePassword()
        {
            var pwd = HttpContext.Current.Request["pwd"];
            var id = int.Parse(HttpContext.Current.Request["id"]);
            var data = sys.ChangePassword(pwd, id);
            if (data > 0) { 
                //更新用户信息
                //更新cookie信息
                var cookie = GetCurrentCookie();
                cookie.Expires = DateTime.Now.AddDays(-1);
                HttpContext.Current.Response.AppendCookie(cookie);
            }
            Execute(HttpContext.Current, data);
        }

        private void PagingEntities()
        {
            int start = Convert.ToInt32(System.Web.HttpContext.Current.Request["start"]);
            int limit = Convert.ToInt32(System.Web.HttpContext.Current.Request["limit"]);
            int index = start / limit + 1;
            int size = limit;
            var data = sys.PagingEntities<Model.MUser>(index, size);
            Execute(System.Web.HttpContext.Current, data, true);
        }

        private void GetUserRoles()
        {
            var c = System.Web.HttpContext.Current;
            var id = int.Parse(c.Request["id"]);
            var data = sys.GetUserRoles(id);
            Execute(c, data);

        }

        private void SaveUserRoles()
        {
            var c = System.Web.HttpContext.Current;
            var id = int.Parse(c.Request["id"]);
            var ids = c.Request["ids"];
            var data = sys.SaveUserRoles(id, ids.Split(','));
            Execute(c, data);
        }

        private void AddEntity()
        {
            var e = GetQueryParamsCollection<Model.MUser>();
            var v = sys.AddEntity<Model.MUser>(e);
            switch (v)
            { 
                case 0:
                case -1:
                    ExecuteObj(new { message = "数据保存失败", success = false });
                    break;
                case -2:
                    ExecuteObj(new { message = "账户名称重复", success = false });
                    break;
                default:
                    ExecuteObj(new { message = "", success = v });
                    break;
            }
        }

        private void UpdateEntity()
        {
            var e = GetQueryParamsCollection<Model.MUser>();
            var v = sys.UpdateEntity<Model.MUser>(e);
            switch (v)
            {
                case 0:
                case -1:
                    ExecuteObj(new { message = "数据保存失败", success = false });
                    break;
                case -2:
                    ExecuteObj(new { message = "账户名称重复", success = false });
                    break;
                default:
                    ExecuteObj(new { message = "", success = v });
                    break;
            }
        }

        private void DeleteEntities()
        {
            var c = System.Web.HttpContext.Current;
            var ids = c.Request["ids"];
            var v = sys.DeleteEntities<Model.MUser>(ids);
            Execute(System.Web.HttpContext.Current, v);
        }

        private object GetUserInfo()
        {
            var user = GetUser();
            if (null != user)
            {
                return new { state = true, result = user };
            }
            return new { state = false };
        }

        //从cookie中获取用户信息
        private Model.MUser GetUser()
        {
            var userStr = ((System.Web.Security.FormsIdentity)HttpContext.Current.User.Identity).Ticket.UserData;
            var user = Newtonsoft.Json.JsonConvert.DeserializeObject<Model.MUser>(userStr);
            return user;
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