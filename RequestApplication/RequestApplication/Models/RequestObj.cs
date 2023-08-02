namespace RequestApplication.Models
{
    public class RequestObj
    {
        public Guid ApplicationId { get; set; }
        public string? Subject { get; set; }
        public string? Text { get; set; }
        public string CreatedDate { get; set; }
        public string? CreatedBy { get; set; }
    }
}
