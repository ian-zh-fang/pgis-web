using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Employee
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IEmployee))]
    public class Employee:IFun.IEmployee
    {
        private Dal.DEmployee _instance = new Dal.DEmployee();
        
        public Model.TotalClass<List<Model.MEmployee>> QueryEmployees(string name, string code, string addr, int index, int size)
        {
            return _instance.QueryEmployees(name, code, addr, index, size);
        }

        public Model.TotalClass<List<Model.MEmployee>> GetEmployeesOnCompany(string id, int index, int size)
        {
            return _instance.GetEmployeesOnCompany(id, index, size);
        }

        public Model.TotalClass<List<Model.MEmployee>> GetQuitEmployeesOnCompany(string id, int index, int size)
        {
            return _instance.GetQuitEmployeesOnCompany(id, index, size);
        }
        
        public Model.TotalClass<List<Model.MEmployee>> QueryEmployeesOnCompany(string name, string code, string addr, int index, int size)
        {
            return _instance.QueryEmployeesOnCompany(name, code, addr, index, size);
        }

        public Model.TotalClass<List<Model.MEmployee>> QueryEmployeesOnHotel(string name, string code, string addr, int index, int size)
        {
            return _instance.QueryEmployeesOnHotel(name, code, addr, index, size);
        }

        public Model.TotalClass<List<Model.MEmployee>> GetEmployeesOnHotel(string id, int index, int size)
        {
            return _instance.GetEmployeesOnHotel(id, index, size);
        }

        public Model.TotalClass<List<Model.MEmployee>> GetQuitEmployeesOnHotel(string id, int index, int size)
        {
            return _instance.GetQuitEmployeesOnHotel(id, index, size);
        }
    }
}
