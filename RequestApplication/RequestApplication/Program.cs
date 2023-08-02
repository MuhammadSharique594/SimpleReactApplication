using RequestApplication.Abstract;
using RequestApplication.Applications;
using RequestApplication.Infrastructure;
using RequestApplication.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<RequestApplicationDbContext>();
builder.Services.AddScoped<IRequestApplicationRepository, RequestApplicationRepository>();
builder.Services.AddScoped<IRequestApplicationService, RequestApplicationService>();

builder.Services.AddCors();
//    options =>
//{
//    options.AddDefaultPolicy(option =>
//    {
//        option.AllowAnyOrigin()
//        .AllowAnyHeader()
//        .AllowAnyMethod();
//    });
//});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors(policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());

app.MapGet("/ApplicatioRequest/Get/{id}", (Guid id, IRequestApplicationService requestApplicationService) =>
{
    return Results.Ok(requestApplicationService.GetRequest(id));
})
.AllowAnonymous();

app.MapGet("/ApplicatioRequest/GetAll", (IRequestApplicationService requestApplicationService) =>
{
    return Results.Ok(requestApplicationService.GetAllRequests());
})
.AllowAnonymous();

app.MapPost("/ApplicatioRequest/Add", (RequestObj requestObj, IRequestApplicationService requestApplicationService) =>
{
    requestApplicationService.AddRequest(requestObj);
    return Results.Ok();
})
.AllowAnonymous();

app.MapPut("/ApplicatioRequest/Update", (RequestObj requestObj, IRequestApplicationService requestApplicationService) =>
{
    requestApplicationService.UpdateRequest(requestObj);
    return Results.Ok();
})
.AllowAnonymous();

app.MapDelete("/ApplicatioRequest/Delete/{id}", (Guid id, IRequestApplicationService requestApplicationService) =>
{
    requestApplicationService.DeleteRequest(id);
    return Results.Ok();
})
.WithName("DeleteRequestApplication")
.AllowAnonymous();

app.Run();
