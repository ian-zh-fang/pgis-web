using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 人口
    /// </summary>
    public interface IPopulation
    {
        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetSYPopulation(string name, string addr, int index, int size);

        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetCKPopulation(string name, string addr, int index, int size);

        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetZAKPopulation(string name, string cno, string hname, string addr, int index, int size);

        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetJWPopulation(string cname, string fname, string lname, string visaid, string portid, string addr, int index, int size);

        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetZHKPopulation(string name, string typeid, string addr, int index, int size);

        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> PagePopulation(string query, int index, int size);

        Model.MPopulationBasicInfoEx GetPopulationOnCode(string code);

        List<Model.Maptheme> GetGroupByOwnerinfo(string x1, string y1, string x2, string y2, string mod);

        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetKXPopulation(string coords, int index, int size);

        Model.MElementHot LoactionPopu(string addrid);
    }
}
