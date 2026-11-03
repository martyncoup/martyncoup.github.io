---
layout: post
title: "Take Control of Costs with Azure Cost Management"
date: "2022-03-17 00:00:00.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["Cloud Operations and FinOps"]
image: "https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg"
thumbnail: "https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg"
---

Today, I was very pleased to present my session Take Control of Costs with Azure Cost Management which is part of the {{<newtabref href="https://www.azurespringclean.com/" title="Azure Spring Clean">}} series.

If you missed the first showing of the session, you can watch it again over on my {{<newtabref href="https://www.youtube.com/watch?v=HqSEix3HAOE" title="YouTube Channel">}}. My thanks to Joe and Thomas for organising this great event, make sure you check out some of the other content from this week.

Cost Management is an important aspect of cloud management and is still one of the top priorities that people talk to me about either as customers, or at user groups and conferences. It is vitally important to understand where your costs are coming from and more important to understand what the costs are when they are higher than expected, or when you see large jumps in your usage.

In this post, I wanted to recap some of the concepts I discussed in the video.

## Organising resources with tags
Part of the {{<newtabref href="https://docs.microsoft.com/en-us/azure/cloud-adoption-framework/ready/azure-best-practices/naming-and-tagging" title="Cloud Adoption Framework">}} talks about the use of tags, it is important to develop a tagging strategy for your resources. Adding the appropriate tags to specific resources provides another way of generating insights to your costs as well as the other benefits that come with tagging.

The framework provides a number of recommendations around tagging, you don't have to do them all, but I would highly recommend doing at least the minimum, which will give you an understanding of what resources belong to what workload, which environment they belong to, and which business unit is responsible for them. Tags are just essentially key/value pairs, so you need a way of enforcing standards to ensure common format of tag keys, and values. Joe Fecht has a great post on this over on {{<newtabref href="https://cloudskills.io/blog/azure-policy-tagging" title="CloudSkills">}}.

Using policy you can enforce a level of consistency within your tags, this in turn can help ensure you have one single key and value pair that represent the same object within your business, instead of different cases of tag names, spellings of tag values, those sort of things.

## Azure Cost Management
Before you start looking at your usage in Azure Cost Management (ACM), it's important to understand how the data in ACM is scoped. Scoping follows the standard pattern for Microsoft Azure. This means the following scopes are available:

* Management Groups
* Subscriptions
* Resource Groups

If you set the scope on the initial _Overview_ page of ACM, any of the pages you visit on the blade will be scoped to what you select here.

![Azure Cost Management Scope](https://cdn.m12d.com/posts/take-control-of-costs-with-azure-cost-management/acm_scope.png "Figure 1 - Scope definition of Azure Cost Management")

### Cost analysis
Let's have a look first at the _Cost analysis_ screen within ACM. This is where the bulk of your work will take place. I speak to a lot of people who are quite intimidated by what they see when opening this page. Before we look at things we can do, let's have a look at the components on the screen, this will give us a better idea of how to use them.

![Cost Analysis](https://cdn.m12d.com/posts/take-control-of-costs-with-azure-cost-management/acm_costanalysis.png "Figure 2 - Cost analysis screen within Azure Cost Management")

Let's start by looking at the area highlighted in red. This area provides two purposes, the first is to select one of the pre-defined views which are available to you (more on this later), the second is for filtering. Firstly, as you can see by date, then secondly, you can add custom filters for a number of things, we will use this shortly.

The date range allows you to specify a number of pre-defined ranges, such as the last 7 days, 30 days, month, quarter, or year. You can also specify your own custom range if required. Filtering allows you to specify a number of different search criteria based on the data you would like to retrieve.

The green area on the image shows us the actual cost consumed in the period we have specified, as well as the forecasted costs over that period. If you have a budget defined, then you can add the budget to the chart to visually see when your costs will intercept.

Lastly, the yellow area. This gives us grouping options, depending on what data is shown on the chart, options to change the granularity of the data shown, and finally, to select the type of chart you want to display. In the middle is obviously the data that is getting rendered on the chart.

## Answering fundamental questions on costs
Now you are acquainted with the main screen, I want to talk you through answering a pretty common question. How can I identify what caused an increase in my cloud consumption? We can achieve this using the _Cost analysis_ screen we have just walked through. First of all we need to identify where the jump was so we can look at the data in more detail.

For this example, I have changed the date range to the last 12 months, I have also changed the granularity to monthly, and changed the chart type to a stacked column.

![Costs Between August and October](https://cdn.m12d.com/posts/take-control-of-costs-with-azure-cost-management/acm_monthly.png "Figure 3 - Chart showing increase in costs between August and October")

What you can now see, in the highlighted red area is that between August and October, my costs have increased fairly significantly, by around £1,100. I have put two lines across to make the difference easier to see. Now we know when the increase was, we can drill down onto that period and look at more details. So first of all I change the date range from the beginning of August 2021 to the end of October 2021.

Next, I am going to change the grouping to group the data by _Service name_. This now shows me the same data but the stacked chart shows me the costs on a per service basis.

![Costs by Service](https://sauksm12dblogfiles.blob.core.windows.net/posts/take-control-of-costs-with-azure-cost-management/acm_byservice.png "Figure 4 - Costs for the period shown split by service")

Looking at this chart, one thing that stands out quite clearly, is the increase in the light blue at the bottom of the chart, hover over the segment and it will tell you what it is as well as the cost. You can see the legend at the bottom of the image. I can see that around £667 of my increase is due to Virtual Machines. Some of the other slices make up smaller increases in costs.

Now I have identified that Virtual Machines are the reason for the increase, I can look at the resources which are responsible. To do this, change the group by filter to be _Resource_ and then add a new filter so that Service name is Virtual Machines. Then apply the filter. The contents of the chart changes again.

![D](https://sauksm12dblogfiles.blob.core.windows.net/posts/take-control-of-costs-with-azure-cost-management/acm_byresource.png "Figure 5 - Costs for the period split by service and grouped by resource")

Notice in the graph here that we only have a light blue segment in September and October? Well that indicates that the resource was not billed for in August, meaning it did not exist. You can do this with other colours on the charts as well and that starts to add up. Again, you can hover over the slices and see the resource name this time as well as the costs. You can also identify increases just like before here as well.

Together, these things start to add up and account for the increases you might have seen in your consumption.

### Saving views for reproduction
You can at the top of the screen click _Save_ or if it's an existing view _Save as_, which will enable you to save the configuration, which will then be listed in the drop down we discussed earlier. So you can have a generic date period in like _This Quarter_ or _Last Quarter_ and get information just like this in a short number of clicks.

## Summary
ACM is an incredibly powerful tool to use. There is so much more to it we have not covered in this post, but it's something everyone should spend time investigating. You can use it to investigate your cloud spend and highlight anomalies, answer questions your business may ask about cloud usage that you previously thought was difficult to identify. Check out the preview features as well to see what is coming in ACM.