---

layout: post
title: "Deploying Containers with Common Configuration"
date: "2022-01-21 15:52:30.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["DevOps and Platform Engineering"]
thumbnail: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=640"
image: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=1600"
---

You may well be aware of technology such as Helm and the creation of Helm Charts to manage applications on Kubernetes. It's a great solution if you want your container to be consumed by the general public, but what if you want a reusable YAML file to deploy your services internally.

We can easily have a template YAML file stored in a Git repository as part of Azure DevOps that can be used in our release pipelines and change placeholders based on variables set in our pipeline.

First of all, consider the following snippet from a Kubernetes YAML file:

```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{Release.Service}}-deploy
  namespace: {{Release.Namespace}}
```

Those placeholders can be replaced with the values required from your release pipeline. This can be achieved in a few ways. You could use a variable group as shown in the following screenshot.

![](https://blogm12d.files.wordpress.com/2022/01/image.png?w=715)

You could also use command line in the pipeline to dynamically set values (I've defined it statically in this example):

```yaml
steps:
- script: |
   echo '##vso\[task.setvariable variable=Release.Service\]api-recommendations'
   echo '##vso\[task.setvariable variable=Release.ServicePath\]recommendations'
  displayName: 'Set Environment Variables'
```

The final piece of the puzzle is to use the Replace Tokens task from the Marketplace, it's completely free and incredibly powerful.

```yaml
steps:
- task: qetza.replacetokens.replacetokens-task.replacetokens@4
  displayName: 'Replace tokens in service.yaml'
  inputs:
    rootDirectory: '$(System.DefaultWorkingDirectory)/\_aks-release-files'
    targetFiles: service.yaml
    tokenPattern: doublebraces
```

You can see that in the above example, I am referencing a file that I have downloaded from a Git repository, containing the file **service.yaml**. The final step is then to apply the YAML file to your AKS cluster. This can be done with the following pipeline task.

```yaml
steps:
- task: Kubernetes@1
  displayName: 'Deploy Application'
  inputs:
    connectionType: 'Azure Resource Manager'
    azureSubscriptionEndpoint: 'Demo'
    azureResourceGroup: 'rg-dev-001'
    kubernetesCluster: 'aks-dev-001'
    useClusterAdmin: true
    command: apply
    useConfigurationFile: true
    configuration: '$(System.DefaultWorkingDirectory)/\_aks-release-files/service.yaml'
```

Run the pipeline through and you will find that the variables are replaced with their true values, meaning you can both use common variables in variable groups and also use variables dynamically retrieved from another source such as Key Vault for example.

This way you have one managed template that is used in all of your deployments.