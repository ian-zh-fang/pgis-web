using COM.TIGER.PGIS.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace COM.TIGER.PGIS.IFun
{
    /// <summary>
    /// 楼房
    /// </summary>
    public interface IBuilding
    {
        List<Model.MOwnerInfoEx> GetBuilding(params string[] ids);

        Model.TotalClass<List<Model.MOwnerInfoEx>> PageBuildings(string name, int index, int size);

        Model.TotalClass<List<Model.MOwnerInfoEx>> PageBuildingOnNameAndAddr(string name, string addr, int index, int size);

        List<Model.MRooms> GetRoomsOnBuilding(string id);

        List<Model.MCompany> GetCompneysOnBuilding(string id);

        List<Model.MCompany> GetCompneysOnUnit(string id);

        List<Model.MCompany> GetCompanysOnRoom(string id);

        List<object> TotalPopAndCom(string id);

        int AddOwnerInfo(Model.MOwnerInfoEx e);

        int UpdateOwnerInfo(Model.MOwnerInfoEx e);

        int DeleteOwnerInfos(params string[] ids);

        int AddUnit(Model.MUnitEx e);

        int UpdateUnit(Model.MUnitEx e);

        int DeleteUnits(params string[] ids);

        int AddStruct(Model.MParam e);

        int UpdateStruct(Model.MParam e);

        int DeleteStructs(params string[] ids);

        int AddUseType(Model.MParam e);

        int UpdateUseType(Model.MParam e);

        int DeleteUseTypes(params string[] ids);

        int AddProperty(Model.MParam e);

        int UpdateProperty(Model.MParam e);

        int DeleteProperties(params string[] ids);

        int AddRoom(Model.MRooms e);

        int UpdateRoom(Model.MRooms e);

        int DeleteRooms(params string[] ids);

        int AddPic(Model.MOwnerPic e);

        int UpdatePic(Model.MOwnerPic e);

        int DeletePics(params string[] ids);

        int AddPopulation(Model.MPopulationBasicInfoEx e);

        int UpdatePopulation(Model.MPopulationBasicInfoEx e);

        int DeletePopulations(params string[] ids);

        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetPopulationsOnBuilding(string id, int index, int size);

        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetPopulationsOnBuilding(string id, string livetypeid, int index, int size);

        Model.TotalClass<List<Model.MPopulationBasicInfoEx>> GetPopulationsOnUnit(string id, int index, int size);

        List<Model.MPopulationBasicInfoEx> GetPopulationsOnRoom(string id);

        List<Model.MOwnerPic> GetPics(string id);

        List<Model.MParam> GetStructs();

        List<Model.MParam> GetUseTypes();

        List<Model.MParam> GetProperties();

        List<Model.MUnit> GetUnitsOnBuilding(params string[] ids);

        List<Model.MRooms> GetRoomsOnUnit(string id);

        List<Model.MParam> GetGenders();

        List<Model.MParam> GetLiveTypes();

        List<Model.MParam> GetEducations();

        List<Model.MParam> GetProvinces();

        List<Model.MParam> GetCities();

        List<Model.MParam> GetPoliticalStatus();

        List<Model.MParam> GetBloodTypes();

        List<Model.MParam> GetSoldierStatus();

        List<Model.MParam> GetMarriageStatus();

        List<Model.MParam> GetPsychosisTypes();

        List<Model.MParam> GetHRelation();

        List<Model.MPopulationBasicInfoEx> GetPopulationHRelation(string number);

        List<Model.MTemporaryPopulation> GetTemporaryRecords(string id);

        List<Model.MAbroadPerson> GetAbroadRecords(string id);

        List<Model.MCompanyEmployee> GetCompanyRecords(string number);

        int CompanyAdd(string addr, string ids);

        int PopuAdd(string addr, string ids);
    }
}
