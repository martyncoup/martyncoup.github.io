---
layout: post
title: Validating Plus Addressing with .NET
date: 2024-11-19 20:55:42.000000000 +00:00
description: "Following a conversation about how great plus addressing is, I discussed some scenarios. You could use plus addressing to abuse a discount code, for example. Let's look at some code to see if a plus address matches the root email address."
layout: post
authors: ["Martyn Coupland"]
categories: [".NET", "Snippets"]
thumbnail: "/assets/images/posts/2024/11/plus-address-cover.png"
image: "/assets/images/posts/2024/11/plus-address-cover.png"
---

You can read more details about plus addressing. It is commonly known as subaddressing. You can also learn about the implementation of it in Exchange Online in the <a href="https://learn.microsoft.com/en-us/exchange/recipients-in-exchange-online/plus-addressing-in-exchange-online?wt.mc_id=AZ-MVP-5004020">Microsoft Docs</a>. The basic premise is simple. You can add a tag after a plus symbol in your local part of your email address. It will still be delivered to your mailbox.

This has some benefits as most systems will see this as a new email address. It's useful for testing new systems. You can also use it for filtering emails and many other applications.

What if you are developing a system where plus addressing is considered abuse? This could happen when offering a discount for a new customer.

```csharp
using System;

public static class Program
{
	public static bool IsPlusAddressUsed(string plus, string root)
	{
		var parts = plus.Split('@');
		var formattedEmail = $"{parts[0].Split('+')[0]}@{parts[1]}";
		return formattedEmail == root;
	}

	public static void Main()
	{
	    var email = "martyn@contoso.com";
	    var plusAddress = "martyn+plus@contoso.com";

    	Console.WriteLine(IsPlusAddressUsed(plusAddress, email));
    }

}
```

The above code, implements a very simple check. You can pass in a root address and a plus address. This allows you to check if the plus address is derived from the root email address. Then you can block the action if required.

You can take this further by implementing a lookup against your user service. This will get the email address directly, rather than just passing it in. This is just a simple example.

And there you have it. If you want to block people using plus addressing on your site, then it can easily be implemented.
