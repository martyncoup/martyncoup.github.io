---
layout: post
title: "Tracking Santa in Real-Time: Building a Festive .NET App with Blazor and SignalR"
date: 2025-12-01 08:00:00.000000000 +00:00
description: "Every Christmas Eve, millions of children follow Santa’s journey around the world. This year, we’re going one step further: we’re building our own real-time Santa Tracker, powered by .NET, Blazor, SignalR, and a sprinkle of North Pole magic."
layout: post
authors: ["Martyn Coupland"]
categories: ["Festive Tech Calendar", ".NET", "Blazor", "SignalR"]
thumbnail: "/assets/images/posts/2025/12/merry-christmas-2999722_1280"
image: "/assets/images/posts/2025/12/merry-christmas-2999722_1280"
---

Every Christmas Eve, millions of children follow Santa’s journey around the world. This year, we’re going one step further: we’re building our own real-time Santa Tracker, powered by .NET, Blazor, SignalR, and a sprinkle of North Pole magic.

This post walks you through how to build an app that tracks Santa’s location in real-time on an interactive world map. As he travels between cities, every browser connected to the site updates instantly, no refreshes, no polling, just pure Christmas tech wizardry.

By the end, you’ll understand:

- How SignalR enables real-time communication
- How Blazor Server makes interactive apps easy
- How to broadcast location updates to all clients
- How to create a fun, festive project using .NET

Let’s get our sleigh in the air!

# Why SignalR is Perfect for Christmas Magic

Santa delivers millions of presents in a single night. Every elf, reindeer, and excited child needs to know where he is at any given moment. That means fast, real-time updates, and SignalR is built for exactly that.

SignalR provides:

- Real-time client/server communication
- Automatic WebSocket fallback
- Simple-to-use messaging patterns
- Broadcasting to all connected clients

It’s basically the Christmas spirit packaged as a .NET library.

Blazor Server complements this by making it easy to:

- Render dynamic UI
- Handle events
- Combine C# with browser interactivity
- Reduce JavaScript (except for our map!)

Together, they’re the perfect team: like Santa and Rudolph.

# Project Setup

Create a new Blazor Server project:

```bash
dotnet new blazorserver -n SantaTracker
cd SantaTracker
```

Install SignalR (though Blazor Server includes it already):

```bash
dotnet add package Microsoft.AspNetCore.SignalR
```

We’re now ready to deck the halls with some real-time features.

# Step 1: Create the SantaHub

This hub will broadcast Santa’s location to every connected client.

Create `Hubs/SantaHub.cs` in your project, add the following code:

```csharp
using Microsoft.AspNetCore.SignalR;

namespace SantaTracker.Hubs
{
    public class SantaHub : Hub
    {
        public async Task SendLocation(double lat, double lng)
        {
            await Clients.All.SendAsync("ReceiveLocation", lat, lng);
        }
    }
}
```

## What's going on here?

- `SendLocation` is a method we can call to broadcast Santa’s coordinates.
- `Clients.All.SendAsync` pushes the update to every browser.
- The clients listen for `"ReceiveLocation"` and update their map.

Simple, magical, effective.

# Step 2: Simulating Santa's Route

We’re not going to wait for Santa to fly for real, let’s fake his journey through famous cities.

Create `Services/SantaTrackerService.cs`:

```csharp
using Microsoft.AspNetCore.SignalR;
using SantaTracker.Hubs;

namespace SantaTracker.Services
{
    public class SantaTrackerService : BackgroundService
    {
        private readonly IHubContext<SantaHub> _hubContext;
        private readonly ILogger<SantaTrackerService> _logger;

        private readonly (double lat, double lng)[] _route =
        {
            (90.0, 135.0),       // North Pole
            (60.1699, 24.9384),  // Helsinki
            (51.5074, -0.1278),  // London
            (48.8566, 2.3522),   // Paris
            (40.7128, -74.0060), // New York
            (34.0522, -118.2437),// Los Angeles
            (-33.8688, 151.2093),// Sydney
            (90.0, 135.0)        // Return to North Pole
        };

        public SantaTrackerService(IHubContext<SantaHub> hubContext, ILogger<SantaTrackerService> logger)
        {
            _hubContext = hubContext;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("Santa Tracker started!");
            var index = 0;

            while (!stoppingToken.IsCancellationRequested)
            {
                var (lat, lng) = _route[index];
                await _hubContext.Clients.All.SendAsync("ReceiveLocation", lat, lng);

                _logger.LogInformation($"Santa moved to lat: {lat}, lng: {lng}");

                index = (index + 1) % _route.Length;
                await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
            }
        }
    }
}
```

Every five seconds, Santa moves to the next location, with this the location is broadcast to every connected browser client.

# Step 3: Register SignalR and Background Service

In order to ensure our services are picked up in our app, we need to register them. Update `Program.cs` to contain the following.

```csharp
using SantaTracker.Hubs;
using SantaTracker.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();
builder.Services.AddSignalR();
builder.Services.AddHostedService<SantaTrackerService>();

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

app.MapBlazorHub();
app.MapHub<SantaHub>("/santahub");
app.MapFallbackToPage("/_Host");

app.Run();
```

This code does three things:

- Registers SignalR
- Starts the Santa simulator
- Maps the SantaHub endpoint

Your backend is ready to deliver Christmas cheer.

# Step 4: Creating the Real-Time Map

To keep this integration simple, we'll use `Leaflet.js`, this is a lightweight open-source map library.

Open your `Pages/Index.razor` and update the content.

```csharp
@page "/"
@inject IJSRuntime JS

<h3 class="text-center">🎅 Santa’s Real-Time Sleigh Tracker 🎄</h3>

<div id="map" style="height:500px;"></div>

@code {
    protected override async Task OnAfterRenderAsync(bool firstRender)
    {
        if (firstRender)
        {
            await JS.InvokeVoidAsync("initMap");
        }
    }
}
```

We'll now use a little JavaScript to connect the map to SignalR, create `wwwroot/js/santa.js` and add the following content:

```javascript
let map, marker, connection;

async function initMap() {
  map = L.map("map").setView([90.0, 135.0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  marker = L.marker([90.0, 135.0]).addTo(map).bindPopup("🎅 Santa is here!").openPopup();

  connection = new signalR.HubConnectionBuilder().withUrl("/santahub").build();

  connection.on("ReceiveLocation", (lat, lng) => {
    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng]);
  });

  await connection.start();
}
window.initMap = initMap;
```

We now need to make sure these scripts are added to our `_Host.cshtml` file. Do this with the following code:

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />

<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/microsoft-signalr/7.0.5/signalr.min.js"></script>
<script src="js/santa.js"></script>
```

Here we are achieving several things:

- Including the stylesheet for Leaflet.js
- Including the JavaScript for Leaflet.js
- Finally, including the SingalR JavaScript library

# Step 5: Run the Magic

We are now ready to try running our application! Simply use `dotnet run` to start or run through your debugger.

Next, open two browser sessions side by side, or another device if you can. You'll now see Santa move across the world in real-time, without refreshing.

That’s SignalR working its own kind of Christmas magic.

# Final Thoughts

This project is fun, festive, and surprisingly practical. It demonstrates real concepts used in production systems:

- Live dashboards
- Real-time collaboration
- Tracking systems
- IoT telemetry
- Monitoring and observability

But with a Christmas twist.
