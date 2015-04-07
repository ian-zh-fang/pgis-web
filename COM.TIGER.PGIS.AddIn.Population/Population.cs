using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.AddIn.Population
{
    [System.ComponentModel.Composition.Export(typeof(IFun.IPopulation))]
    public class Population:IFun.IPopulation
    {
        private Dal.DPopulation _instance = new Dal.DPopulation();

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetSYPopulation(string name, string addr, int index, int size)
        {
            return _instance.GetSYPopulation(name, addr, index, size);
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetCKPopulation(string name, string addr, int index, int size)
        {
            return _instance.GetCKPopulation(name, addr, index, size);
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetZAKPopulation(string name, string cno, string hname, string addr, int index, int size)
        {
            return _instance.GetZAKPopulation(name, cno, hname, addr, index, size);
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetJWPopulation(string cname, string fname, string lname, string visaid, string portid, string addr, int index, int size)
        {
            return _instance.GetJWPopulation(cname, fname, lname, visaid, portid, addr, index, size);
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetZHKPopulation(string name, string typeid, string addr, int index, int size)
        {
            return _instance.GetZHKPopulation(name, typeid, addr, index, size);
        }
        
        public Model.MPopulationBasicInfoEx GetPopulationOnCode(string code)
        {
            return _instance.GetPopulationOnCode(code);
        }
        
        public List<Model.Maptheme> GetGroupByOwnerinfo(string x1, string y1, string x2, string y2, string mod)
        {
            return _instance.GetGroupByOwnerinfo(x1, y1, x2, y2, mod);
        }
        
        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> PagePopulation(string query, int index, int size)
        {
            return _instance.PagePopulation(query, index, size);
        }

        public Model.MElementHot LoactionPopu(string addrid)
        {
            return _instance.LoactionPopu(addrid);
        }

        public Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetKXPopulation(string coords, int index, int size)
        {
            return _instance.GetKXPopulation(coords, index, size);
        }
    }
}
