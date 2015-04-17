using COM.TIGER.PGIS.Dal;
using COM.TIGER.PGIS.IFun;
using COM.TIGER.PGIS.Model;
using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Data;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn
{
    [Export(typeof(ISys))]
    public class Sys:ISys
    {
        //153 1126 0879
        private const string HELPURLNAME = "HELPURL";

        private static readonly string HELPURL;
        static Sys()
        {
            HELPURL = System.Configuration.ConfigurationManager.AppSettings[HELPURLNAME];
        }

        private DSys sys = new DSys();
        private StringBuilder sb = new StringBuilder();
        /// <summary>
        /// 获取系统菜单
        /// </summary>
        /// <returns></returns>
        public string InitMenu(string id)
        {
            List<MMenu> menus = sys.GetMenu(id);
            menus.Sort();

            sb.Append("[");
            //sb.Append(GetHelpMenu());
            List<MMenu> pmenus = menus.Where<MMenu>(i => i.PId == 0&&i.Disabled==1).ToList();

            if (pmenus.Count > 0)
            {
                for (int i = 0; i < pmenus.Count; i++)
                {
                    sb.Append("{text: '" + pmenus[i].Text + "',menuid:'" + pmenus[i].Id.ToString() + "',key:'" + pmenus[i].Code + "',style: 'text-align:left;',iconCls: '" + pmenus[i].Iconcls + "'");
                    if (!string.IsNullOrWhiteSpace(pmenus[i].Handler))
                    {
                        sb.Append(",handler: " + pmenus[i].Handler);
                    }
                    GetChildMenus(menus, pmenus[i].Id, sb);

                    sb.Append("}");
                    if (i != pmenus.Count - 1)
                    {
                        sb.Append(",'-',");
                    }
                }
            }
            sb.Append("]");
            return sb.ToString();
        }

        /// <summary>
        /// 获取帮助菜单
        /// </summary>
        /// <returns></returns>
        private string GetHelpMenu() 
        {
            if (string.IsNullOrWhiteSpace(HELPURL))
                return null;

            string urlFmt = "text: '帮助',menuid:'{0}',key:'yhzx',style: 'text-align:left;',iconCls: 'bhelp'";
            urlFmt = string.Format(urlFmt, GuidToDouble(), HELPURL);
            urlFmt = string.Join("", "{", urlFmt, "}", ",'-',");
            return urlFmt;
        }

        private double GuidToDouble()
        {
            byte[] buffer = Guid.NewGuid().ToByteArray();
            return BitConverter.ToInt64(buffer, 0);
        }

        /// <summary>
        /// 获取系统子菜单
        /// </summary>
        /// <param name="menus"></param>
        /// <param name="menuid"></param>
        /// <param name="sb"></param>
        private void GetChildMenus(List<MMenu> menus, int menuid, StringBuilder sb)
        {
            List<MMenu> pmenus = menus.Where<MMenu>(i => i.PId == menuid && i.Disabled == 1).ToList();
            if (pmenus.Count > 0)
            {
                sb.Append(",menu: { xtype: 'menu',style: 'text-align:left;',items: [");
                for (int j = 0; j < pmenus.Count; j++)
                {
                    sb.Append("{text: '" + pmenus[j].Text + "',menuid:'" + pmenus[j].Id.ToString() + "',style: 'color:#000000',iconCls: '" + pmenus[j].Iconcls + "',key:'" + pmenus[j].Code + "'");
                    if (!string.IsNullOrWhiteSpace(pmenus[j].Handler))
                    {
                        sb.Append(",handler: " + pmenus[j].Handler);
                    }
                    GetChildMenus(menus, pmenus[j].Id, sb);
                    sb.Append("}");
                    if (j != pmenus.Count- 1)
                    {
                        sb.Append(",");
                    }
                }
                //sb.Append("],listeners: { mouseout: function (obj, e, itm) {if(e.getRelatedTarget()!=null){if (!e.getRelatedTarget().contains(e.getTarget()) && !obj.getEl().contains(e.getRelatedTarget())) {obj.hide();}else if (e.getRelatedTarget().contains(obj.getEl().dom)) {obj.hide();}}}}}");
                sb.Append("]}");
            }
        }
        
        /// <summary>
        /// 获取参数列表
        /// </summary>
        /// <returns></returns>
        public List<MParam> GetParamByID(int id)
        {
            return sys.GetParamByID(id);
        }
        public TotalClass<List<MParam>> GetParamForPage(int start, int limit)
        {
            return sys.GetParamForPage(start,limit);
        }


        public int DeleteParam(string ids)
        {
            return sys.DeleteParam(ids);
        }


        public int AddParam(string name, string code, string disabled, string sort, int pid)
        {
            return sys.AddParam(name, code, disabled, sort, pid);
        }


        public int UpdateParam(string name, string code, string disabled, string sort, int id,int pid)
        {
            return sys.UpdateParam(name, code, disabled, sort, id,pid);
        }


        public int AddMenu(Model.MMenu e)
        {
            return sys.AddMenu(e);
        }


        public int UpdateMenu(MMenu e)
        {
            return sys.UpdateMenu(e);
        }


        public int DeleteMenus(params string[] ids)
        {
            return sys.DeleteMenus(ids);
        }


        public TotalClass<List<MMenu>> PageTopMenus(int index, int size)
        {
            return sys.PaginTopgMenu(index, size);
        }


        public List<MMenu> GetSubMenu(int id, bool flag)
        {
            return sys.GetSubMenus(id, flag);
        }


        public List<MMenu> GetMenusTree()
        {
            return sys.GetMenusTree();
        }


        public List<MDepartment> GetDepartmentsTree()
        {
            return sys.GetDepartmentsTree();
        }


        public List<MRoleMenu> GetRoleMenus(int id)
        {
            return sys.GetRoleMenus(id);
        }

        public int SaveRoleMenus(int id, params string[] ids)
        {
            return sys.SaveRoleMenus(id, ids);
        }


        public List<MUserRole> GetUserRoles(int id)
        {
            return sys.GetUserRoles(id);
        }

        public int SaveUserRoles(int id, params string[] ids)
        {
            return sys.SaveUserRoles(id, ids);
        }

        //================================================================
        //通用处理程序

        public List<T> GetEntities<T>()
        {
            return sys.GetEntities<T>();
        }

        public TotalClass<List<T>> PagingEntities<T>(int index, int size)
        {
            return sys.PagingEntities<T>(index, size);
        }

        public int AddEntity<T>(T t)
        {
            return sys.AddEntity<T>(t);
        }

        public int UpdateEntity<T>(T t)
        {
            return sys.UpdateEntity<T>(t);
        }

        public int DeleteEntities<T>(params string[] ids)
        {
            return sys.DeleteEntities<T>(ids);
        }

        public Model.MUser CheckUser(string username, string password)
        {
            return sys.CheckUser(username, password);
        }

        public MUser GetUserInfo(int id)
        {
            return sys.GetUserInfo(id);
        }

        public int ChangePassword(string password, int id)
        {
            return sys.ChangePassword(password, id);
        }

        public int ChangeInfo(int id, string name, string identityid, string tel, int gender)
        {
            return sys.ChangeInfo(id, name, identityid, tel, gender);
        }


        public List<MParam> GetParamsByCode(string code)
        {
            return sys.GetParamsByCode(code);
        }
    }
}
