---
layout: post
title: "Azure App Configuration Feature Targeting in Angular"
date: "2022-03-25 15:55:00.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["Development"]
image: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
thumbnail: "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg"
---

Azure App Configuration has a great feature known as feature flags. This allows you to control aspects of your application using flag which determine if a feature is available or not. In this post we look at retrieving settings using an Angular service.

## Standard Features
One of the most basic implementations is to have flags defined with a simple boolean `true` or `false` to determine the state of that feature.

![New Feature](https://cdn.m12d.com/posts/azure-app-configuration-feature-targeting-in-angular/appcfg_newflag.png "Figure 1 - Creating a new feature flag in Azure App Config")

Adding a new feature is really simple, once it's created, you can then enable or disable it from the main _Feature manager_ pane by just clicking the check box.

## Targeted Features
Another common scenario would be supporting the availability of features based on a group or user who is logged in. Thankfully you can achieve this really easily using _Feature filters_ in Azure App Config.

![New Feature with Filtering](https://cdn.m12d.com/posts/azure-app-configuration-feature-targeting-in-angular/appcfg_filtering.png "Figure 2 - Creating a new feature flag in Azure App Config with filtering")

In the screenshot above, you can see we have enabled feature filters, selected the targeting type and then added a group, we're using the domain of microsoft.com in this example, it could be whatever you want. That way, when someone logs into your application with microsoft.com in their domain, it will now provide them access to this feature.

This now needs implementing into our Angular application so we can dynamically display features.

## Creating an Angular Service
In order to make this usable throughout your application, make use of an Angular service. If you use the command line, you can create a new scaffold service by issuing the following command: `ng generate service services/feature`. I create all my services in a folder of the same name, your implementation may be different.

From here you need to ensure you have the right packages installed. Using NPM, install the following packages.

```bash
npm install @azure/identity
npm install @azure/app-configuration
```

Next, you will need your read-only connection string from your App Config instance, it's important to use your read-only key, as with a SPA such as Angular, you must consider such a connection string as public.

In your environment file, enter a new entry for your connection string, something as follows.

```ts
export const environment = {
    appConfigConnectionString: 'Endpoint=https://...azconfig.io;Id=...;Secret=...';
    ...
}
```

Don't forget you'll need to add import statements for the modules we will be making use of. Open up your `feature.service.ts` file. Enter the following.

```ts
import { AppConfigurationClient } from "@azure/app-configuration";
import { environment } from 'src/environments/environment';
```

Next, we need to add some methods to our new service, above the constructor, add the following line:

```ts
client = new AppConfigurationClient(environment.appConfigConnectionString);
```

We now need some methods, I have three methods in my service, one that simply looks if the feature is enabled or not. Secondly one based on either group or user filtering as we discussed in the previous step.

Firstly, let's create a method with the following code to look for if the feature is enabled or not.

```ts
async isEnabled(featureName: string) {
    let val = await this.client.getConfigurationSetting({ key: ".appconfig.featureflag/" + featureName });
    return JSON.parse(val.value!).enabled;
}
```

Our response is a boolean based on the enabled value of the returned JSON object.

Next is a method which looks for the specific feature filter based on your group or domain.

```ts
async isEnabledForGroup(featureName: string, domain: string) {
    let val = await this.client.getConfigurationSetting({ key: ".appconfig.featureflag/" + featureName });
    let groups = JSON.parse(val.value!).conditions.client_filters[0].parameters.Audience.Groups;

    if (JSON.parse(val.value!).enabled === true) {
      return groups.some((group: any) => group.Name === domain);
    } else {
      return false;
    }
  }
```

This method is a little more involved, first of all, we are looking to make sure the feature is enabled, you could have the scenario where the feature is disabled but you are part of the filtering specification, so this check is ran before we look to see if your domain is part of any of the list of groups specified.

Finally, we do the same method for users, it's a simple change on the returned object from retrieving the feature flag configuration.

```ts
async isEnabledForUser(featureName: string, user: string) {
    let val = await this.client.getConfigurationSetting({ key: ".appconfig.featureflag/" + featureName });
    let users = JSON.parse(val.value!).conditions.client_filters[0].parameters.Audience.Users;

    if (JSON.parse(val.value!).enabled === true) {
      return users.some((user: any) => user.Name === user) && JSON.parse(val.value!).enabled;
    } else {
      return false;
    }
  }
```

## Implementing the Service
We now need to implement our service into one of our components. Imagine using this in your navigation menu component, we can now implement dynamically the menu based on feature availability. First of all, import your service, don't forget your paths may differ. You'll also need to include the service in your constructor as shown below.

```ts
import { FeatureService } from 'src/app/services/feature.service';
...
...
constructor(private featureService: FeatureService) {}
```

Next, you can set a variable and call the service to set the variable to either true or false based on the processing that takes place. Here are some examples of the implementation.

```ts
// Simple check on feature state
dashboardEnabled = this.featureService.isEnabled('Dashboard');

// Check for group based feature
dashboardEnabled = this.featureService.isEnabledForGroup('Dashboard', 'microsoft.com');

// Check for user based feature
dashboardEnabled = this.featureService.isEnabledForUser('Dashboard', 'user@microsoft.com');
```

Finally, instead of hiding using style visibility, which isn't a great way of hiding or showing features, you can make use of `ngIf` to determine if you want to render the HTML. Here is an example.

```html
<li *ngIf="(dashboardEnabled | async)">
    ...
</li>
```

## Summary
You would want to also consider that if someone knows the address of the route, then that does not stop them from accessing the route, you would need to consider implementing a custom guard potentially that could implement the same service and protect against that.

Otherwise, this provides a nice simple way to interact with feature flags in Azure App Configuration.