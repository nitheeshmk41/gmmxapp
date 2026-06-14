export const DEFAULT_WEBSITE_SECTIONS = [
  {
    sectionKey: "hero",
    sortOrder: 10,
    isEnabled: true,
    contentJson: JSON.stringify({
      title: "Transform Your Body",
      subtitle: "Join the best fitness community in town.",
      buttonText: "Join Now"
    })
  },
  {
    sectionKey: "services",
    sortOrder: 20,
    isEnabled: true,
    contentJson: JSON.stringify({
      title: "Our Services",
      subtitle: "Everything you need to reach your goals."
    })
  },
  {
    sectionKey: "pricing",
    sortOrder: 30,
    isEnabled: true,
    contentJson: JSON.stringify({
      title: "Membership Plans",
      subtitle: "Choose a plan that fits your needs."
    })
  },
  {
    sectionKey: "gallery",
    sortOrder: 40,
    isEnabled: true,
    contentJson: JSON.stringify({
      title: "Gallery",
      subtitle: "Take a look inside our facility."
    })
  },
  {
    sectionKey: "faq",
    sortOrder: 45,
    isEnabled: true,
    contentJson: JSON.stringify({
      title: "Frequently Asked Questions",
      subtitle: "Got questions? We've got answers.",
      questions: [
        { q: "What are your opening hours?", a: "We are open 24/7 for premium members." },
        { q: "Do you have personal trainers?", a: "Yes, we have certified trainers available for personal coaching." }
      ]
    })
  },
  {
    sectionKey: "cta",
    sortOrder: 48,
    isEnabled: true,
    contentJson: JSON.stringify({
      title: "Start Your Fitness Journey Today",
      subtitle: "Get a free trial pass and see the difference.",
      buttonText: "Claim Free Pass"
    })
  },
  {
    sectionKey: "contact",
    sortOrder: 50,
    isEnabled: true,
    contentJson: JSON.stringify({
      title: "Contact Us",
      subtitle: "We'd love to hear from you."
    })
  }
];
