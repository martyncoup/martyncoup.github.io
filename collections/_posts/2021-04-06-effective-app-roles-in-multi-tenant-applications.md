---

layout: post
title: "Effective App Roles in Multi-Tenant Applications"
date: "2021-04-06 10:05:35.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["Authorization", "Azure AD", "Cloud Management Platform", "Dot Net Core", "Identity"]
thumbnail: "https://images.unsplash.com/photo-1551263640-1c007852f616?q=80&w=640"
image: "https://images.unsplash.com/photo-1551263640-1c007852f616?q=80&w=1600"
---

As I begin work on the cloud management platform at Transparity, I've been very clear that wherever possible, we need to make use of built-in features in the .NET Core framework as well as the Azure platform.

Identity is one of the areas where this falls firmly into line, and you actually have a number of great options available to you. I've opted for Azure AD in this rather than Azure AD B2C, the reason for that is that I don't have a need for people to login with identity providers other than Azure AD, and setting up B2C for multi-tenant Azure AD support is troublesome.

The Problem
-----------

When you look at the [official documentation](https://docs.microsoft.com/en-us/azure/architecture/multitenant-identity/app-roles) for application roles for multi-tenant identity, you are presented with three options. These options are:

*   App Roles from Azure AD
*   Roles using Azure AD Security Groups
*   Roles using an Application Role Manager

Using my ethos above, I explored using App Roles in Azure AD, the beauty of using App Roles in Azure AD, tied in with the MSAL libraries for authentication in .NET Core is that you can use those role names directly in your `[Authorize]` attribute when you decorate your methods or controller.

This solution sounds great to me, but given the cloud management platform will evolve, what happens when I add new roles in? Do the new roles propagate down to tenants which have already signed up for the application? Sadly, at the time of writing, the answer is no. In order for this to happen you would need to perform the admin consent part of your onboarding again, while I understand why this needs to happen, the user experience of having to run a similar process every time we released new features that carried new permissions was cumbersome.

Using security groups for me is out of the question as well, as the application is multi-tenanted, I cannot mandate the format of the security group names and defining all of them in code would be a task alone.

What about using an application role manager, as the documentation states the benefits are that the application is in control of the role based permissions but we have to store some user data to achieve this.

The Solution
------------

Given the concerns I have just mentioned, how can we still achieve this but make it as easy as possible. First of all, this solution does work, if you think about some core requirements of the platform, such as giving tenants control of who has access to each role, rather than the MSP controlling that, then it works well.

The big question for me is how do we clear up unwanted entries in the database, such as when a user leaves and their account is disabled or the tenant is removed because they no longer use our services.

I am still thinking about the first one, but the second one can be done as part of the offboarding process and the records cleared up, given I'll know which user belongs to which tenant.

First of all, we need two tables in the database to make this possible.

![](/content/images/2021/04/image.png)

Two tables required to support role based claims from the database

The first `dbo.Roles` allows us to store our actual roles, then the `dbo.RolesMap` table stores the mapping between first of all the `ObjectId` which is the unique ID from the [`http://schemas.microsoft.com/identity/claims/objectidentifier`](http://schemas.microsoft.com/identity/claims/objectidentifier) claim and the `Id` of the role name. This allows us to match up which user is assigned to which role, and supports the assignment of multiple roles.

Next is the code we use to make this possible.

[https://gist.github.com/martyncoup/93f1d909f4eb0c83b2f21fc3b4d69a40.js](https://gist.github.com/martyncoup/93f1d909f4eb0c83b2f21fc3b4d69a40.js)

The code is simple, we just look at the database (I'm using EF Core), then loop the results to support roles and then add to a claims object. Then add to the existing principal.

![](/content/images/2021/04/image-1.png)

Role claim shown in a list of available claims

Then hitting my development machine I can see the claim is now shown with the rest of my claims and I can use this either in an authorization policy or directly using the attribute `[Authorize(Role = "Global Administrator")]`.

### Group Based Roles

That works fine for users, but what about group based role assignment. You can achieve this in a very similar way. As we are using the object ID of the user, you can use the same group ID. You first of all need to make sure your app registration in Azure AD is configured to receive group claims. You can do this in the **Optional claims** section of the portal.

![](/content/images/2021/04/image-2.png)

Screenshot showing the group claims configuration.

From a security perspective, I left the Group ID claim coming through the ID token, that way I get a GUID rather than a group name like I would with the other options. As both the user ID and the group ID are GUIDs, we can use that in the same way.

Now when you assign a group ID to a role, it's the same format, no changes needed in the database. From a code perspective, we need to consider multiple groups, so we can loop through using LINQ for this and a very similar statement as before.

[https://gist.github.com/martyncoup/2571f30376350084b8a51ce7017ec860.js](https://gist.github.com/martyncoup/2571f30376350084b8a51ce7017ec860.js)

This is very similar to the first approach for users, we just combine against our search list. This is the same as doing a WHERE IN clause in SQL. The final code for this is as follows, again, very simple to do.

[https://gist.github.com/martyncoup/83ebf6b78852c677a43226606b46fb9f.js](https://gist.github.com/martyncoup/83ebf6b78852c677a43226606b46fb9f.js)

Summary
-------

There you have it, it's quite simple to do, we have detached the identity from the role model in this scenario letting you have a simpler way of managing your application roles.