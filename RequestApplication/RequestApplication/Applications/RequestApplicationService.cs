using RequestApplication.Abstract;
using RequestApplication.Models;

namespace RequestApplication.Applications
{
    public class RequestApplicationService : IRequestApplicationService
    {
        private readonly IRequestApplicationRepository _applicationRepository;

        public RequestApplicationService(IRequestApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        public void AddRequest(RequestObj request)
        {
            request.ApplicationId = Guid.NewGuid();
            request.CreatedDate = DateTime.Now.ToString("dd/MM/yyyy");
            _applicationRepository.AddRequest(request);
        }

        public void DeleteRequest(Guid Id)
        {
            _applicationRepository.DeleteRequest(Id);
        }

        public IEnumerable<RequestObj> GetAllRequests()
        {
            return _applicationRepository.GetAllRequests();
        }

        public RequestObj? GetRequest(Guid Id)
        {
            return _applicationRepository.GetRequest(Id);
        }

        public void UpdateRequest(RequestObj request)
        {
            _applicationRepository.UpdateRequest(request);
        }
    }
}
