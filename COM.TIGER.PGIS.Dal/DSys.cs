using COM.TIGER.PGIS.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.Dal
{
    public class DSys:DBase
    {

        public List<MMenu> GetMenu(string id) 
        {
            var menus = Post<List<MMenu>>("GetMenusOnUser", "Menu", string.Format("id={0}", id)).Result; 
            //#region 模拟数据

            //List<MMenu> menus = new List<MMenu>();
            //menus.Add(new MMenu { Id = 1, PId = 0, Text = "实有楼房", Code = "building", Checked = 0, Description = "实有楼房查询、楼层房间分布、入住人员的查看", Disabled = 0, Handler = "", Iconcls = "bbuilding", Sort = 0 });
            //menus.Add(new MMenu { Id = 2, PId = 0, Text = "实有人口", Code = "population", Checked = 0, Description = "常住人口查询、暂住人口查询、境外人口查询、流动人口查询、重点人口查询", Disabled = 0, Handler = "", Iconcls = "bgroup", Sort = 1 });
            //menus.Add(new MMenu { Id = 3, PId = 0, Text = "案发情况", Code = "case", Checked = 0, Description = "发案查询、案件分布", Disabled = 0, Handler = "", Iconcls = "bbell", Sort = 2 });
            //menus.Add(new MMenu { Id = 4, PId = 0, Text = "GPS分析", Code = "gps", Checked = 0, Description = "GPS警力分布、警力框选查询、巡逻轨迹查询", Disabled = 0, Handler = "", Iconcls = "bs", Sort = 3 });
            //menus.Add(new MMenu { Id = 5, PId = 1, Text = "楼房查询", Code = "building_search", Checked = 0, Description = "楼房查询", Disabled = 0, Handler = "", Iconcls = "", Sort = 0 });
            //menus.Add(new MMenu { Id = 6, PId = 2, Text = "常住人口查询", Code = "population_resident", Checked = 0, Description = "常住人口查询", Disabled = 0, Handler = "", Iconcls = "", Sort = 0 });
            //menus.Add(new MMenu { Id = 7, PId = 2, Text = "暂住人口查询", Code = "population_temporary", Checked = 0, Description = "暂住人口查询", Disabled = 0, Handler = "", Iconcls = "", Sort = 1 });
            //menus.Add(new MMenu { Id = 8, PId = 3, Text = "发案查询", Code = "case_search", Checked = 0, Description = "案件查询", Disabled = 0, Handler = "", Iconcls = "", Sort = 0 });
            //menus.Add(new MMenu { Id = 9, PId = 3, Text = "案件分布", Code = "case_distributed", Checked = 0, Description = "案件分布", Disabled = 0, Handler = "", Iconcls = "", Sort = 1 });
            
            //#endregion

            return menus;
        }

        public List<MParam> GetParamByID(int id)
        {
            return Post<List<MParam>>("GetSubParams", "params", "id=" + id, "flag=false").Result; 
        }
        public TotalClass<List<MParam>> GetParamForPage(int start, int limit) {
            return Post<TotalClass<List<MParam>>>("PagingTopParams", "params", "index=" + start, "size=" + limit).Result; 
        }

        public int DeleteParam(string ids)
        {
            return Post<int>("DeleteEntity", "params", "id=" + ids).Result;
        }

        public int AddParam(string name, string code, string disabled, string sort, int pid)
        {
            return Post<int>("InsertNewForParams", "params", "name=" + name, "code=" + code, "disabled=" + disabled, "sort=" + sort, "pid=" + pid).Result;
        }

        public int UpdateParam(string name, string code, string disabled, string sort, int id,int pid)
        {
            return Post<int>("UpdateNewParams", "params", "name=" + name, "code=" + code, "disabled=" + disabled, "sort=" + sort, "id=" + id,"pid="+pid).Result;
        }

        public int AddMenu(Model.MMenu e)
        {
            var s = Newtonsoft.Json.JsonConvert.SerializeObject(e);
            return Post<int>("InsertNewForJson", "Menu", string.Format("v={0}", s)).Result;
        }

        public int UpdateMenu(Model.MMenu e)
        {
            var s = Newtonsoft.Json.JsonConvert.SerializeObject(e);
            return Post<int>("UpdateNewJson", "Menu", string.Format("v={0}", s)).Result;
        }
        
        public int DeleteMenus(params string[] ids)
        {
            var v = string.Join(",", ids);
            return Post<int>("DeleteEntities", "Menu", string.Format("ids={0}", v)).Result;
        }
        public TotalClass<List<MMenu>> PaginTopgMenu(int index, int size)
        {
            return Post<TotalClass<List<MMenu>>>("PagingTopMenus", "Menu",
                string.Format("index={0}", index), string.Format("size={0}", size), string.Format("sortfield={0}", "pgis_menu.sort")).Result;
        }
        
        public List<MMenu> GetSubMenus(int id, bool flag)
        {
            List<MMenu> menu =  Post<List<MMenu>>("GetSubMenus", "Menu", string.Format("id={0}", id), string.Format("flag={0}", flag)).Result;
            menu.Sort();
            return menu;
        }

        public List<MMenu> GetMenusTree()
        {
            var data = Post<List<MMenu>>("GetMenusTree", "Menu").Result;
            data = MMenu.Cast(data);
            return data;
        }
        
        public List<MDepartment> GetDepartmentsTree()
        {
            return Post<List<MDepartment>>("GetDepartmentsTree", "Department").Result;
        }
        
        public List<MRoleMenu> GetRoleMenus(int id)
        {
            return Post<List<MRoleMenu>>("GetRoleMenus", "Role", string.Format("id={0}", id)).Result;
        }

        public int SaveRoleMenus(int id, params string[] ids)
        {
            return Post<int>("SaveRoleMenus", "Role", string.Format("id={0}", id), string.Format("ids={0}", string.Join(",", ids))).Result;
        }


        public List<MUserRole> GetUserRoles(int id)
        {
            return Post<List<MUserRole>>("GetUserRoles", "User", string.Format("id={0}", id)).Result;
        }

        public int SaveUserRoles(int id, params string[] ids)
        {
            return Post<int>("SaveUserRoles", "User", string.Format("id={0}", id), string.Format("ids={0}", string.Join(",", ids))).Result;
        }

        public Model.MUser CheckUser(string username, string password)
        {
            return Post<Model.MUser>("CheckUser", "User",
                string.Format("username={0}", username),
                string.Format("password={0}", password)).Result;
        }

        public MUser GetUserInfo(int id)
        {
            return Post<Model.MUser>("GetEntity", "User", string.Format("id={0}", id)).Result;
        }

        public int ChangePassword(string password, int id)
        {
            return Post<int>("ChangePassword", "User", string.Format("password={0}", password), string.Format("id={0}", id)).Result;
        }

        public int ChangeInfo(int id, string name, string identityid, string tel, int gender)
        {
            return Post<int>("ChangeInfo", "User",
                string.Format("id={0}", id),
                string.Format("name={0}", name),
                string.Format("identityid={0}", identityid),
                string.Format("tel={0}", tel),
                string.Format("gender={0}", gender)).Result;
        }

        public List<MParam> GetParamsByCode(string code)
        {
            return Post<List<Model.MParam>>("GetSubParams", "params", string.Format("code={0}", code)).Result;
        }
    }
}
