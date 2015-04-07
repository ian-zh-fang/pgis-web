using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 从业人员信息处理程序
    /// </summary>
    public interface IEmployee
    {
        Model.TotalClass<List<Model.MEmployee>> QueryEmployees(string name, string code, string addr, int index, int size);

        Model.TotalClass<List<Model.MEmployee>> QueryEmployeesOnCompany(string name, string code, string addr, int index, int size);

        Model.TotalClass<List<Model.MEmployee>> QueryEmployeesOnHotel(string name, string code, string addr, int index, int size);

        Model.TotalClass<List<Model.MEmployee>> GetEmployeesOnCompany(string id, int index, int size);

        Model.TotalClass<List<Model.MEmployee>> GetQuitEmployeesOnCompany(string id, int index, int size);

        Model.TotalClass<List<Model.MEmployee>> GetEmployeesOnHotel(string id, int index, int size);

        Model.TotalClass<List<Model.MEmployee>> GetQuitEmployeesOnHotel(string id, int index, int size);
    }
}
