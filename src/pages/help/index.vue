<template>
	<main class="xl:w-750 w-full">
		<section>
			<!-- Page title -->
			<article class="px-4 py-4 xl:px-6 xl:py-5">
				<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold xl:text-4xl">
					Need Some Help?
				</h1>
			</article>
			<div class="container px-4 pb-6 xl:px-6">
				<h3 class="text-primary mb-6 mt-4 text-xl font-semibold">Frequently Asked Questions</h3>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion1">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							How do I get started?
						</h4>
						<Plus
							:class="isOpen1 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen1 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen1 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							You can <nuxt-link to="/login" class="text-primary">login</nuxt-link> using Google, Discord, your NEAR
							wallet, or phone number. For the last two methods, importing a Blogchain private key is required. We
							create a NEAR wallet for each new user (unless they already have one), which is required in order to
							invoke a smart contract. Invoking smart contracts costs a small fee, but we are committed to keeping
							Blogchain free and will front this cost for everyone.<br /><br />
							Users, therefore, do not have to ever interact with their NEAR wallet. Once logged in, an onboarding guide
							will walk you through the main Blogchain features, as well as setting up your profile!
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion2">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							What is web3?
						</h4>
						<Plus
							:class="isOpen2 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen2 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen2 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							If you want to find out more about web3, please read our article
							<a
								href="https://blogchain.app/p/decentralization-basics-for-writers-what-is-web3/i6KczgY9Wt"
								target="_blank"
								class="text-primary font-semibold"
								>Decentralization Basics for Writers: What is Web3?</a
							>
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion3">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							What’s the difference between Capsule Social and Blogchain?
						</h4>
						<Plus
							:class="isOpen3 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen3 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen3 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Blogchain is created and operated by
							<a href="http://capsule.social/" target="_blank" class="text-primary">Capsule Social</a>. Capsule Social
							makes innovative tools to enable decentralized discourse. Our initial product is Blogchain, a publishing
							platform designed to empower writers as never before.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion4">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							How is Blogchain different from other social networks?
						</h4>
						<Plus
							:class="isOpen4 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen4 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen4 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Our platform is proudly a Web3 ecosystem, built upon the core principle of decentralization. We strongly
							believe this is the best way to empower writers both creatively and economically. <br />
							<br />

							By contrast, existing Web2 systems like Facebook and Twitter essentially act as centralized middlemen who
							insinuate themselves between creators and their audience as a way to extract
							<a
								href="https://corporatefinanceinstitute.com/resources/knowledge/economics/rent-seeking/"
								target="_blank"
								class="text-primary"
								>rent seeking</a
							>
							profits.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion5">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							What makes Blogchain different from other web3 social platforms?
						</h4>
						<Plus
							:class="isOpen5 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen5 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen5 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							In short, Blogchain provides the best combination of user-friendliness, social features, and integration
							of powerful web3 tools like the NEAR protocol, OrbitDB, and IPFS. We’ve tried to make publishing content
							to the decentralized web as easy for non-technical users as it is to post on familiar web2 services. By
							comparison, other web3 social products tend to be more targeted to developers or, at the very least,
							people who are already blockchain aficionados.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion6">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							How does Blogchain use blockchain technology?
						</h4>
						<Plus
							:class="isOpen6 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen6 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen6 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Blockchain is an important tool used to implement our broader idea of decentralization, which ultimately
							enhances the independence and freedom of speech for writers.<br /><br />

							We use the NEAR protocol to manage the flow of user activity on the platform. User content is stored to
							OrbitDB, which is a decentralized database that ensures immutability across multiple nodes. This ensures a
							greater resistance against censorship often found on centralized platforms. Such social network platforms
							use company controlled servers that ultimately give them sole authority on who gets to post what and
							when.<br /><br />

							In the future, we also plan to implement blockchain-based features that enable payments to creators for
							their work, as well as community-based governance of the Blogchain platform.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion7">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							What is IPFS, and how does it work within Blogchain?
						</h4>
						<Plus
							:class="isOpen7 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen7 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen7 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							IPFS is a peer-to-peer (meaning no central server) storage network that finds data using content
							addressing as opposed to location addressing. This difference is important because it is what allows us to
							verify using a unique content identifier (CID) that the content we receive is the legitimate one
							requested. We use IPFS to decentralize the transfer of data and to distribute the content to multiple
							nodes in order to increase accessibility and decrease any takedowns.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion8">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							What is NEAR protocol, and how does it work within Blogchain?
						</h4>
						<Plus
							:class="isOpen8 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen8 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen8 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							NEAR protocol is a blockchain that stores smart contracts (code stored on a blockchain). Upon
							registration, each user invokes a smart contract where their username and public key (like a signature
							which has a corresponding private key) are stored. When users post content, they automatically sign it
							with their private key, which we then validate with the public key stored on NEAR. This process allows us
							to ensure the validity of users and their posts. We also use NEAR protocol to authenticate user activity
							such as comments, follows, and reposts.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion9">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Do I need a crypto wallet to use the platform?
						</h4>
						<Plus
							:class="isOpen9 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen9 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen9 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Technically, yes. But if you don’t have one, we make setup really easy for newbies:<br /><br />

							Simply sign in with your existing Google or Discord identity, and the software will automatically create a
							wallet for you on the NEAR network, which Blogchain uses to handle on-chain transactions. That’s it.<br /><br />

							Of course, if you <span class="font-bold">do</span> already have a NEAR-compatible wallet, no need to set
							up a new one. Just use your your existing wallet to sign up.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion10">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Can I post on Blogchain for free?
						</h4>
						<Plus
							:class="isOpen10 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen10 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen10 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Yes. We want this to always be the case, so our social network can be used by a wide variety of writers in
							different fields to share their ideas.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion11">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							But then how does Blogchain make money?
						</h4>
						<Plus
							:class="isOpen11 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen11 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen11 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Blogchain is created and operated by
							<a href="http://capsule.social/" target="_blank" class="text-primary">Capsule Social</a>. We offer users
							the ability to create paid subscription models for their posts, whereby Capsule Social retains a 10%
							transaction fee.<br /><br />

							What we will <span class="font-bold">not</span> do, however, is sell ads or user information to third
							parties. We want to implement a business model for ourselves and our creators that is truly a win-win
							proposition, contrary to the exploitation that has become par for the course on other social networks.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion12">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							If I set up a paid publication, does all my content have to be paid?
						</h4>
						<Plus
							:class="isOpen12 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen12 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen12 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							We offer users the ability to create paid subscription models for their posts. Writers can manage how many
							subscription tiers they offer, how much each subscription costs, and which of their posts falls under
							which tier. Writers can just as easily make certain posts non-paid, and thereby viewable to all.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion13">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							What fees can I expect when creating a subscription offering for my posts?
						</h4>
						<Plus
							:class="isOpen13 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen13 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen13 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							An industry-standard 10% platform fee is deducted from the payout, plus Stripe transaction fees, should
							you elect to use Stripe as your payment processor.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion14">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							How does the platform use my personal data?
						</h4>
						<Plus
							:class="isOpen14 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen14 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen14 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Unlike traditional social networks, Blogchain does not algorithmically profile users, track you around the
							web, or sell ads to target your interests. If you share your email address or other information with us,
							we only use it to send you updates about Blogchain. That’s it.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion15">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							How does your algorithm work?
						</h4>
						<Plus
							:class="isOpen15 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen15 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen15 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							The term algorithm has been used lately in the mainstream to describe the ways in which Big Tech controls
							and manipulates the content you see. But simply, algorithms are just a set of instructions given to a
							computer to perform a desired task. Algorithms are essential in all programming, and we find it important
							to be as transparent as possible with how we have written our algorithms. In Blogchain, you will see three
							main feeds all using very intuitive algorithms: <br /><br />
						</p>
						<ul class="text-gray5 dark:text-gray3">
							<li>
								1. <span class="font-bold">Following:</span> Here you will see content sorted in chronological order
								from yourself and all users you follow.
							</li>
							<li>
								2. <span class="font-bold">New:</span> Here you will see all content published on Blogchain sorted using
								timestamps.
							</li>
							<li>
								3. <span class="font-bold">Top:</span> Each post has certain statistics (number of reposts, number of
								comments, number of comments by unique users) which is then analyzed to sort this feed by popularity.
							</li>
						</ul>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion16">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Can I delete my posts?
						</h4>
						<Plus
							:class="isOpen16 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen16 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen16 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							You can certainly remove posts from your profile. The removed post will no longer be discoverable via
							tags, reposts, or Blogchain’s feed.<br /><br />

							However, each post has a unique CID (content identifier), and we do not remove this CID from our database
							(OrbitDB). Instead, we add it to another database consisting of deleted content. Because of this, while
							posts are no longer discoverable, those who know the CID for a post can still load the content.<br /><br />

							Furthermore, since post content is added to IPFS, anyone who runs an IPFS node can store the content of
							the post. IPFS searches for data in the network using CIDs, so the post will always load as long as one
							person in the network is hosting the content. We at Capsule Social do not have control over this and
							therefore cannot facilitate any hard deletions.<br /><br />

							Users can similarly remove their comments on posts, as well as comments from others under their own posts.
							<br /><br />

							Please keep this all in mind as you publish your posts!
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion17">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							What type of moderation exists on Blogchain?
						</h4>
						<Plus
							:class="isOpen17 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen17 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen17 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Our plan is to instill community moderation. For now, we retain the ability to block users in order to
							ensure our collective space is not compromised by those who seek to abuse our platform. We currently have
							a <nuxt-link to="/contentpolicy" class="text-primary">Content Moderation Policy</nuxt-link> that outlines
							our motives and methods for such cases. This will eventually pivot towards a decentralized,
							community-based governance model.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion18">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Do I own my content on Blogchain?
						</h4>
						<Plus
							:class="isOpen18 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen18 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen18 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Any original content you publish to Blogchain remains yours and is protected by copyright and any other
							applicable intellectual property laws. However, please note that you agree to grant us a limited license
							to your content, which allows us to promote your content and help you succeed on Blogchain.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion19">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Can I repost content originally published on another site?
						</h4>
						<Plus
							:class="isOpen19 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen19 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen19 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							If you have complete ownership of the content and didn't sign an exclusive agreement that you would never
							repost your content elsewhere, yes! For example, you can repost an article that was originally on your
							Medium account.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion20">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Can I share my Blogchain content on other platforms?
						</h4>
						<Plus
							:class="isOpen20 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen20 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen20 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Yes. Each post on our platform generates a hyperlink that is usable anywhere on the web, including for
							purposes of sharing to other social networks. We even integrate Blogchain with a few of the more popular
							third-party services, like Twitter, to make sharing as easy as clicking a button.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion21">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Can multiple writers write for a single Blogchain post?
						</h4>
						<Plus
							:class="isOpen21 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen21 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen21 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Not at the moment. However, if this feature is important to you, make sure you add your suggestions to our
							“#wish-list” channel on Discord. Every week, our team reviews every suggestion and prioritizes them based
							on the number of requests received.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion22">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Can I write in a language other than English?
						</h4>
						<Plus
							:class="isOpen22 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen22 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen22 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							You can write in any language on Blogchain. However, the dashboard will remain in English. As our platform
							grows, and as we receive more requests, we will include different languages. Thank you for your patience.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion23">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Do my followers receive an email notification when I post on my Blogchain?
						</h4>
						<Plus
							:class="isOpen23 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen23 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen23 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Not at the moment. However, if this feature is important to you, make sure you add your suggestions to our
							“#wish-list” channel on Discord. Every week, our team reviews every suggestion and prioritizes them based
							on the number of requests received.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion24">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Does Capsule Social have a referral program?
						</h4>
						<Plus
							:class="isOpen24 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen24 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen24 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							We currently don’t have a referral program.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion25">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Do you offer crypto tips to users who find and report relevant bugs?
						</h4>
						<Plus
							:class="isOpen25 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen25 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen25 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Thank you for your interest. Unfortunately, not at this time. However, if anything changes, we’ll make
							sure to communicate it with our community through our Discord server.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion26">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Where can I make suggestions for improvement?
						</h4>
						<Plus
							:class="isOpen26 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen26 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen26 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							You can add your suggestions to our “#wish-list” channel on Discord. From there, we’ll take it back to the
							team to discuss and hopefully roll out!<br /><br />

							You can also submit any suggestions or issues using our form:
							<a
								href="https://xc633ok49p2.typeform.com/to/v5Xrfcpp?typeform-source=blogchain.apphttps://xc633ok49p2.typeform.com/to/v5Xrfcpp?typeform-source=blogchain.app"
								target="_blank"
								class="text-primary"
								>here</a
							>
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion27">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Still have an unanswered question?
						</h4>
						<Plus
							:class="isOpen27 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen27 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen27 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Reach out to us through
							<a href="https://discord.gg/HhVbaD2BHY" target="_blank" class="text-primary">Discord</a> or at
							<a :href="`mailto:support@capsule.social`" target="_blank" class="text-primary">support@capsule.social</a>
						</p>
					</div>
				</article>
			</div>
		</section>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'

