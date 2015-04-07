using COM.TIGER.PGIS.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    public interface ISys
    {
        string InitMenu(string id);

        Model.MUser CheckUser(string username, string password);

        Model.MUser GetUserInfo(int id);

        List<MParam> GetParamByID(int id);

        TotalClass<List<MParam>> GetParamForPage(int start, int limit);

        List<Model.MParam> GetParamsByCode(string code);

        int DeleteParam(string ids);

        int AddParam(string name, string code, string disabled, string sort, int pid);

        int UpdateParam(string name, string code, string disabled, string sort, int id,int pid);

        int AddMenu(Model.MMenu e);

        int UpdateMenu(Model.MMenu e);

        int DeleteMenus(params string[] ids);

        TotalClass<List<MMenu>> PageTopMenus(int index, int size);

        List<MMenu> GetMenusTree();

        List<MMenu> GetSubMenu(int id, bool flag);

        List<MDepartment> GetDepartmentsTree();

        List<MRoleMenu> GetRoleMenus(int id);

        int SaveRoleMenus(int id, params string[] ids);

        List<MUserRole> GetUserRoles(int id);

        int SaveUserRoles(int id, params string[] ids);

        int ChangePassword(string password, int id);

        int ChangeInfo(int id, string name, string identityid, string tel, int gender);

        //================================================================
        //通用处理程序

        List<T> GetEntities<T>();

        TotalClass<List<T>> PagingEntities<T>(int index, int size);

        int AddEntity<T>(T t);

        int UpdateEntity<T>(T t);

        int DeleteEntities<T>(params string[] ids);
    }
}
