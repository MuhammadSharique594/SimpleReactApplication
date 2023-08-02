using RequestApplication.Models;

namespace RequestApplication.Infrastructure
{
    public class RequestApplicationDbContext
    {
        public RequestApplicationDbContext() 
        {
            for(var i=0; i < 20; i++)
            {
                ApplicationRequest.Add(new RequestObj
                {
                    ApplicationId = Guid.NewGuid(),
                    Subject = "Dummy Request " + ((int)(i + 1)).ToString(),
                    Text = "This is the Dummy request, you may create many requests like this. Hope you enjoy! Thanks!",
                    CreatedDate = DateTime.Now.ToString("dd-MM-yyyy"),
                    CreatedBy = "System Generated"
                });
            }
        
        }

        public IList<RequestObj> ApplicationRequest { get; set; } = new List<RequestObj>();// { 
        //    new RequestObj
        //    {
        //        ApplicationId = new Guid(),
        //        Subject = "Dummy Request",
        //        Text =  "This is the Dummy request, you may create many requests like this. Hope you enjoy! Thanks!",
        //        CreatedDate = DateTime.Now.ToString("dd-MM-yyyy"),
        //        CreatedBy = "System Generated"
        //    }
        //};

    }
}
