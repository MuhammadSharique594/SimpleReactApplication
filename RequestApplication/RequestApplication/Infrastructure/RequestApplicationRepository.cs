using RequestApplication.Abstract;
using RequestApplication.Models;
using System.Linq;

namespace RequestApplication.Infrastructure
{
    public class RequestApplicationRepository : IRequestApplicationRepository
    {
        private readonly RequestApplicationDbContext _dbContext;

        public RequestApplicationRepository(RequestApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public void AddRequest(RequestObj request)
        {
            _dbContext.ApplicationRequest.Add(request);
        }

        public void DeleteRequest(Guid Id)
        {
            var request = GetRequest(Id);

            if(request is not null)
            {
                _dbContext.ApplicationRequest.Remove(request);
            }
            else
            {
                throw new Exception("No Record found");
            }
        }

        public IEnumerable<RequestObj> GetAllRequests()
        {
            return _dbContext.ApplicationRequest.ToList();
        }

        public RequestObj? GetRequest(Guid Id)
        {
            return _dbContext.ApplicationRequest?.AsQueryable()?.FirstOrDefault(x => x.ApplicationId.Equals(Id));
        }

        public void UpdateRequest(RequestObj request)
        {
            var updatedRequest = GetRequest(request.ApplicationId);

            if (updatedRequest is not null)
            {
                updatedRequest.Subject = request.Subject;
                updatedRequest.Text = request.Text;
            }
            else
            {
                throw new Exception("No Record found");
            }
        }
    }
}
