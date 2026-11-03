---

layout: post
title: "Breaking Changes to GitHub Actions"
date: "2020-11-20 21:10:00.000000000 +00:00"
authors: ["Martyn Coupland"]
categories: ["Breaking Changes", "GitHub", "GitHub Actions"]
thumbnail: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=640"
image: "https://images.unsplash.com/photo-1579458342405-52d7d969e0d4?q=80&w=1600"
---

While GitHub did indicate that a warning would appear that the culprit commands would in time be deprecated, this breaking change appears to have caught a number of people off guard. In my workflow for this blog I had noticed for some time that an error was displayed advising me that the `set-env` command in my case executed during the installation of Ruby was deprecated and soon to be disabled.

You can actually work around this issue quite easily, until all subsequent actions are updated at least downstream, you can add an environment variable to the command affected to allow the use of unsecure commands using the `ACTIONS_ALLOW_UNSECURE_COMMANDS` variable set to `true`. It can be set to true quite easily in your workflow as shown below.

```
- name: Install Ruby    uses: ruby/setup-ruby@ec106b438a1ff6ff109590de34ddc62c540232e0    env:        ACTIONS_ALLOW_UNSECURE_COMMANDS: 'true'    with:        ruby-version: 2.6
```

Once committed to the repository, the workflow will run depending on your configuration and should now complete without error.