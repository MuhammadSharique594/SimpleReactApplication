using RequestApplication.Models;

namespace RequestApplication.Abstract
{
    public interface IRequestApplicationRepository
    {
        RequestObj? GetRequest(Guid Id);
        IEnumerable<RequestObj> GetAllRequests(); 
        void AddRequest(RequestObj request);
        void DeleteRequest(Guid Id);
        void UpdateRequest(RequestObj request);
    }
}