import Plus from '@/components/icons/Plus.vue'
import Minus from '@/components/icons/Minus.vue'

interface IData {
	isOpen1: boolean
	isOpen2: boolean
	isOpen3: boolean
	isOpen4: boolean
	isOpen5: boolean
	isOpen6: boolean
	isOpen7: boolean
	isOpen8: boolean
	isOpen9: boolean
	isOpen10: boolean
	isOpen11: boolean
	isOpen12: boolean
	isOpen13: boolean
	isOpen14: boolean
	isOpen15: boolean
	isOpen16: boolean
	isOpen17: boolean
	isOpen18: boolean
	isOpen19: boolean
	isOpen20: boolean
	isOpen21: boolean
	isOpen22: boolean
	isOpen23: boolean
	isOpen24: boolean
	isOpen25: boolean
	isOpen26: boolean
	isOpen27: boolean
}

export default Vue.extend({
	components: {
		Plus,
		Minus,
	},
	layout: `help`,
	data(): IData {
		return {
			isOpen1: true,
			isOpen2: false,
			isOpen3: false,
			isOpen4: false,
			isOpen5: false,
			isOpen6: false,
			isOpen7: false,
			isOpen8: false,
			isOpen9: false,
			isOpen10: false,
			isOpen11: false,
			isOpen12: false,
			isOpen13: false,
			isOpen14: false,
			isOpen15: false,
			isOpen16: false,
			isOpen17: false,
			isOpen18: false,
			isOpen19: false,
			isOpen20: false,
			isOpen21: false,
			isOpen22: false,
			isOpen23: false,
			isOpen24: false,
			isOpen25: false,
			isOpen26: false,
			isOpen27: false,
		}
	},
	head() {
		return {
			title: `Help - Blogchain`,
			meta: [
				{
					hid: `help`,
					name: `help`,
					content: `Help - Blogchain`,
				},
			],
		}
	},
	methods: {
		toggleAccordion1() {
			this.isOpen1 = !this.isOpen1
		},
		toggleAccordion2() {
			this.isOpen2 = !this.isOpen2
		},
		toggleAccordion3() {
			this.isOpen3 = !this.isOpen3
		},
		toggleAccordion4() {
			this.isOpen4 = !this.isOpen4
		},
		toggleAccordion5() {
			this.isOpen5 = !this.isOpen5
		},
		toggleAccordion6() {
			this.isOpen6 = !this.isOpen6
		},
		toggleAccordion7() {
			this.isOpen7 = !this.isOpen7
		},
		toggleAccordion8() {
			this.isOpen8 = !this.isOpen8
		},
		toggleAccordion9() {
			this.isOpen9 = !this.isOpen9
		},
		toggleAccordion10() {
			this.isOpen10 = !this.isOpen10
		},
		toggleAccordion11() {
			this.isOpen11 = !this.isOpen11
		},
		toggleAccordion12() {
			this.isOpen12 = !this.isOpen12
		},
		toggleAccordion13() {
			this.isOpen13 = !this.isOpen13
		},
		toggleAccordion14() {
			this.isOpen14 = !this.isOpen14
		},
		toggleAccordion15() {
			this.isOpen15 = !this.isOpen15
		},
		toggleAccordion16() {
			this.isOpen16 = !this.isOpen16
		},
		toggleAccordion17() {
			this.isOpen17 = !this.isOpen17
		},
		toggleAccordion18() {
			this.isOpen18 = !this.isOpen18
		},
		toggleAccordion19() {
			this.isOpen19 = !this.isOpen19
		},
		toggleAccordion20() {
			this.isOpen20 = !this.isOpen20
		},
		toggleAccordion21() {
			this.isOpen21 = !this.isOpen21
		},
		toggleAccordion22() {
			this.isOpen22 = !this.isOpen22
		},
		toggleAccordion23() {
			this.isOpen23 = !this.isOpen23
		},
		toggleAccordion24() {
			this.isOpen24 = !this.isOpen24
		},
		toggleAccordion25() {
			this.isOpen25 = !this.isOpen25
		},
		toggleAccordion26() {
			this.isOpen26 = !this.isOpen26
		},
		toggleAccordion27() {
			this.isOpen27 = !this.isOpen27
		},
	},
})
</script>
<style>
.message-header {
	cursor: pointer;
}

.message-header .icon {
	transition: all 0.6s;
}

.message-body {
	padding: 0;
	max-height: 20em;
	overflow: hidden;
	transition: all 0.6s;
}

.plus0 {
	opacity: 0;
}

.plus1 {
	opacity: 1;
}

.minus0 {
	opacity: 0;
}

.minus1 {
	opacity: 1;
}

.is-closed {
	max-height: 0;
}
</style>
