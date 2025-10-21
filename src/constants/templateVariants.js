const basicsTemplates = {
  hero: ["default", "content", "minimal", "ads-with-content", "ads"],
  carousel: ["simple", "details", "link", "produits"],
  "2-col": [
    "without-ss",
    "without-ss-inverse",
    "2-images",
    "contact",
    "partners",
  ],
  calltoaction: ["contact", "centered", "2-col"],
  grid: ["cards", "blog-cards", "cards-without-image", "expertise", "galeries"],
  faq: ["accordeon", "list"],
};

export const templateTypeVariants = {
  default: {
    ...basicsTemplates,
  },

  detail: {
    ...basicsTemplates,
  },

  avec_sidebar_rdv: {
    hero: ["minimal", "split"],
    calltoaction: ["contact", "newsletter"],
  },
};
